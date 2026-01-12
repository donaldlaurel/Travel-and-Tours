"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format, differenceInDays } from "date-fns"
import { MapPin, Calendar, Users, CreditCard, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { Hotel, RoomType, Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

interface BookingFormProps {
  hotel: Hotel
  roomType: RoomType
  checkIn: string
  checkOut: string
  guests: number
  user: User
  profile: Profile | null
}

export function BookingForm({ hotel, roomType, checkIn, checkOut, guests, user, profile }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [email, setEmail] = useState(user.email || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [specialRequests, setSpecialRequests] = useState("")

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = differenceInDays(checkOutDate, checkInDate)
  const subtotal = roomType.price_per_night * nights
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          hotel_id: hotel.id,
          room_type_id: roomType.id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          guests,
          total_price: total,
          status: "confirmed",
          special_requests: specialRequests || null,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Update profile if needed
      if (fullName !== profile?.full_name || phone !== profile?.phone) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            phone: phone || null,
          })
          .eq("id", user.id)
      }

      router.push(`/booking/confirmation/${booking.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Guest Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="As shown on ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requirements or preferences?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-muted-foreground text-sm mb-2">
                  Payment integration coming soon. For now, bookings are confirmed immediately.
                </p>
                <p className="text-xs text-muted-foreground">
                  In a production app, you would integrate Stripe here for secure payments.
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : `Confirm Booking - $${total}`}
          </Button>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              {/* Hotel Info */}
              <div className="flex gap-4 mb-6">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={hotel.main_image || "/placeholder.svg?height=96&width=96"}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{hotel.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {hotel.city}, {hotel.country}
                  </p>
                  <p className="text-sm text-primary mt-1">{roomType.name}</p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Dates */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(checkInDate, "EEE, MMM d")} - {format(checkOutDate, "EEE, MMM d")}
                    </p>
                    <p className="text-muted-foreground">
                      {nights} {nights === 1 ? "night" : "nights"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {guests} {guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${roomType.price_per_night} x {nights} nights
                  </span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Free cancellation</p>
                    <p className="text-muted-foreground text-xs">
                      Cancel before {format(checkInDate, "MMM d")} for a full refund
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
