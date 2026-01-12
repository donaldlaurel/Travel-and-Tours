import Link from "next/link"
import Image from "next/image"

const destinations = [
  {
    name: "Mactan",
    country: "Philippines",
    image: "/mactan-cebu-beach-resort-aerial-view.jpg",
    hotels: 156,
  },
  {
    name: "Cebu City",
    country: "Philippines",
    image: "/cebu-city-skyline-urban-philippines.jpg",
    hotels: 230,
  },
  {
    name: "Bohol",
    country: "Philippines",
    image: "/bohol-chocolate-hills-philippines.jpg",
    hotels: 185,
  },
  {
    name: "Boracay",
    country: "Philippines",
    image: "/boracay-white-beach-sunset-philippines.jpg",
    hotels: 320,
  },
  {
    name: "Palawan",
    country: "Philippines",
    image: "/palawan-el-nido-lagoon-philippines.jpg",
    hotels: 275,
  },
  {
    name: "Baguio",
    country: "Philippines",
    image: "/baguio-city-pine-trees-mountains-philippines.jpg",
    hotels: 142,
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-balance">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular destinations and find your perfect getaway
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((destination) => (
            <Link
              key={destination.name}
              href={`/hotels?city=${destination.name}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                <h3 className="font-semibold text-lg">{destination.name}</h3>
                <p className="text-sm text-primary-foreground/80">{destination.hotels} hotels</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
