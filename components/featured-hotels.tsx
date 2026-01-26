'use client'

import { useEffect, useState } from "react"
import { HotelCard } from "@/components/hotel-card"
import { useLanguage } from "@/lib/language-context"
import type { Hotel } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { getHotelsLowestRatesForRange } from "@/lib/availability-server"
import { format, addDays } from "date-fns"

export function FeaturedHotels() {
  const [hotels, setHotels] = useState<(Hotel & { lowest_price: number | null })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
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
        const processedHotels = (hotelsData || []).map((hotel: Hotel) => ({
          ...hotel,
          lowest_price: priceMap[hotel.id] ?? null,
        }))

        setHotels(processedHotels)
      } catch (error) {
        console.error("Error fetching featured hotels:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-balance">{t('home.featured_hotels')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.featured_hotels_desc')}
            </p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading hotels...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!hotels || hotels.length === 0) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-balance">{t('home.featured_hotels')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.featured_hotels_desc')}
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
          <h2 className="text-3xl font-bold mb-3 text-balance" key={language}>{t('home.featured_hotels')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.featured_hotels_desc')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: Hotel & { lowest_price: number | null }) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
