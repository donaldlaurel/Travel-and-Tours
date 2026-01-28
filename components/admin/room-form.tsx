import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload"
import { RoomRateCalendar } from "@/components/admin/room-rate-calendar"
import { SurchargesManager } from "@/components/admin/surcharges-manager"
import { AmenitiesManager } from "@/components/admin/amenities-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DEFAULT_ROOM_AMENITIES = [
  "Air Conditioning",
  "WiFi",
  "TV",
  "Mini Bar",
  "Safe",
  "Balcony",
  "Ocean View",
  "City View",
  "Bathtub",
  "Shower",
  "Hair Dryer",
  "Coffee Maker",
  "Desk",
  "Sofa",
  "King Bed",
  "Twin Beds",
]

interface Hotel {
  id: string
  name: string
  city: string
}

interface RoomType {
  id: string
  hotel_id: string
  name: string
  description: string | null
  price_per_night: number
  base_price: number
  max_guests: number
  max_adults: number
  max_children: number
  breakfast_included: number
  available_rooms: number
  image_url: string | null
  amenities: string[]
  extra_person_price?: number | null
  extra_person_breakfast?: boolean
}

interface RoomFormProps {
  room?: RoomType
  hotels: Hotel[]
  defaultHotelId?: string
}

export function RoomForm({ room, hotels, defaultHotelId }: RoomFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    hotel_id: room?.hotel_id || defaultHotelId || "",
    name: room?.name || "",
    description: room?.description || "",
    max_adults: room?.max_adults?.toString() || "2",
    max_children: room?.max_children?.toString() || "0",
    breakfast_included: room?.breakfast_included?.toString() || "0",
    available_rooms: room?.available_rooms?.toString() || "10",
    image_url: room?.image_url || "",
    amenities: room?.amenities || [],
    extra_person_price: room?.extra_person_price?.toString() || "",
    extra_person_breakfast: room?.extra_person_breakfast || false,
  })
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [initialGalleryImages, setInitialGalleryImages] = useState<string[]>([])
  const [surchargeRefreshTrigger, setSurchargeRefreshTrigger] = useState(0)

  // Load existing gallery images when editing a room
  useEffect(() => {
    if (room?.id) {
      const loadGalleryImages = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("room_images")
          .select("image_url")
          .eq("room_type_id", room.id)
          .order("display_order", { ascending: true })

        if (!error && data) {
          const urls = data.map(img => img.image_url)
          setGalleryImages(urls)
          setInitialGalleryImages(urls)
        }
      }
      loadGalleryImages()
    }
  }, [room?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.hotel_id) {
      setError("Please select a hotel")
      setLoading(false)
      return
    }

    const supabase = createClient()

    const maxAdults = Number.parseInt(formData.max_adults)
    const maxChildren = Number.parseInt(formData.max_children)
    
    const roomData = {
      hotel_id: formData.hotel_id,
      name: formData.name,
      description: formData.description || null,
      base_price: 0, // No base price - rooms are closed by default
      price_per_night: 0, // Keep for backwards compatibility
      max_adults: maxAdults,
      max_children: maxChildren,
      max_guests: maxAdults + maxChildren,
      breakfast_included: Number.parseInt(formData.breakfast_included),
      available_rooms: Number.parseInt(formData.available_rooms),
      image_url: formData.image_url || null,
      amenities: formData.amenities,
      extra_person_price: formData.extra_person_price ? Number.parseFloat(formData.extra_person_price) : null,
      extra_person_breakfast: formData.extra_person_breakfast,
    }

    if (room) {
      const { error } = await supabase
        .from("room_types")
        .update(roomData)
        .eq("id", room.id)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Always delete and re-insert gallery images (handle both new and updated images)
      // First delete all existing images for this room
      const { error: deleteError } = await supabase
        .from("room_images")
        .delete()
        .eq("room_type_id", room.id)

      if (deleteError) {
        console.log("[v0] Error deleting old images:", deleteError.message)
      }

      // Then insert the new images
      if (galleryImages.length > 0) {
        const imagesToInsert = galleryImages.map((image_url, index) => ({
          room_type_id: room.id,
          image_url,
          display_order: index,
        }))

        const { error: imageError } = await supabase
          .from("room_images")
          .insert(imagesToInsert)

        if (imageError) {
          setError(`Failed to save gallery images: ${imageError.message}`)
          setLoading(false)
          return
        }
      }
    } else {
      const { data, error } = await supabase
        .from("room_types")
        .insert(roomData)
        .select()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Save gallery images for new room
      if (data && data.length > 0 && galleryImages.length > 0) {
        const roomId = data[0].id
        const imagesToInsert = galleryImages.map((image_url, index) => ({
          room_type_id: roomId,
          image_url,
          display_order: index,
        }))

        const { error: imageError } = await supabase
          .from("room_images")
          .insert(imagesToInsert)

        if (imageError) {
          setError(`Failed to save gallery images: ${imageError.message}`)
          setLoading(false)
          return
        }
      }
    }

    router.push("/admin/rooms")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hotel_id">Hotel *</Label>
          {room ? (
            <div className="h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm flex items-center">
              {hotels.find(h => h.id === formData.hotel_id)?.name} - {hotels.find(h => h.id === formData.hotel_id)?.city}
            </div>
          ) : (
            <Select
              value={formData.hotel_id}
              onValueChange={(value) => setFormData({ ...formData, hotel_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Room Type Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Deluxe Ocean View"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the room type..."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Room Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="max_adults">Maximum Adults *</Label>
              <Input
                id="max_adults"
                type="number"
                min="1"
                max="10"
                value={formData.max_adults}
                onChange={(e) => setFormData({ ...formData, max_adults: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Ages 18 or above</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_children">Maximum Children</Label>
              <Input
                id="max_children"
                type="number"
                min="0"
                max="10"
                value={formData.max_children}
                onChange={(e) => setFormData({ ...formData, max_children: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Ages 0-17</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakfast_included">Breakfast Included</Label>
              <Input
                id="breakfast_included"
                type="number"
                min="0"
                max="10"
                value={formData.breakfast_included}
                onChange={(e) => setFormData({ ...formData, breakfast_included: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Number of guests with free breakfast</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_rooms">Available Rooms *</Label>
              <Input
                id="available_rooms"
                type="number"
                min="0"
                value={formData.available_rooms}
                onChange={(e) => setFormData({ ...formData, available_rooms: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Total rooms of this type</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Extra Person</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add pricing and breakfast options for additional guests beyond the room's maximum capacity
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="extra_person_price">Extra Person Price per Night (₱)</Label>
              <Input
                id="extra_person_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.extra_person_price}
                onChange={(e) => setFormData({ ...formData, extra_person_price: e.target.value })}
                placeholder="e.g., 500"
              />
              <p className="text-xs text-muted-foreground">Price for each additional guest</p>
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extra_person_breakfast"
                  checked={formData.extra_person_breakfast}
                  onCheckedChange={(checked) => setFormData({ ...formData, extra_person_breakfast: checked as boolean })}
                />
                <Label htmlFor="extra_person_breakfast" className="cursor-pointer font-normal">
                  Include Breakfast for Extra Person
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability & Pricing</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rooms are closed by default. Select dates and set rates to make them available for booking.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {room?.id ? (
            <RoomRateCalendar
              roomTypeId={room.id}
              hotelId={formData.hotel_id}
              onSurchargeAdded={() => setSurchargeRefreshTrigger(prev => prev + 1)}
            />
          ) : (
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              Save the room first to manage availability and pricing using the calendar.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surcharges</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add additional charges that apply to bookings (e.g., resort fee, cleaning fee)
          </p>
        </CardHeader>
        <CardContent>
          {room?.id ? (
            <SurchargesManager roomTypeId={room.id} refreshTrigger={surchargeRefreshTrigger} />
          ) : (
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              Save the room first to add surcharges.
            </p>
          )}
        </CardContent>
      </Card>

      <ImageUpload
        label="Room Image"
        value={formData.image_url}
        onChange={(url) => setFormData({ ...formData, image_url: url })}
        folder="rooms"
        aspectRatio="video"
      />

      <MultiImageUpload
        label="Gallery Images"
        values={galleryImages}
        onChange={setGalleryImages}
        folder="rooms"
        maxImages={undefined}
      />

      <AmenitiesManager
        amenities={formData.amenities}
        defaultAmenities={DEFAULT_ROOM_AMENITIES}
        onAmenitiesChange={(amenities) => setFormData({ ...formData, amenities })}
        type="room"
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : room ? "Update Room Type" : "Create Room Type"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
