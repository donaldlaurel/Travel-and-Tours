import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomForm } from "@/components/admin/room-form"

export default async function NewRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: hotels } = await supabase
    .from("hotels")
    .select("id, name, city")
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Room Type</h2>
        <p className="text-muted-foreground">Create a new room type for a hotel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
          <CardDescription>
            Enter the details for the new room type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomForm hotels={hotels || []} defaultHotelId={params.hotel} />
        </CardContent>
      </Card>
    </div>
  )
}
