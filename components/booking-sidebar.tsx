"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Users, Loader2 } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getRoomAvailabilityClient, type RoomAvailability } from "@/lib/availability"
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
  const [availability, setAvailability] = useState<RoomAvailability[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  const selectedRoomType = roomTypes.find((r) => r.id === selectedRoom)
  const selectedAvailability = availability.find((a) => a.roomTypeId === selectedRoom)
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  
  // Calculate total price using availability data if available
  const basePrice = selectedRoomType?.base_price || selectedRoomType?.price_per_night || 0
  const totalPrice = selectedAvailability?.priceForDates ?? (basePrice * nights)

  useEffect(() => {
    if (roomTypes.length > 0 && !selectedRoom) {
      setSelectedRoom(roomTypes[0].id)
    }
  }, [roomTypes, selectedRoom])

  // Fetch availability when dates change
  useEffect(() => {
    const fetchAvailability = async () => {
      if (checkIn && checkOut && hotel.id) {
        setLoadingAvailability(true)
        try {
          const data = await getRoomAvailabilityClient(
            hotel.id,
            format(checkIn, "yyyy-MM-dd"),
            format(checkOut, "yyyy-MM-dd")
          )
          setAvailability(data)
        } catch (error) {
          console.error("Failed to fetch availability:", error)
        } finally {
          setLoadingAvailability(false)
        }
      }
    }

    fetchAvailability()
  }, [checkIn, checkOut, hotel.id])

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
            <span className="text-3xl font-bold">₱{basePrice.toLocaleString()}</span>
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
                  {roomTypes.map((room) => {
                    const roomAvail = availability.find((a) => a.roomTypeId === room.id)
                    const isAvailable = roomAvail ? roomAvail.availableRooms > 0 : room.available_rooms > 0
                    const availCount = roomAvail?.availableRooms ?? room.available_rooms
                    const roomPrice = room.base_price || room.price_per_night
                    
                    return (
                      <SelectItem 
                        key={room.id} 
                        value={room.id}
                        disabled={!isAvailable}
                      >
                        <div className="flex justify-between items-center w-full gap-2">
                          <span>{room.name}</span>
                          <span className="text-muted-foreground">
                            ₱{roomPrice.toLocaleString()}/night
                            {checkIn && checkOut && !isAvailable && " (Sold out)"}
                            {checkIn && checkOut && isAvailable && availCount <= 3 && ` (${availCount} left)`}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {loadingAvailability && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking availability...
                </p>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          {nights > 0 && selectedRoomType && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span>₱{Math.round(totalPrice * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₱{(totalPrice + Math.round(totalPrice * 0.1)).toLocaleString()}</span>
              </div>
              {selectedAvailability && selectedAvailability.availableRooms <= 3 && selectedAvailability.availableRooms > 0 && (
                <p className="text-xs text-orange-600 font-medium">
                  Only {selectedAvailability.availableRooms} rooms left at this price!
                </p>
              )}
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleBook} 
            disabled={
              !checkIn || 
              !checkOut || 
              !selectedRoom || 
              loadingAvailability ||
              (selectedAvailability && selectedAvailability.availableRooms === 0)
            }
          >
            {loadingAvailability ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : selectedAvailability?.availableRooms === 0 ? (
              "Not Available"
            ) : (
              "Reserve"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">You won&apos;t be charged yet</p>
        </CardContent>
      </Card>
    </div>
  )
}
