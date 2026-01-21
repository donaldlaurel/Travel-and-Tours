import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { SearchForm } from "@/components/search-form"
import { HotelFilters } from "@/components/hotel-filters"
import { HotelList } from "@/components/hotel-list"
import { HotelListSkeleton } from "@/components/hotel-list-skeleton"
import { getHotelsLowestRatesForDate, getHotelsLowestRatesForRange } from "@/lib/availability-server"
import { format } from "date-fns"
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

  // Fetch hotels
  let query = supabase.from("hotels").select("*")

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

  // Determine the date(s) to check for pricing
  const today = format(new Date(), "yyyy-MM-dd")
  const checkIn = searchParams.checkIn || today
  const checkOut = searchParams.checkOut

  // Get hotel IDs for price lookup
  const hotelIds = hotelsData?.map((h: Hotel) => h.id) || []

  // Fetch lowest prices based on dates
  let priceMap: Record<string, number | null> = {}
  let showTotalPrice = false
  if (checkOut && checkIn !== checkOut) {
    // If we have a date range, get total price for the range
    priceMap = await getHotelsLowestRatesForRange(hotelIds, checkIn, checkOut)
    showTotalPrice = true
  } else {
    // Single date (today or check-in), get per-night rate
    priceMap = await getHotelsLowestRatesForDate(hotelIds, checkIn)
  }

  // Process hotels to include lowest_price from room_rates
  const hotels = (hotelsData || []).map((hotel: Hotel) => ({
    ...hotel,
    lowest_price: priceMap[hotel.id] ?? null,
  }))

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
      showTotalPrice={showTotalPrice}
    />
  )
}
