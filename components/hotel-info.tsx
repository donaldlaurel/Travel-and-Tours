import type React from "react"
import { Star, MapPin, Wifi, Dumbbell, Waves, UtensilsCrossed, Car, Sparkles, Coffee, Wind } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Hotel } from "@/lib/types"

interface HotelInfoProps {
  hotel: Hotel
  avgRating: string | null
  reviewCount: number
}

const amenityIcons: Record<string, React.ElementType> = {
  "Free WiFi": Wifi,
  Gym: Dumbbell,
  Pool: Waves,
  Restaurant: UtensilsCrossed,
  Parking: Car,
  "Free Parking": Car,
  Spa: Sparkles,
  Bar: Coffee,
  "Air Conditioning": Wind,
}

export function HotelInfo({ hotel, avgRating, reviewCount }: HotelInfoProps) {
  return (
    <div className="bg-card rounded-xl p-6 border">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {hotel.star_rating && (
              <div className="flex items-center">
                {Array.from({ length: hotel.star_rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
            )}
            <Badge variant="secondary">{hotel.star_rating} Star Hotel</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {hotel.address}, {hotel.city}, {hotel.country}
            </span>
          </div>
        </div>

        {avgRating && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold">{avgRating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {hotel.description && <p className="mt-6 text-muted-foreground leading-relaxed">{hotel.description}</p>}

      {/* Amenities */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-3">
            {hotel.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Sparkles
              return (
                <div key={amenity} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{amenity}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
