import { createClient } from "@/lib/supabase/server"
import { HotelCard } from "@/components/hotel-card"
import { getHotelsLowestRatesForRange } from "@/lib/availability-server"
import { format, addDays } from "date-fns"
import type { Hotel } from "@/lib/types"

export async function FeaturedHotels() {
  const supabase = await createClient()

  const { data: hotelsData } = await supabase
    .from("hotels")
    .select("*")
    .order("star_rating", { ascending: false })
    .limit(6)

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

  if (!hotels || hotels.length === 0) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-balance">Featured Hotels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked hotels with exceptional ratings and service
            </p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>No hotels available yet. Please run the database scripts to add sample data.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-balance">Featured Hotels</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hand-picked hotels with exceptional ratings and service
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: Hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
