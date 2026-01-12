import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HotelForm } from "@/components/admin/hotel-form"

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hotel, error } = await supabase.from("hotels").select("*").eq("id", id).single()

  if (error || !hotel) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Hotel</h2>
        <p className="text-muted-foreground">Update hotel information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HotelForm hotel={hotel} />
        </CardContent>
      </Card>
    </div>
  )
}
