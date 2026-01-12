"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Users, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { RoomType } from "@/lib/types"

interface RoomListProps {
  roomTypes: RoomType[]
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

  return (
    <div className="space-y-4">
      {roomTypes.map((room) => (
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

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Users className="h-4 w-4" />
                    <span>
                      Up to {room.max_guests} {room.max_guests === 1 ? "guest" : "guests"}
                    </span>
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
                    <p className="text-2xl font-bold">${room.price_per_night}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {room.available_rooms > 0 ? (
                      <span className="text-primary">
                        {room.available_rooms} {room.available_rooms === 1 ? "room" : "rooms"} left
                      </span>
                    ) : (
                      <span className="text-destructive">Sold out</span>
                    )}
                  </div>
                  <Button onClick={() => handleSelectRoom(room.id)} disabled={room.available_rooms === 0}>
                    {room.available_rooms > 0 ? "Select Room" : "Not Available"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
