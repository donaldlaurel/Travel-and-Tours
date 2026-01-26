import { HotelCard } from "@/components/hotel-card"
import { FeaturedHotelsHeader } from "@/components/featured-hotels-header"
import type { Hotel } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import { getHotelsLowestRatesForRange } from "@/lib/availability-server"
import { format, addDays } from "date-fns"

async function FeaturedHotelsContent() {
  try {
    const supabase = await createClient()
    
    const { data: hotelsData, error } = await supabase
      .from("hotels")
      .select("*")
      .order("star_rating", { ascending: false })
      .limit(6)

    if (error) throw error

    // Get today and tomorrow for 1-night price lookup
    const today = format(new Date(), "yyyy-MM-dd")
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd")
    const hotelIds = hotelsData?.map((h: Hotel) => h.id) || []
    
    // Fetch lowest prices for a 1-night stay (today to tomorrow)
    const priceMap = await getHotelsLowestRatesForRange(hotelIds, today, tomorrow)

    // Process hotels to include lowest_price from room_rates
    const hotels = (hotelsData || []).map((hotel: Hotel) => ({
      ...hotel,
      lowest_price: priceMap[hotel.id] ?? null,
    }))

    return { hotels, error: null }
  } catch (error) {
    console.error("Error fetching featured hotels:", error)
    return { hotels: null, error: true }
  }
}

export async function FeaturedHotels() {
  const { hotels, error } = await FeaturedHotelsContent()

  if (!hotels || hotels.length === 0) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <FeaturedHotelsHeader />
          <div className="text-center py-12 text-muted-foreground">
            <p>{error ? "Error loading featured hotels. Please try again later." : "No hotels available yet. Please run the database scripts to add sample data."}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <FeaturedHotelsHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: Hotel & { lowest_price: number | null }) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
