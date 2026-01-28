"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface AmenitiesManagerProps {
  amenities: string[]
  defaultAmenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  type: "hotel" | "room"
}

export function AmenitiesManager({
  amenities,
  defaultAmenities,
  onAmenitiesChange,
  type,
}: AmenitiesManagerProps) {
  const [newAmenity, setNewAmenity] = useState("")
  const [allAmenities, setAllAmenities] = useState<string[]>([
    ...defaultAmenities,
    ...amenities.filter((a) => !defaultAmenities.includes(a)),
  ])

  const handleAddAmenity = () => {
    const trimmedAmenity = newAmenity.trim()
    if (trimmedAmenity && !allAmenities.includes(trimmedAmenity)) {
      const updatedAmenities = [...allAmenities, trimmedAmenity]
      setAllAmenities(updatedAmenities)
      if (!amenities.includes(trimmedAmenity)) {
        onAmenitiesChange([...amenities, trimmedAmenity])
      }
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (amenity: string) => {
    if (!defaultAmenities.includes(amenity)) {
      setAllAmenities(allAmenities.filter((a) => a !== amenity))
      onAmenitiesChange(amenities.filter((a) => a !== amenity))
    }
  }

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    if (checked) {
      if (!amenities.includes(amenity)) {
        onAmenitiesChange([...amenities, amenity])
      }
    } else {
      onAmenitiesChange(amenities.filter((a) => a !== amenity))
    }
  }

  const isDefaultAmenity = (amenity: string) => defaultAmenities.includes(amenity)
  const customAmenities = allAmenities.filter((a) => !isDefaultAmenity(a))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {type === "hotel" ? "Hotel" : "Room"} Amenities
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Select from predefined amenities or add custom ones
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Custom Amenity */}
        <div className="flex gap-2">
          <Input
            placeholder={`Add a new ${type === "hotel" ? "hotel" : "room"} amenity...`}
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddAmenity()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddAmenity} disabled={!newAmenity.trim()}>
            Add
          </Button>
        </div>

        {/* Amenities Grid */}
        <div className="space-y-4">
          {/* Default Amenities */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
              PREDEFINED AMENITIES
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {defaultAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityToggle(amenity, checked as boolean)}
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Amenities */}
          {customAmenities.length > 0 && (
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                CUSTOM AMENITIES
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {customAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2 bg-muted/50 px-2 py-1.5 rounded-md">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityToggle(amenity, checked as boolean)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer flex-1 truncate">
                      {amenity}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="text-muted-foreground hover:text-destructive ml-auto"
                      title="Remove custom amenity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Count */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          {amenities.length} amenity{amenities.length !== 1 ? "ies" : ""} selected
        </div>
      </CardContent>
    </Card>
  )
}
