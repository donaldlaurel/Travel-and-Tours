"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StickySearch } from "@/components/sticky-search"
import { useLanguage } from "@/lib/language-context"

const banners = [
  {
    src: "/images/banner1.jpg",
    alt: "Whale shark swimming in crystal clear blue waters",
  },
  {
    src: "/images/banner2.jpg",
    alt: "Tropical resort with turquoise lagoon and palm trees",
  },
  {
    src: "/images/banner3.jpg",
    alt: "River cruise through lush jungle scenery",
  },
  {
    src: "/images/banner4.jpg",
    alt: "Historic stone architecture with beautiful gardens",
  },
  {
    src: "/images/banner5.jpg",
    alt: "Famous Chocolate Hills landscape",
  },
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { t, language } = useLanguage()

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  return (
    <section className="relative h-[600px] lg:h-[650px] overflow-hidden">
      {/* Banner Images */}
      {banners.map((banner, index) => (
        <div
          key={banner.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={banner.src || "/placeholder.svg"}
            alt={banner.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance drop-shadow-lg" key={language}>
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md" key={`subtitle-${language}`}>
            {t('home.subtitle')}
          </p>
        </div>
        <StickySearch />
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white h-12 w-12 rounded-full backdrop-blur-sm"
        onClick={() => {
          goToPrev()
          setIsAutoPlaying(false)
          setTimeout(() => setIsAutoPlaying(true), 5000)
        }}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white h-12 w-12 rounded-full backdrop-blur-sm"
        onClick={() => {
          goToNext()
          setIsAutoPlaying(false)
          setTimeout(() => setIsAutoPlaying(true), 5000)
        }}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75",
            )}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
