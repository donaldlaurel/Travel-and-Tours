import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ hotelId: string }>
  searchParams: Promise<{
    roomType: string
    checkIn: string
    checkOut: string
    guests: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hotelId } = await params
  const supabase = await createClient()
  const { data: hotel } = await supabase.from("hotels").select("name").eq("id", hotelId).single()

  return {
    title: hotel ? `Book ${hotel.name} - StayBook` : "Complete Your Booking - StayBook",
  }
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { hotelId } = await params
  const search = await searchParams
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(
      `/auth/login?redirect=/booking/${hotelId}?roomType=${search.roomType}&checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`,
    )
  }

  // Fetch hotel
  const { data: hotel, error: hotelError } = await supabase.from("hotels").select("*").eq("id", hotelId).single()

  if (hotelError || !hotel) {
    notFound()
  }

  // Fetch room type
  const { data: roomType, error: roomError } = await supabase
    .from("room_types")
    .select("*")
    .eq("id", search.roomType)
    .single()

  if (roomError || !roomType) {
    notFound()
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        <BookingForm
          hotel={hotel}
          roomType={roomType}
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          guests={Number.parseInt(search.guests) || 2}
          user={user}
          profile={profile}
        />
      </div>
    </div>
  )
}
