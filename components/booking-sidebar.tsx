"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Users } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Hotel, RoomType } from "@/lib/types"

interface BookingSidebarProps {
  hotel: Hotel
  roomTypes: RoomType[]
  checkIn?: string
  checkOut?: string
  guests: number
}

export function BookingSidebar({
  hotel,
  roomTypes,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guests: initialGuests,
}: BookingSidebarProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn ? new Date(initialCheckIn) : undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut ? new Date(initialCheckOut) : undefined)
  const [guests, setGuests] = useState(initialGuests.toString())
  const [selectedRoom, setSelectedRoom] = useState<string>(roomTypes[0]?.id || "")

  const selectedRoomType = roomTypes.find((r) => r.id === selectedRoom)
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalPrice = selectedRoomType ? selectedRoomType.price_per_night * nights : 0

  useEffect(() => {
    if (roomTypes.length > 0 && !selectedRoom) {
      setSelectedRoom(roomTypes[0].id)
    }
  }, [roomTypes, selectedRoom])

  const handleBook = () => {
    if (!checkIn || !checkOut || !selectedRoom) return

    const params = new URLSearchParams()
    params.set("roomType", selectedRoom)
    params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    params.set("checkOut", format(checkOut, "yyyy-MM-dd"))
    params.set("guests", guests)

    router.push(`/booking/${hotel.id}?${params.toString()}`)
  }

  return (
    <div className="sticky top-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${selectedRoomType?.price_per_night || hotel.price_per_night}</span>
            <span className="text-sm font-normal text-muted-foreground">/ night</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Check-in / Check-out */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Check-in</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !checkIn && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "MMM dd") : "Add date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date)
                      if (date && (!checkOut || checkOut <= date)) {
                        setCheckOut(undefined)
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Check-out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !checkOut && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "MMM dd") : "Add date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Guests</label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="mt-1">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Type */}
          {roomTypes.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Room Type</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} - ${room.price_per_night}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Breakdown */}
          {nights > 0 && selectedRoomType && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  ${selectedRoomType.price_per_night} x {nights} nights
                </span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span>${Math.round(totalPrice * 0.1)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>${totalPrice + Math.round(totalPrice * 0.1)}</span>
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" onClick={handleBook} disabled={!checkIn || !checkOut || !selectedRoom}>
            Reserve
          </Button>

          <p className="text-xs text-center text-muted-foreground">You won&apos;t be charged yet</p>
        </CardContent>
      </Card>
    </div>
  )
}
