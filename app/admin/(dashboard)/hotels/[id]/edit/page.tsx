import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HotelForm } from "@/components/admin/hotel-form"
import { AvailabilityManager } from "@/components/admin/availability-manager"
import { HotelSurchargesManager } from "@/components/admin/hotel-surcharges-manager"

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hotel, error } = await supabase.from("hotels").select("*").eq("id", id).single()

  if (error || !hotel) {
    notFound()
  }

  // Fetch existing gallery images
  const { data: galleryImages } = await supabase
    .from("hotel_images")
    .select("image_url")
    .eq("hotel_id", id)
    .order("display_order", { ascending: true })

  const existingGalleryImages = galleryImages?.map((img) => img.image_url) || []

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
          <HotelForm hotel={hotel} existingGalleryImages={existingGalleryImages} />
        </CardContent>
      </Card>

      <AvailabilityManager hotelId={id} />

      <Card>
        <CardHeader>
          <CardTitle>Surcharges</CardTitle>
          <p className="text-sm text-muted-foreground">
            Additional charges that apply to bookings (e.g., resort fee, cleaning fee)
          </p>
        </CardHeader>
        <CardContent>
          <HotelSurchargesManager hotelId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
