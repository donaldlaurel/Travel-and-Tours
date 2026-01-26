'use client'

import { PopularDestinations } from "@/components/popular-destinations"
import { FeaturedHotels } from "@/components/featured-hotels"
import { WhyBookWithUs } from "@/components/why-book-with-us"
import { HeroSlider } from "@/components/hero-slider"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div key={language}>
      {/* Hero Section */}
      <HeroSlider />

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Featured Hotels */}
      <FeaturedHotels />

      {/* Why Book With Us */}
      <WhyBookWithUs />
    </div>
  )
}
