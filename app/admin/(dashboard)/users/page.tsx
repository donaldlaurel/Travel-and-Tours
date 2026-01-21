import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User, Edit } from "lucide-react"
import { ToggleAdminRole } from "@/components/admin/toggle-admin-role"
import { DeleteUserButton } from "@/components/admin/delete-user-button"
import { UsersFilter } from "@/components/admin/users-filter"
import { SortSelect, userSortOptions, parseSortParam } from "@/components/admin/sort-select"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; sort?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const search = params.search || ""
  const page = Number(params.page) || 1
  const perPage = 10
  const { column, ascending } = parseSortParam(params.sort, userSortOptions)

  // Fetch profiles with user counts
  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order(column, { ascending })
    .range((page - 1) * perPage, page * perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

  // Get booking counts for each user
  const userIds = profiles?.map((p) => p.id) || []
  const { data: bookingCounts } = await supabase
    .from("bookings")
    .select("user_id")
    .in("user_id", userIds.length > 0 ? userIds : ["none"])

  const bookingCountMap: Record<string, number> = {}
  bookingCounts?.forEach((b) => {
    bookingCountMap[b.user_id] = (bookingCountMap[b.user_id] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage registered users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <UsersFilter />
            <SortSelect options={userSortOptions} defaultValue={params.sort} />
          </div>
        </CardHeader>
        <CardContent>
          {profiles && profiles.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left font-medium">User</th>
                      <th className="pb-3 text-left font-medium hidden md:table-cell">Phone</th>
                      <th className="pb-3 text-left font-medium hidden sm:table-cell">Bookings</th>
                      <th className="pb-3 text-left font-medium">Role</th>
                      <th className="pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => {
                      const initials = profile.full_name
                        ? profile.full_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"

                      return (
                        <tr key={profile.id} className="border-b border-border last:border-0">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback
                                  className={profile.role === "admin" ? "bg-primary text-primary-foreground" : ""}
                                >
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{profile.full_name || "Unknown"}</p>
                                <p className="text-sm text-muted-foreground">{profile.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 hidden md:table-cell">
                            <span className="text-muted-foreground">{profile.phone || "-"}</span>
                          </td>
                          <td className="py-4 hidden sm:table-cell">
                            <span className="font-medium">{bookingCountMap[profile.id] || 0}</span>
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                                profile.role === "admin"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {profile.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                              {profile.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/users/${profile.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <ToggleAdminRole userId={profile.id} currentRole={profile.role} />
                              <DeleteUserButton 
                                userId={profile.id} 
                                userName={profile.full_name || "Unknown"} 
                                disabled={profile.role === "admin"}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, count || 0)} of {count} users
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users?search=${search}&sort=${params.sort || ""}&page=${page - 1}`}>Previous</Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users?search=${search}&sort=${params.sort || ""}&page=${page + 1}`}>Next</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
