"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface HotelFiltersProps {
  searchParams: {
    city?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    stars?: string
    amenities?: string
    sort?: string
  }
}

const amenitiesList = [
  "Pool",
  "Spa",
  "Restaurant",
  "Gym",
  "Free WiFi",
  "Beach Access",
  "Room Service",
  "Bar",
  "Parking",
  "Airport Transfer",
]

export function HotelFilters({ searchParams }: HotelFiltersProps) {
  const router = useRouter()
  const currentParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    searchParams.minPrice ? Number.parseFloat(searchParams.minPrice) : 0,
    searchParams.maxPrice ? Number.parseFloat(searchParams.maxPrice) : 1000,
  ])

  const [selectedStars, setSelectedStars] = useState<number[]>(
    searchParams.stars ? searchParams.stars.split(",").map((s) => Number.parseInt(s)) : [],
  )

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.amenities ? searchParams.amenities.split(",") : [],
  )

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(currentParams.toString())

    // Price range
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 1000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    // Star ratings
    if (selectedStars.length > 0) {
      params.set("stars", selectedStars.join(","))
    } else {
      params.delete("stars")
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      params.set("amenities", selectedAmenities.join(","))
    } else {
      params.delete("amenities")
    }

    router.push(`/hotels?${params.toString()}`)
  }, [priceRange, selectedStars, selectedAmenities, currentParams, router])

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchParams.city) params.set("city", searchParams.city)
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn)
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut)
    if (searchParams.guests) params.set("guests", searchParams.guests)

    setPriceRange([0, 1000])
    setSelectedStars([])
    setSelectedAmenities([])

    router.push(`/hotels?${params.toString()}`)
  }

  const toggleStar = (star: number) => {
    setSelectedStars((prev) => (prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium">Price per night</Label>
            <div className="mt-4 px-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <Label className="text-sm font-medium">Star Rating</Label>
            <div className="mt-3 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <Checkbox
                    id={`star-${star}`}
                    checked={selectedStars.includes(star)}
                    onCheckedChange={() => toggleStar(star)}
                  />
                  <label htmlFor={`star-${star}`} className="flex items-center gap-1 text-sm cursor-pointer">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                    {Array.from({ length: 5 - star }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground/30" />
                    ))}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-sm font-medium">Amenities</Label>
            <div className="mt-3 space-y-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={updateFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
