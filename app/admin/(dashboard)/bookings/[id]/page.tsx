import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, MapPin, CreditCard } from "lucide-react"
import { UpdateBookingStatus } from "@/components/admin/update-booking-status"

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      hotel:hotels(*),
      room_type:room_types(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !booking) {
    notFound()
  }

  const checkIn = new Date(booking.check_in_date)
  const checkOut = new Date(booking.check_out_date)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/bookings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Booking Details</h2>
          <p className="text-muted-foreground font-mono text-sm">{booking.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reservation Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>
                <UpdateBookingStatus bookingId={booking.id} currentStatus={booking.status} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-in
              </span>
              <span className="font-medium">{checkIn.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check-out
              </span>
              <span className="font-medium">{checkOut.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nights</span>
              <span className="font-medium">{nights}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guests
              </span>
              <span className="font-medium">{booking.guests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Booked on</span>
              <span className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hotel Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">{booking.hotel?.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {booking.hotel?.city}, {booking.hotel?.country}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Room Type</span>
              <span className="font-medium">{booking.room_type?.name || "Standard"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rate per Night</span>
              <span className="font-medium">₱{Number(booking.room_type?.price_per_night || 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  ₱{Number(booking.room_type?.price_per_night || 0).toLocaleString()} x {nights} nights
                </span>
                <span>₱{(Number(booking.room_type?.price_per_night || 0) * nights).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">₱{Number(booking.total_price).toLocaleString()}</span>
              </div>
            </div>
            {booking.special_requests && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Special Requests:</p>
                <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
