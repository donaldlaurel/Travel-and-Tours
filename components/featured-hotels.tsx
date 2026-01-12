import { createClient } from "@/lib/supabase/server"
import { HotelCard } from "@/components/hotel-card"
import type { Hotel } from "@/lib/types"

export async function FeaturedHotels() {
  const supabase = await createClient()

  const { data: hotels } = await supabase.from("hotels").select("*").order("star_rating", { ascending: false }).limit(6)

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
