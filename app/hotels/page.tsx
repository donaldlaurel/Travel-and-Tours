import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { SearchForm } from "@/components/search-form"
import { HotelFilters } from "@/components/hotel-filters"
import { HotelList } from "@/components/hotel-list"
import { HotelListSkeleton } from "@/components/hotel-list-skeleton"
import type { Hotel } from "@/lib/types"

interface PageProps {
  searchParams: Promise<{
    city?: string
    checkIn?: string
    checkOut?: string
    rooms?: string
    adults?: string
    children?: string
    childrenAges?: string
    minPrice?: string
    maxPrice?: string
    stars?: string
    amenities?: string
    sort?: string
  }>
}

export default async function HotelsPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Bar */}
      <div className="bg-card border-b py-4">
        <div className="container mx-auto px-4">
          <SearchForm
            variant="compact"
            initialCity={params.city}
            initialCheckIn={params.checkIn ? new Date(params.checkIn) : undefined}
            initialCheckOut={params.checkOut ? new Date(params.checkOut) : undefined}
            initialRooms={params.rooms ? Number.parseInt(params.rooms) : 1}
            initialAdults={params.adults ? Number.parseInt(params.adults) : 2}
            initialChildren={params.children ? Number.parseInt(params.children) : 0}
            initialChildrenAges={params.childrenAges ? params.childrenAges.split(",").map(Number) : []}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <HotelFilters searchParams={params} />
          </aside>

          {/* Results */}
          <main className="flex-1">
            <Suspense fallback={<HotelListSkeleton />}>
              <HotelResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

async function HotelResults({
  searchParams,
}: {
  searchParams: {
    city?: string
    checkIn?: string
    checkOut?: string
    rooms?: string
    adults?: string
    children?: string
    childrenAges?: string
    minPrice?: string
    maxPrice?: string
    stars?: string
    amenities?: string
    sort?: string
  }
}) {
  const supabase = await createClient()

  // Fetch hotels with their lowest room price
  let query = supabase.from("hotels").select(`
    *,
    room_types (
      base_price
    )
  `)

  // Apply filters
  if (searchParams.city) {
    query = query.or(`city.ilike.%${searchParams.city}%,country.ilike.%${searchParams.city}%`)
  }

  // Price filtering is done client-side after fetching lowest room prices

  if (searchParams.stars) {
    const starRatings = searchParams.stars.split(",").map((s) => Number.parseInt(s))
    query = query.in("star_rating", starRatings)
  }

  // Apply sorting (price sorting done client-side after calculating lowest price)
  if (searchParams.sort === "rating") {
    query = query.order("star_rating", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: hotelsData, error } = await query

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading hotels. Please try again.</p>
      </div>
    )
  }

  // Process hotels to include lowest_price from room_types
  const hotels = (hotelsData || []).map((hotel: Hotel & { room_types?: { base_price: number }[] }) => {
    const roomPrices = hotel.room_types?.map(rt => rt.base_price).filter(Boolean) || []
    const lowestPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { room_types, ...hotelWithoutRooms } = hotel
    return {
      ...hotelWithoutRooms,
      lowest_price: lowestPrice,
    }
  })

  // Filter by price range (using lowest room price)
  let filteredHotels = hotels
  if (searchParams.minPrice) {
    const minPrice = Number.parseFloat(searchParams.minPrice)
    filteredHotels = filteredHotels.filter((hotel: Hotel) => 
      hotel.lowest_price && hotel.lowest_price >= minPrice
    )
  }
  if (searchParams.maxPrice) {
    const maxPrice = Number.parseFloat(searchParams.maxPrice)
    filteredHotels = filteredHotels.filter((hotel: Hotel) => 
      hotel.lowest_price && hotel.lowest_price <= maxPrice
    )
  }

  // Filter by amenities (array column)
  if (searchParams.amenities) {
    const requiredAmenities = searchParams.amenities.split(",")
    filteredHotels = filteredHotels.filter((hotel: Hotel) =>
      requiredAmenities.every((amenity) => hotel.amenities?.includes(amenity)),
    )
  }

  // Apply price sorting client-side
  if (searchParams.sort === "price-asc") {
    filteredHotels = filteredHotels.sort((a: Hotel, b: Hotel) => 
      (a.lowest_price || 0) - (b.lowest_price || 0)
    )
  } else if (searchParams.sort === "price-desc") {
    filteredHotels = filteredHotels.sort((a: Hotel, b: Hotel) => 
      (b.lowest_price || 0) - (a.lowest_price || 0)
    )
  }

  const totalGuests = (searchParams.adults ? Number.parseInt(searchParams.adults) : 2) + 
                      (searchParams.children ? Number.parseInt(searchParams.children) : 0)

  return (
    <HotelList
      hotels={filteredHotels}
      checkIn={searchParams.checkIn}
      checkOut={searchParams.checkOut}
      guests={totalGuests}
      totalCount={filteredHotels.length}
      city={searchParams.city}
    />
  )
}
