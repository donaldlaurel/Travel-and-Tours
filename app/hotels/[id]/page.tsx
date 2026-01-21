import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HotelGallery } from "@/components/hotel-gallery"
import { HotelInfo } from "@/components/hotel-info"
import { RoomList } from "@/components/room-list"
import { HotelReviews } from "@/components/hotel-reviews"
import { BookingSidebar } from "@/components/booking-sidebar"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    checkIn?: string
    checkOut?: string
    guests?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: hotel } = await supabase.from("hotels").select("name, city, country, description").eq("id", id).single()

  if (!hotel) {
    return { title: "Hotel Not Found" }
  }

  return {
    title: `${hotel.name} - StayBook`,
    description: hotel.description || `Book ${hotel.name} in ${hotel.city}, ${hotel.country}`,
  }
}

export default async function HotelDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const search = await searchParams
  const supabase = await createClient()

  // Fetch hotel data
  const { data: hotel, error: hotelError } = await supabase.from("hotels").select("*").eq("id", id).single()

  if (hotelError || !hotel) {
    notFound()
  }

  // Fetch hotel images
  const { data: images } = await supabase
    .from("hotel_images")
    .select("*")
    .eq("hotel_id", id)
    .order("display_order", { ascending: true })

  // Fetch room types
  const { data: roomTypes } = await supabase.from("room_types").select("*").eq("hotel_id", id).order("price_per_night")

  // Fetch reviews
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("hotel_id", id)
    .order("created_at", { ascending: false })

  // Fetch profiles for review authors
  const userIds = [...new Set(reviewsData?.map(r => r.user_id) || [])]
  const { data: profiles } = userIds.length > 0 
    ? await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds)
    : { data: [] }

  // Combine reviews with profile data
  const reviews = reviewsData?.map(review => ({
    ...review,
    profile: profiles?.find(p => p.id === review.user_id) || null
  })) || []

  // Calculate average rating
  const avgRating = reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Gallery */}
      <HotelGallery hotel={hotel} images={images || []} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <HotelInfo hotel={hotel} avgRating={avgRating} reviewCount={reviews?.length || 0} />

            {/* Room Types */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
              <RoomList
                roomTypes={roomTypes || []}
                hotelId={hotel.id}
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                guests={search.guests ? Number.parseInt(search.guests) : 2}
              />
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>
              <HotelReviews reviews={reviews || []} hotelId={hotel.id} avgRating={avgRating} />
            </section>
          </main>

          {/* Booking Sidebar */}
          <aside className="lg:w-96 shrink-0">
            <BookingSidebar
              hotel={hotel}
              roomTypes={roomTypes || []}
              checkIn={search.checkIn}
              checkOut={search.checkOut}
              guests={search.guests ? Number.parseInt(search.guests) : 2}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
