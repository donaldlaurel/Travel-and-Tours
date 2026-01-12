import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hotel, CalendarCheck, Users, Star, TrendingUp, DollarSign } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: hotelsCount },
    { count: bookingsCount },
    { count: usersCount },
    { count: reviewsCount },
    { data: recentBookings },
    { data: bookingStats },
  ] = await Promise.all([
    supabase.from("hotels").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*, hotel:hotels(name), room_type:room_types(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("bookings").select("total_price, status").in("status", ["confirmed", "completed"]),
  ])

  const totalRevenue = bookingStats?.reduce((acc, b) => acc + Number(b.total_price), 0) || 0
  const pendingBookings = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const stats = [
    {
      name: "Total Hotels",
      value: hotelsCount || 0,
      icon: Hotel,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Total Bookings",
      value: bookingsCount || 0,
      icon: CalendarCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Total Users",
      value: usersCount || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Total Reviews",
      value: reviewsCount || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      name: "Pending Bookings",
      value: pendingBookings.count || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: "Total Revenue",
      value: `₱${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{booking.hotel?.name || "Unknown Hotel"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.room_type?.name || "Standard Room"} ·{" "}
                        {new Date(booking.check_in_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{Number(booking.total_price).toLocaleString()}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <a
                href="/admin/hotels/new"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors"
              >
                <Hotel className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Add New Hotel</p>
                  <p className="text-sm text-muted-foreground">Create a new hotel listing</p>
                </div>
              </a>
              <a
                href="/admin/bookings"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors"
              >
                <CalendarCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Bookings</p>
                  <p className="text-sm text-muted-foreground">View and update reservations</p>
                </div>
              </a>
              <a
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors"
              >
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">View registered users</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
