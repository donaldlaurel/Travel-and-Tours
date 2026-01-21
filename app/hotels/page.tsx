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

  let query = supabase.from("hotels").select("*")

  // Apply filters
  if (searchParams.city) {
    query = query.or(`city.ilike.%${searchParams.city}%,country.ilike.%${searchParams.city}%`)
  }

  if (searchParams.minPrice) {
    query = query.gte("price_per_night", Number.parseFloat(searchParams.minPrice))
  }

  if (searchParams.maxPrice) {
    query = query.lte("price_per_night", Number.parseFloat(searchParams.maxPrice))
  }

  if (searchParams.stars) {
    const starRatings = searchParams.stars.split(",").map((s) => Number.parseInt(s))
    query = query.in("star_rating", starRatings)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price-asc":
      query = query.order("price_per_night", { ascending: true })
      break
    case "price-desc":
      query = query.order("price_per_night", { ascending: false })
      break
    case "rating":
      query = query.order("star_rating", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: hotels, error } = await query

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading hotels. Please try again.</p>
      </div>
    )
  }

  // Filter by amenities client-side (since it's an array column)
  let filteredHotels = hotels || []
  if (searchParams.amenities) {
    const requiredAmenities = searchParams.amenities.split(",")
    filteredHotels = filteredHotels.filter((hotel: Hotel) =>
      requiredAmenities.every((amenity) => hotel.amenities?.includes(amenity)),
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
