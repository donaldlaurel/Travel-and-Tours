import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Star, MapPin, Edit } from "lucide-react"
import { DeleteHotelButton } from "@/components/admin/delete-hotel-button"

export default async function AdminHotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const search = params.search || ""
  const page = Number(params.page) || 1
  const perPage = 10

  let query = supabase.from("hotels").select("*", { count: "exact" })

  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,country.ilike.%${search}%`)
  }

  const {
    data: hotels,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range((page - 1) * perPage, page * perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hotels</h2>
          <p className="text-muted-foreground">Manage your hotel listings</p>
        </div>
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="search" placeholder="Search hotels..." defaultValue={search} className="pl-9" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading hotels: {error.message}</p>
          ) : hotels && hotels.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left font-medium">Hotel</th>
                      <th className="pb-3 text-left font-medium hidden md:table-cell">Location</th>
                      <th className="pb-3 text-left font-medium hidden sm:table-cell">Rating</th>
                      <th className="pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotels.map((hotel) => (
                      <tr key={hotel.id} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                              {hotel.main_image ? (
                                <Image
                                  src={hotel.main_image || "/placeholder.svg"}
                                  alt={hotel.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                  No img
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{hotel.name}</p>
                              <p className="text-sm text-muted-foreground md:hidden">
                                {hotel.city}, {hotel.country}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {hotel.city}, {hotel.country}
                          </div>
                        </td>
                        <td className="py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {hotel.star_rating || "-"}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/hotels/${hotel.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <DeleteHotelButton hotelId={hotel.id} hotelName={hotel.name} />
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
                    Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, count || 0)} of {count} hotels
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/hotels?search=${search}&page=${page - 1}`}>Previous</Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/hotels?search=${search}&page=${page + 1}`}>Next</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hotels found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/hotels/new">Add your first hotel</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
