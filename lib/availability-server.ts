import { createClient } from "@/lib/supabase/server"
import type { RoomType } from "@/lib/types"

export interface RoomAvailability {
  roomTypeId: string
  totalRooms: number
  bookedRooms: number
  availableRooms: number
  priceForDates: number | null
  isBlocked?: boolean
  isClosed?: boolean
}

/**
 * Get room availability for a specific date range (server-side)
 */
export async function getRoomAvailability(
  hotelId: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailability[]> {
  const supabase = await createClient()

  // Fetch all room types for this hotel
  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("id, available_rooms, base_price")
    .eq("hotel_id", hotelId)

  if (!roomTypes || roomTypes.length === 0) {
    return []
  }

  // Check for availability blocks that affect this hotel or its rooms
  const roomTypeIds = roomTypes.map(r => r.id)
  let blocksQuery = supabase
    .from("availability_blocks")
    .select("hotel_id, room_type_id")
    .lte("start_date", checkOut)
    .gte("end_date", checkIn)
  
  if (roomTypeIds.length > 0) {
    blocksQuery = blocksQuery.or(`hotel_id.eq.${hotelId},room_type_id.in.(${roomTypeIds.join(",")})`)
  } else {
    blocksQuery = blocksQuery.eq("hotel_id", hotelId)
  }
  
  const { data: blocks } = await blocksQuery

  // Create a set of blocked room types
  const blockedRoomTypes = new Set<string>()
  let hotelBlocked = false
  
  blocks?.forEach((block) => {
    if (block.hotel_id === hotelId && !block.room_type_id) {
      // Entire hotel is blocked
      hotelBlocked = true
    } else if (block.room_type_id) {
      // Specific room type is blocked
      blockedRoomTypes.add(block.room_type_id)
    }
  })

  // Fetch confirmed/pending bookings that overlap with the requested dates
  const { data: bookings } = await supabase
    .from("bookings")
    .select("room_type_id")
    .eq("hotel_id", hotelId)
    .in("status", ["confirmed", "pending"])
    .lt("check_in_date", checkOut)
    .gt("check_out_date", checkIn)

  // Count bookings per room type
  const bookingCounts: Record<string, number> = {}
  bookings?.forEach((booking) => {
    bookingCounts[booking.room_type_id] = (bookingCounts[booking.room_type_id] || 0) + 1
  })

  // Fetch daily rates for the date range
  const { data: roomRates } = await supabase
    .from("room_rates")
    .select("room_type_id, date, price")
    .in("room_type_id", roomTypes.map((r) => r.id))
    .gte("date", checkIn)
    .lt("date", checkOut)

  // Group rates by room type and calculate average/total price
  const ratesMap: Record<string, number[]> = {}
  roomRates?.forEach((rate) => {
    if (!ratesMap[rate.room_type_id]) {
      ratesMap[rate.room_type_id] = []
    }
    ratesMap[rate.room_type_id].push(rate.price)
  })

  // Calculate availability for each room type
  return roomTypes.map((room) => {
    // Check if this room is blocked
    const isBlocked = hotelBlocked || blockedRoomTypes.has(room.id)
    
    const bookedRooms = bookingCounts[room.id] || 0
    
    // Calculate price for the date range
    const dailyRates = ratesMap[room.id] || []
    const nights = getDatesBetween(checkIn, checkOut).length
    
    // Room is only available if ALL dates in the range have rates set
    const hasAllRates = nights > 0 && dailyRates.length === nights
    const isClosed = !hasAllRates
    
    let priceForDates: number | null = null
    if (hasAllRates) {
      priceForDates = dailyRates.reduce((sum, price) => sum + price, 0)
    }
    
    // Room is unavailable if blocked, closed (no rates), or no rooms left
    const availableRooms = (isBlocked || isClosed) ? 0 : Math.max(0, room.available_rooms - bookedRooms)

    return {
      roomTypeId: room.id,
      totalRooms: room.available_rooms,
      bookedRooms,
      availableRooms,
      priceForDates,
      isBlocked,
      isClosed,
    }
  })
}

/**
 * Check if a specific room type is available for the given dates
 */
export async function isRoomAvailable(
  roomTypeId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; availableRooms: number }> {
  const supabase = await createClient()

  // Get total rooms for this room type
  const { data: roomType } = await supabase
    .from("room_types")
    .select("available_rooms")
    .eq("id", roomTypeId)
    .single()

  if (!roomType) {
    return { available: false, availableRooms: 0 }
  }

  // Count overlapping bookings
  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("room_type_id", roomTypeId)
    .in("status", ["confirmed", "pending"])
    .lt("check_in_date", checkOut)
    .gt("check_out_date", checkIn)

  const bookedRooms = count || 0
  const availableRooms = Math.max(0, roomType.available_rooms - bookedRooms)

  return {
    available: availableRooms > 0,
    availableRooms,
  }
}

/**
 * Get all dates between two date strings (exclusive of end date)
 */
function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const current = new Date(start)
  while (current < end) {
    dates.push(current.toISOString().split("T")[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

/**
 * Enhance room types with availability data
 */
export function mergeRoomTypesWithAvailability(
  roomTypes: RoomType[],
  availability: RoomAvailability[]
): (RoomType & { dynamicAvailability?: number; priceForDates?: number | null })[] {
  const availabilityMap = new Map(availability.map((a) => [a.roomTypeId, a]))
  
  return roomTypes.map((room) => {
    const avail = availabilityMap.get(room.id)
    return {
      ...room,
      dynamicAvailability: avail?.availableRooms ?? room.available_rooms,
      priceForDates: avail?.priceForDates ?? null,
    }
  })
}

/**
 * Get the lowest available room rate for a hotel on a specific date
 * Returns null if no rooms are available on that date
 */
export async function getHotelLowestRateForDate(
  hotelId: string,
  date: string
): Promise<number | null> {
  const supabase = await createClient()

  // Fetch room rates for this hotel on the specified date
  const { data: rates } = await supabase
    .from("room_rates")
    .select(`
      price,
      room_type_id,
      room_types!inner (
        hotel_id
      )
    `)
    .eq("date", date)
    .eq("room_types.hotel_id", hotelId)

  if (!rates || rates.length === 0) {
    return null
  }

  // Get the lowest price from available rates
  const prices = rates.map(r => r.price).filter(Boolean)
  return prices.length > 0 ? Math.min(...prices) : null
}

/**
 * Get lowest rates for multiple hotels on a specific date
 * More efficient than calling getHotelLowestRateForDate for each hotel
 */
export async function getHotelsLowestRatesForDate(
  hotelIds: string[],
  date: string
): Promise<Record<string, number | null>> {
  const result: Record<string, number | null> = {}
  
  // Return empty result if no hotel IDs provided
  if (!hotelIds || hotelIds.length === 0) return result
  
  hotelIds.forEach(id => {
    result[id] = null
  })

  const supabase = await createClient()

  // Fetch all room rates for the specified date for all hotels
  const { data: rates } = await supabase
    .from("room_rates")
    .select(`
      price,
      room_type_id,
      room_types!inner (
        hotel_id
      )
    `)
    .eq("date", date)
    .in("room_types.hotel_id", hotelIds)

  rates?.forEach((rate) => {
    const hotelId = (rate.room_types as { hotel_id: string }).hotel_id
    const currentMin = result[hotelId]
    if (currentMin === null || rate.price < currentMin) {
      result[hotelId] = rate.price
    }
  })

  return result
}

/**
 * Get lowest total rate for a hotel for a date range
 * Only returns a price if at least one room has rates for ALL dates in the range
 */
export async function getHotelLowestRateForRange(
  hotelId: string,
  checkIn: string,
  checkOut: string
): Promise<number | null> {
  const supabase = await createClient()
  const dates = getDatesBetween(checkIn, checkOut)
  const nights = dates.length

  if (nights === 0) return null

  // Fetch all room types for this hotel
  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("id")
    .eq("hotel_id", hotelId)

  if (!roomTypes || roomTypes.length === 0) return null

  // Fetch all rates for these room types in the date range
  const { data: rates } = await supabase
    .from("room_rates")
    .select("room_type_id, date, price")
    .in("room_type_id", roomTypes.map(r => r.id))
    .gte("date", checkIn)
    .lt("date", checkOut)

  if (!rates || rates.length === 0) return null

  // Group rates by room type
  const ratesByRoom: Record<string, Record<string, number>> = {}
  rates.forEach(rate => {
    if (!ratesByRoom[rate.room_type_id]) {
      ratesByRoom[rate.room_type_id] = {}
    }
    ratesByRoom[rate.room_type_id][rate.date] = rate.price
  })

  // Find rooms with complete coverage and calculate total price
  let lowestTotal: number | null = null
  
  for (const roomTypeId of Object.keys(ratesByRoom)) {
    const roomRates = ratesByRoom[roomTypeId]
    const hasAllDates = dates.every(date => roomRates[date] !== undefined)
    
    if (hasAllDates) {
      const total = dates.reduce((sum, date) => sum + roomRates[date], 0)
      if (lowestTotal === null || total < lowestTotal) {
        lowestTotal = total
      }
    }
  }

  return lowestTotal
}

/**
 * Get lowest rates for multiple hotels for a date range
 */
export async function getHotelsLowestRatesForRange(
  hotelIds: string[],
  checkIn: string,
  checkOut: string
): Promise<Record<string, number | null>> {
  const result: Record<string, number | null> = {}
  
  // Return empty result if no hotel IDs provided
  if (!hotelIds || hotelIds.length === 0) return result
  
  hotelIds.forEach(id => {
    result[id] = null
  })

  const dates = getDatesBetween(checkIn, checkOut)
  const nights = dates.length

  if (nights === 0) return result

  const supabase = await createClient()

  // Fetch all room types for these hotels
  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("id, hotel_id")
    .in("hotel_id", hotelIds)

  if (!roomTypes || roomTypes.length === 0) return result

  // Fetch all rates for these room types in the date range
  const { data: rates } = await supabase
    .from("room_rates")
    .select("room_type_id, date, price")
    .in("room_type_id", roomTypes.map(r => r.id))
    .gte("date", checkIn)
    .lt("date", checkOut)

  if (!rates || rates.length === 0) return result

  // Create a map of room type to hotel
  const roomToHotel: Record<string, string> = {}
  roomTypes.forEach(rt => {
    roomToHotel[rt.id] = rt.hotel_id
  })

  // Group rates by room type
  const ratesByRoom: Record<string, Record<string, number>> = {}
  rates.forEach(rate => {
    if (!ratesByRoom[rate.room_type_id]) {
      ratesByRoom[rate.room_type_id] = {}
    }
    ratesByRoom[rate.room_type_id][rate.date] = rate.price
  })

  // Find rooms with complete coverage and calculate total price per hotel
  for (const roomTypeId of Object.keys(ratesByRoom)) {
    const roomRates = ratesByRoom[roomTypeId]
    const hasAllDates = dates.every(date => roomRates[date] !== undefined)
    
    if (hasAllDates) {
      const total = dates.reduce((sum, date) => sum + roomRates[date], 0)
      const hotelId = roomToHotel[roomTypeId]
      
      if (result[hotelId] === null || total < result[hotelId]!) {
        result[hotelId] = total
      }
    }
  }

  return result
}
