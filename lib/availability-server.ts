import { createClient } from "@/lib/supabase/server"
import type { RoomType } from "@/lib/types"

export interface RoomAvailability {
  roomTypeId: string
  totalRooms: number
  bookedRooms: number
  availableRooms: number
  priceForDates: number | null
  isBlocked?: boolean
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
  const { data: blocks } = await supabase
    .from("availability_blocks")
    .select("hotel_id, room_type_id")
    .or(`hotel_id.eq.${hotelId},room_type_id.in.(${roomTypes.map(r => r.id).join(",")})`)
    .lte("start_date", checkOut)
    .gte("end_date", checkIn)

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
    const availableRooms = isBlocked ? 0 : Math.max(0, room.available_rooms - bookedRooms)
    
    // Calculate price for the date range
    const dailyRates = ratesMap[room.id] || []
    const nights = getDatesBetween(checkIn, checkOut).length
    
    let priceForDates: number | null = null
    if (nights > 0) {
      // Use daily rates if available, otherwise use base price
      const totalPrice = dailyRates.length > 0
        ? dailyRates.reduce((sum, price) => sum + price, 0) + (nights - dailyRates.length) * room.base_price
        : nights * room.base_price
      priceForDates = totalPrice
    }

    return {
      roomTypeId: room.id,
      totalRooms: room.available_rooms,
      bookedRooms,
      availableRooms,
      priceForDates,
      isBlocked,
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
