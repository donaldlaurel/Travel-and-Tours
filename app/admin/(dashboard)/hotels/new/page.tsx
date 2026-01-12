import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HotelForm } from "@/components/admin/hotel-form"

export default function NewHotelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Hotel</h2>
        <p className="text-muted-foreground">Create a new hotel listing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HotelForm />
        </CardContent>
      </Card>
    </div>
  )
}
