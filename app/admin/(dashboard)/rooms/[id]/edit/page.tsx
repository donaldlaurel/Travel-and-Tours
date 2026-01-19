import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomForm } from "@/components/admin/room-form"

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: room, error } = await supabase
    .from("room_types")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !room) {
    notFound()
  }

  const { data: hotels } = await supabase
    .from("hotels")
    .select("id, name, city")
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Room Type</h2>
        <p className="text-muted-foreground">Update room type details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
          <CardDescription>
            Modify the room type information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomForm room={room} hotels={hotels || []} />
        </CardContent>
      </Card>
    </div>
  )
}
