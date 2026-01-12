import { PopularDestinations } from "@/components/popular-destinations"
import { FeaturedHotels } from "@/components/featured-hotels"
import { WhyBookWithUs } from "@/components/why-book-with-us"
import { HeroSlider } from "@/components/hero-slider"

export default function HomePage() {
  return (
    <div>
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
