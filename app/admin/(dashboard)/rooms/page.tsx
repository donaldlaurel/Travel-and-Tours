import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, Edit } from "lucide-react"
import { DeleteRoomButton } from "@/components/admin/delete-room-button"
import { SortHeader } from "@/components/admin/sort-header"
import { Suspense } from "react"
import Loading from "./loading"

export default async function AdminRoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; sort?: string; ascending?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const search = params.search || ""
  const page = Number(params.page) || 1
  const perPage = 10
  const sortColumn = params.sort || "created_at"
  const ascending = params.ascending === "true"

  // Fetch room types with hotel info
  let query = supabase
    .from("room_types")
    .select(`
      *,
      hotels:hotel_id (id, name, city)
    `, { count: "exact" })

  let allRoomsData: any[] = []
  let error: any = null
  let count: number | null = null

  // Fetch all data first, then filter in JavaScript for both room and hotel name
  const { data: allData, error: fetchError, count: totalCount } = await query

  if (fetchError) {
    error = fetchError
  } else if (allData) {
    // Filter by both room name and hotel name in JavaScript
    if (search) {
      const searchLower = search.toLowerCase()
      allRoomsData = allData.filter((room) => {
        const hotelName = (room.hotels as any)?.name?.toLowerCase() || ""
        const roomName = room.name?.toLowerCase() || ""
        return hotelName.includes(searchLower) || roomName.includes(searchLower)
      })
    } else {
      allRoomsData = allData
    }
    count = allRoomsData.length

    // Fetch today's room rates for pricing
    const today = new Date().toISOString().split("T")[0]
    const { data: todayRates } = await supabase
      .from("room_rates")
      .select("room_type_id, price")
      .eq("date", today)

    // Fetch today's surcharges
    const { data: todaySurcharges } = await supabase
      .from("room_surcharges")
      .select("room_type_id, surcharge_price")
      .lte("start_date", today)
      .gte("end_date", today)

    // Create a map of room_type_id to today's price
    const todayPriceMap: Record<string, number> = {}
    todayRates?.forEach((rate) => {
      todayPriceMap[rate.room_type_id] = Number(rate.price)
    })

    // Create a map of room_type_id to surcharge total for today
    const surchargeMap: Record<string, number> = {}
    todaySurcharges?.forEach((surcharge) => {
      surchargeMap[surcharge.room_type_id] = (surchargeMap[surcharge.room_type_id] || 0) + Number(surcharge.surcharge_price)
    })

    // Add today's price + surcharge to each room
    allRoomsData = allRoomsData.map((room) => ({
      ...room,
      todayPrice: (todayPriceMap[room.id] ?? Number(room.base_price) ?? 0) + (surchargeMap[room.id] || 0),
    }))
  }

  // Sort in JavaScript if needed for relational fields
  if (sortColumn === "hotel_name") {
    if (allRoomsData) {
      allRoomsData.sort((a, b) => {
        const hotelA = (a.hotels as any)?.name || ""
        const hotelB = (b.hotels as any)?.name || ""
        const comparison = hotelA.localeCompare(hotelB)
        return ascending ? comparison : -comparison
      })
    }
  } else if (sortColumn === "name") {
    if (allRoomsData) {
      allRoomsData.sort((a, b) => {
        const comparison = (a.name || "").localeCompare(b.name || "")
        return ascending ? comparison : -comparison
      })
    }
  } else if (sortColumn === "base_price") {
    if (allRoomsData) {
      allRoomsData.sort((a, b) => {
        const priceA = Number(a.todayPrice) || 0
        const priceB = Number(b.todayPrice) || 0
        const comparison = priceA - priceB
        return ascending ? comparison : -comparison
      })
    }
  }
  // Note: Don't re-fetch from Supabase after we've already mapped prices, as it would lose the todayPrice data

  // Apply pagination after all filtering and sorting
  const paginatedRooms = allRoomsData.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Room Types</h2>
          <p className="text-muted-foreground">Manage room types for all hotels</p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room Type
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Loading />}>
        <Card>
          <CardHeader>
            <form className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="search" placeholder="Search rooms or hotels..." defaultValue={search} className="pl-9" />
              </div>
              <Button type="submit">Filter</Button>
            </form>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error loading rooms: {error.message}</p>
            ) : paginatedRooms && paginatedRooms.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <SortHeader
                          column="hotel_name"
                          label="Hotel"
                          currentSort={sortColumn}
                          currentAscending={ascending}
                          searchParams={{ search, page: page.toString() }}
                          className="hidden md:table-cell"
                        />
                        <SortHeader
                          column="name"
                          label="Room Type"
                          currentSort={sortColumn}
                          currentAscending={ascending}
                          searchParams={{ search, page: page.toString() }}
                        />
                        <SortHeader
                          column="max_guests"
                          label="Capacity"
                          currentSort={sortColumn}
                          currentAscending={ascending}
                          searchParams={{ search, page: page.toString() }}
                          className="hidden sm:table-cell"
                        />
                        <SortHeader
                          column="base_price"
                          label="Price (Today)"
                          currentSort={sortColumn}
                          currentAscending={ascending}
                          searchParams={{ search, page: page.toString() }}
                        />
                        <th className="pb-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRooms.map((room: any) => (
                        <tr key={room.id} className="border-b border-border last:border-0">
                          <td className="py-4 hidden md:table-cell">
                            <div>
                              <p className="font-medium">{room.hotels?.name || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{room.hotels?.city || ""}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                                {room.image_url ? (
                                  <Image
                                    src={room.image_url || "/placeholder.svg"}
                                    alt={room.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{room.name}</p>
                                <p className="text-sm text-muted-foreground md:hidden">
                                  {room.hotels?.name || "Unknown Hotel"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 hidden sm:table-cell">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {room.max_guests} guests
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-medium">₱{Number(room.todayPrice).toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm">/night</span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/rooms/${room.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <DeleteRoomButton roomId={room.id} roomName={room.name} />
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
                      Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, count || 0)} of {count} rooms
                    </p>
                    <div className="flex gap-2">
                      {page > 1 && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/rooms?search=${search}&sort=${sortColumn}&ascending=${ascending}&page=${page - 1}`}>
                            Previous
                          </Link>
                        </Button>
                      )}
                      {page < totalPages && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/rooms?search=${search}&sort=${sortColumn}&ascending=${ascending}&page=${page + 1}`}>
                            Next
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No room types found</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/rooms/new">Add your first room type</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}
