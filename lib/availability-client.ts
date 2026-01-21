import { createClient } from "@/lib/supabase/client"

export interface RoomAvailability {
  roomTypeId: string
  totalRooms: number
  bookedRooms: number
  availableRooms: number
  priceForDates: number | null
}

/**
 * Get room availability for a specific date range (client-side)
 */
export async function getRoomAvailabilityClient(
  hotelId: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailability[]> {
  const supabase = createClient()

  // Fetch all room types for this hotel
  const { data: roomTypes } = await supabase
    .from("room_types")
    .select("id, available_rooms, base_price")
    .eq("hotel_id", hotelId)

  if (!roomTypes || roomTypes.length === 0) {
    return []
  }

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

  // Group rates by room type
  const ratesMap: Record<string, number[]> = {}
  roomRates?.forEach((rate) => {
    if (!ratesMap[rate.room_type_id]) {
      ratesMap[rate.room_type_id] = []
    }
    ratesMap[rate.room_type_id].push(rate.price)
  })

  // Calculate availability for each room type
  return roomTypes.map((room) => {
    const bookedRooms = bookingCounts[room.id] || 0
    const availableRooms = Math.max(0, room.available_rooms - bookedRooms)
    
    // Calculate price for the date range
    const dailyRates = ratesMap[room.id] || []
    const nights = getDatesBetween(checkIn, checkOut).length
    
    let priceForDates: number | null = null
    if (nights > 0) {
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
    }
  })
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
