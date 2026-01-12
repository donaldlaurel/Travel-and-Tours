import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format, differenceInDays } from "date-fns"
import { Calendar, MapPin, Users, Phone, Mail, ArrowLeft, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CancelBookingButton } from "@/components/cancel-booking-button"
import { WriteReviewForm } from "@/components/write-review-form"

interface PageProps {
  params: Promise<{ bookingId: string }>
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { bookingId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      hotel:hotels(*),
      room_type:room_types(*)
    `)
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single()

  if (error || !booking) {
    notFound()
  }

  // Check if user has already reviewed this hotel
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("hotel_id", booking.hotel_id)
    .single()

  const checkInDate = new Date(booking.check_in_date)
  const checkOutDate = new Date(booking.check_out_date)
  const nights = differenceInDays(checkOutDate, checkInDate)
  const isPast = checkOutDate < new Date()
  const canCancel = !isPast && booking.status === "confirmed"
  const canReview = isPast && !existingReview && booking.status !== "cancelled"

  const statusColors: Record<string, string> = {
    confirmed: "bg-primary/10 text-primary",
    pending: "bg-accent/10 text-accent",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>

        <div className="grid gap-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-36 rounded-lg overflow-hidden">
                  <Image
                    src={booking.hotel.main_image || "/placeholder.svg?height=144&width=192"}
                    alt={booking.hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-bold">{booking.hotel.name}</h1>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.hotel.address}, {booking.hotel.city}, {booking.hotel.country}
                      </p>
                    </div>
                    <Badge className={statusColors[booking.status]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  {booking.hotel.star_rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: booking.hotel.star_rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Booking Reference:{" "}
                    <span className="font-mono font-medium">{bookingId.slice(0, 8).toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stay Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-muted-foreground">{format(checkInDate, "EEEE, MMMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-muted-foreground">{format(checkOutDate, "EEEE, MMMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                    </p>
                    <p className="text-muted-foreground">{booking.room_type.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? "night" : "nights"} stay
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room ({nights} nights)</span>
                    <span>${Math.round(booking.total_price / 1.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${booking.total_price - Math.round(booking.total_price / 1.1)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${booking.total_price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{booking.special_requests}</p>
              </CardContent>
            </Card>
          )}

          {/* Hotel Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>reservations@{booking.hotel.name.toLowerCase().replace(/\s+/g, "")}.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="bg-transparent flex-1">
              <Link href={`/hotels/${booking.hotel_id}`}>View Hotel</Link>
            </Button>
            {canCancel && <CancelBookingButton bookingId={booking.id} />}
          </div>

          {/* Write Review Section */}
          {canReview && <WriteReviewForm hotelId={booking.hotel_id} bookingId={booking.id} />}
        </div>
      </div>
    </div>
  )
}
