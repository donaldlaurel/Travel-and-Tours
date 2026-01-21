"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Users, Check, Coffee, Baby } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RoomType } from "@/lib/types"
import { differenceInDays } from "date-fns"

interface ExtendedRoomType extends RoomType {
  dynamicAvailability?: number
  priceForDates?: number | null
}

interface RoomListProps {
  roomTypes: ExtendedRoomType[]
  hotelId: string
  checkIn?: string
  checkOut?: string
  guests: number
}

export function RoomList({ roomTypes, hotelId, checkIn, checkOut, guests }: RoomListProps) {
  const router = useRouter()

  const handleSelectRoom = (roomTypeId: string) => {
    const params = new URLSearchParams()
    params.set("roomType", roomTypeId)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    params.set("guests", guests.toString())

    router.push(`/booking/${hotelId}?${params.toString()}`)
  }

  if (roomTypes.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-xl">
        <p className="text-muted-foreground">No rooms available at the moment.</p>
      </div>
    )
  }

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0

  return (
    <div className="space-y-4">
      {roomTypes.map((room) => {
        // Use dynamic availability if calculated, otherwise fall back to static available_rooms
        const availableRooms = room.dynamicAvailability ?? room.available_rooms
        const isAvailable = availableRooms > 0
        
        // Calculate display price - only show if we have actual rates
        const totalPrice = room.priceForDates
        const hasPrice = totalPrice !== null && totalPrice > 0

        return (
          <Card key={room.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Room Image */}
              <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
                <Image
                  src={room.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    {room.description && <p className="text-muted-foreground text-sm mb-3">{room.description}</p>}

                    {/* Room Capacity */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {room.max_adults} {room.max_adults === 1 ? "Adult" : "Adults"}
                      </span>
                      {room.max_children > 0 && (
                        <span className="flex items-center gap-1">
                          <Baby className="h-4 w-4" />
                          {room.max_children} {room.max_children === 1 ? "Child" : "Children"}
                        </span>
                      )}
                      {room.breakfast_included > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Coffee className="h-3 w-3" />
                          Breakfast for {room.breakfast_included}
                        </Badge>
                      )}
                    </div>

                    {/* Room Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 5).map((amenity) => (
                          <span key={amenity} className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Check className="h-3 w-3 text-primary" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      {hasPrice && nights > 0 ? (
                        <>
                          <p className="text-2xl font-bold">₱{totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            for {nights} {nights === 1 ? "night" : "nights"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            (₱{Math.round(totalPrice / nights).toLocaleString()}/night)
                          </p>
                        </>
                      ) : hasPrice ? (
                        <>
                          <p className="text-2xl font-bold">₱{totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">per night</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not available for selected dates</p>
                      )}
                    </div>
                    <div className="text-sm">
                      {isAvailable && hasPrice ? (
                        <span className={availableRooms <= 3 ? "text-orange-600 font-medium" : "text-primary"}>
                          {availableRooms <= 3 ? `Only ${availableRooms} left!` : `${availableRooms} rooms available`}
                        </span>
                      ) : (
                        <span className="text-destructive font-medium">
                          {hasPrice ? "Sold out" : "Closed"}
                        </span>
                      )}
                    </div>
                    <Button onClick={() => handleSelectRoom(room.id)} disabled={!isAvailable || !hasPrice}>
                      {isAvailable && hasPrice ? "Select Room" : "Not Available"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
