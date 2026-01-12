"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Hotel, HotelImage } from "@/lib/types"

interface HotelGalleryProps {
  hotel: Hotel
  images: HotelImage[]
}

export function HotelGallery({ hotel, images }: HotelGalleryProps) {
  const [showGallery, setShowGallery] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const allImages = [
    { id: "main", image_url: hotel.main_image, alt_text: hotel.name },
    ...images.map((img) => ({ id: img.id, image_url: img.image_url, alt_text: img.alt_text })),
  ]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="relative bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-4">
            {/* Main Image */}
            <div
              className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto md:h-[400px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                setCurrentIndex(0)
                setShowGallery(true)
              }}
            >
              <Image
                src={hotel.main_image || "/placeholder.svg?height=400&width=600"}
                alt={hotel.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>

            {/* Secondary Images */}
            {allImages.slice(1, 5).map((image, index) => (
              <div
                key={image.id}
                className="hidden md:block relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index + 1)
                  setShowGallery(true)
                }}
              >
                <Image
                  src={image.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={image.alt_text || hotel.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                {index === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">+{allImages.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}

            {/* Show All Photos Button */}
            <Button
              variant="secondary"
              className="absolute bottom-8 right-8 hidden md:flex"
              onClick={() => setShowGallery(true)}
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Show all photos
            </Button>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-background">
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {allImages.length}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setShowGallery(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Image */}
            <div className="flex-1 relative">
              <Image
                src={allImages[currentIndex].image_url || "/placeholder.svg?height=600&width=800"}
                alt={allImages[currentIndex].alt_text || hotel.name}
                fill
                className="object-contain"
              />

              {/* Navigation */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 border-t overflow-x-auto">
              <div className="flex gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-20 h-14 rounded overflow-hidden shrink-0 ${
                      index === currentIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg?height=56&width=80"}
                      alt={image.alt_text || ""}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
