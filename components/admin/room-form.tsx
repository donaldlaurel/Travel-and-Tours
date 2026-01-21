"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/admin/image-upload"
import { RoomRateCalendar } from "@/components/admin/room-rate-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ROOM_AMENITIES = [
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
    base_price: room?.base_price?.toString() || room?.price_per_night?.toString() || "",
    max_adults: room?.max_adults?.toString() || "2",
    max_children: room?.max_children?.toString() || "0",
    breakfast_included: room?.breakfast_included?.toString() || "0",
    available_rooms: room?.available_rooms?.toString() || "10",
    image_url: room?.image_url || "",
    amenities: room?.amenities || [],
  })

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

    const basePrice = Number.parseFloat(formData.base_price)
    const maxAdults = Number.parseInt(formData.max_adults)
    const maxChildren = Number.parseInt(formData.max_children)
    
    const roomData = {
      hotel_id: formData.hotel_id,
      name: formData.name,
      description: formData.description || null,
      base_price: basePrice,
      price_per_night: basePrice, // Keep for backwards compatibility
      max_adults: maxAdults,
      max_children: maxChildren,
      max_guests: maxAdults + maxChildren,
      breakfast_included: Number.parseInt(formData.breakfast_included),
      available_rooms: Number.parseInt(formData.available_rooms),
      image_url: formData.image_url || null,
      amenities: formData.amenities,
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
    } else {
      const { error } = await supabase
        .from("room_types")
        .insert(roomData)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    router.push("/admin/rooms")
    router.refresh()
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] })
    } else {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== amenity) })
    }
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
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="base_price">Base Price per Night (₱) *</Label>
            <Input
              id="base_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">Default price when no daily rate is set</p>
          </div>

          {room?.id && formData.base_price && (
            <RoomRateCalendar
              roomTypeId={room.id}
              hotelId={formData.hotel_id}
              basePrice={Number.parseFloat(formData.base_price) || 0}
            />
          )}

          {!room?.id && (
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              Save the room first to set daily rates using the calendar.
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

      <div className="space-y-2">
        <Label>Room Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ROOM_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <label htmlFor={amenity} className="text-sm cursor-pointer">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

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
