import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { CheckCircle, Calendar, MapPin, Users, ArrowRight, Download, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: Promise<{ bookingId: string }>
}

export default async function BookingConfirmationPage({ params }: PageProps) {
  const { bookingId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
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

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your reservation has been confirmed. A confirmation email has been sent to your email address.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="font-mono font-semibold text-lg">{bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <CheckCircle className="h-3 w-3" />
                  Confirmed
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Hotel Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{booking.hotel.name}</h2>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {booking.hotel.address}, {booking.hotel.city}, {booking.hotel.country}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Check-in
                  </div>
                  <p className="font-medium">{format(new Date(booking.check_in_date), "EEE, MMM d, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Check-out
                  </div>
                  <p className="font-medium">{format(new Date(booking.check_out_date), "EEE, MMM d, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Guests
                  </div>
                  <p className="font-medium">
                    {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                  </p>
                  <p className="text-sm text-muted-foreground">{booking.room_type.name}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Price Summary */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="text-2xl font-bold">${booking.total_price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href="/dashboard">
              View My Bookings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Confirmation
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Mail className="mr-2 h-4 w-4" />
            Resend Email
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/help" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
