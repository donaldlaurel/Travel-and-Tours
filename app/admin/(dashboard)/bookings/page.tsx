import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { UpdateBookingStatus } from "@/components/admin/update-booking-status"
import { BookingsFilter } from "@/components/admin/bookings-filter"
import { SortSelect, bookingSortOptions, parseSortParam } from "@/components/admin/sort-select"

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string; sort?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const search = params.search || ""
  const statusFilter = params.status || "all"
  const page = Number(params.page) || 1
  const perPage = 10
  const { column, ascending } = parseSortParam(params.sort, bookingSortOptions)

  let query = supabase.from("bookings").select(
    `
      *,
      hotel:hotels(name),
      room_type:room_types(name)
    `,
    { count: "exact" },
  )

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  const {
    data: bookings,
    count,
    error,
  } = await query.order(column, { ascending }).range((page - 1) * perPage, page * perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">Manage customer reservations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <BookingsFilter />
            <SortSelect options={bookingSortOptions} defaultValue={params.sort} />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading bookings: {error.message}</p>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left font-medium">Booking ID</th>
                      <th className="pb-3 text-left font-medium hidden md:table-cell">Hotel</th>
                      <th className="pb-3 text-left font-medium hidden lg:table-cell">Dates</th>
                      <th className="pb-3 text-left font-medium">Total</th>
                      <th className="pb-3 text-left font-medium">Status</th>
                      <th className="pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking: any) => (
                      <tr key={booking.id} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <p className="font-mono text-sm">{booking.id.slice(0, 8)}...</p>
                          <p className="text-sm text-muted-foreground md:hidden">{booking.hotel?.name}</p>
                        </td>
                        <td className="py-4 hidden md:table-cell">
                          <p className="font-medium">{booking.hotel?.name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{booking.room_type?.name || "Standard"}</p>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <p className="text-sm">
                            {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{booking.guests} guests</p>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">₱{Number(booking.total_price).toLocaleString()}</p>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[booking.status]}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/bookings/${booking.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <UpdateBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, count || 0)} of {count} bookings
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/bookings?status=${statusFilter}&sort=${params.sort || ""}&page=${page - 1}`}>Previous</Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/bookings?status=${statusFilter}&sort=${params.sort || ""}&page=${page + 1}`}>Next</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
