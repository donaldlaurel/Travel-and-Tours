"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Hotel } from "@/lib/types"

interface HotelCardProps {
  hotel: Hotel
  checkIn?: string
  checkOut?: string
  guests?: number
  showTotalPrice?: boolean // true if lowest_price is total for date range
}

export function HotelCard({ hotel, checkIn, checkOut, guests, showTotalPrice }: HotelCardProps) {
  const searchParams = new URLSearchParams()
  if (checkIn) searchParams.set("checkIn", checkIn)
  if (checkOut) searchParams.set("checkOut", checkOut)
  if (guests) searchParams.set("guests", guests.toString())

  const href = `/hotels/${hotel.id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={href}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={hotel.main_image || "/placeholder.svg?height=300&width=400"}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to favorites
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {hotel.star_rating && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">{hotel.star_rating} Star</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={href}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">{hotel.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3" />
          <span>
            {hotel.city}, {hotel.country}
          </span>
        </div>
        {hotel.avg_rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{hotel.avg_rating.toFixed(1)}</span>
            {hotel.review_count && (
              <span className="text-sm text-muted-foreground">({hotel.review_count} reviews)</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div>
            {hotel.lowest_price ? (
              <>
                <span className="text-xs text-muted-foreground">From </span>
                <span className="text-2xl font-bold">₱{hotel.lowest_price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  {showTotalPrice ? " total" : " / night"}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Not available</span>
            )}
          </div>
          <Button asChild size="sm">
            <Link href={href}>View Deal</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
