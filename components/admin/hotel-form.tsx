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
import type { Hotel } from "@/lib/types"
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload"

const AMENITIES = [
  "WiFi",
  "Pool",
  "Spa",
  "Gym",
  "Restaurant",
  "Bar",
  "Room Service",
  "Parking",
  "Beach Access",
  "Air Conditioning",
  "Pet Friendly",
  "Business Center",
  "Kids Club",
  "Airport Shuttle",
  "Concierge",
]

const CHILD_POLICIES = [
  "Children of all ages are welcome",
  "Children ages 0-2 stay free when using existing bedding",
  "Children ages 0-5 stay free when using existing bedding",
  "Children ages 0-12 stay free when using existing bedding",
  "One child under 6 years stays free when using existing bedding",
  "One child under 12 years stays free when using existing bedding",
  "No children allowed",
  "Only children above 12 years are allowed",
]

interface HotelFormProps {
  hotel?: Hotel
  existingGalleryImages?: string[]
}

export function HotelForm({ hotel, existingGalleryImages = [] }: HotelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    description: hotel?.description || "",
    address: hotel?.address || "",
    city: hotel?.city || "",
    country: hotel?.country || "Philippines",
    star_rating: hotel?.star_rating?.toString() || "3",
    main_image: hotel?.main_image || "",
    amenities: hotel?.amenities || [],
    child_policy: hotel?.child_policy || "Children of all ages are welcome",
  })

  const [galleryImages, setGalleryImages] = useState<string[]>(existingGalleryImages)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const hotelData = {
      name: formData.name,
      description: formData.description || null,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      star_rating: Number.parseInt(formData.star_rating),
      main_image: formData.main_image || null,
      amenities: formData.amenities,
      child_policy: formData.child_policy,
    }

    let hotelId = hotel?.id

    if (hotel) {
      const { error } = await supabase.from("hotels").update(hotelData).eq("id", hotel.id)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    } else {
      const { data, error } = await supabase.from("hotels").insert(hotelData).select("id").single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      hotelId = data.id
    }

    // Save gallery images
    if (hotelId) {
      // Delete existing gallery images
      await supabase.from("hotel_images").delete().eq("hotel_id", hotelId)

      // Insert new gallery images
      if (galleryImages.length > 0) {
        const imageRecords = galleryImages.map((url, index) => ({
          hotel_id: hotelId,
          image_url: url,
          alt_text: `${formData.name} - Image ${index + 1}`,
          display_order: index,
        }))

        const { error: imageError } = await supabase.from("hotel_images").insert(imageRecords)

        if (imageError) {
          console.error("Failed to save gallery images:", imageError.message)
        }
      }
    }

    router.push("/admin/hotels")
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
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Hotel Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="star_rating">Star Rating *</Label>
          <Select
            value={formData.star_rating}
            onValueChange={(value) => setFormData({ ...formData, star_rating: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((star) => (
                <SelectItem key={star} value={star.toString()}>
                  {star} Star{star > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <ImageUpload
          label="Main Image"
          value={formData.main_image}
          onChange={(url) => setFormData({ ...formData, main_image: url })}
          folder="hotels"
          aspectRatio="video"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="child_policy">Child Policy</Label>
        <Select
          value={formData.child_policy}
          onValueChange={(value) => setFormData({ ...formData, child_policy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select child policy" />
          </SelectTrigger>
          <SelectContent>
            {CHILD_POLICIES.map((policy) => (
              <SelectItem key={policy} value={policy}>
                {policy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MultiImageUpload
        label="Gallery Images"
        values={galleryImages}
        onChange={setGalleryImages}
        folder="hotels"
        maxImages={10}
      />

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {AMENITIES.map((amenity) => (
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
          {loading ? "Saving..." : hotel ? "Update Hotel" : "Create Hotel"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
