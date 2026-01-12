"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { HotelCard } from "@/components/hotel-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Hotel } from "@/lib/types"

interface HotelListProps {
  hotels: Hotel[]
  checkIn?: string
  checkOut?: string
  guests?: number
  totalCount: number
  city?: string
}

export function HotelList({ hotels, checkIn, checkOut, guests, totalCount, city }: HotelListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "default") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    router.push(`/hotels?${params.toString()}`)
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-xl">
        <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search for a different destination.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{city ? `Hotels in ${city}` : "All Hotels"}</h1>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "property" : "properties"} found
          </p>
        </div>
        <Select defaultValue={searchParams.get("sort") || "default"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Recommended</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} guests={guests} />
        ))}
      </div>
    </div>
  )
}
