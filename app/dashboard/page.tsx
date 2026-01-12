import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      hotel:hotels(name, city, country, main_image),
      room_type:room_types(name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const now = new Date()
  const upcomingBookings = bookings?.filter((b) => new Date(b.check_in_date) >= now && b.status !== "cancelled") || []
  const pastBookings = bookings?.filter((b) => new Date(b.check_out_date) < now || b.status === "completed") || []
  const cancelledBookings = bookings?.filter((b) => b.status === "cancelled") || []

  const statusColors: Record<string, string> = {
    confirmed: "bg-primary/10 text-primary",
    pending: "bg-accent/10 text-accent",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  }

  const renderBookingCard = (booking: typeof bookings extends (infer T)[] | null ? T : never) => (
    <Card key={booking.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div
            className="relative w-full sm:w-40 h-32 sm:h-auto bg-cover bg-center"
            style={{
              backgroundImage: `url(${booking.hotel?.main_image || "/placeholder.svg?height=200&width=160"})`,
            }}
          />
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{booking.hotel?.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.hotel?.city}, {booking.hotel?.country}
                </p>
              </div>
              <Badge className={statusColors[booking.status]}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{booking.room_type?.name}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(booking.check_in_date), "MMM d")} -{" "}
                  {format(new Date(booking.check_out_date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="font-semibold">${booking.total_price}</span>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/bookings/${booking.id}`}>
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Manage your reservations and travel plans</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                  <Button asChild>
                    <Link href="/hotels">Browse Hotels</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(renderBookingCard)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No past bookings</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(renderBookingCard)
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
