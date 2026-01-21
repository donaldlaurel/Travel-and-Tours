export interface Hotel {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  star_rating: number | null
  price_per_night: number
  main_image: string | null
  amenities: string[]
  child_policy: string | null
  created_at: string
  updated_at: string
  avg_rating?: number
  review_count?: number
  lowest_price?: number
}

export interface HotelImage {
  id: string
  hotel_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}

export interface RoomType {
  id: string
  hotel_id: string
  name: string
  description: string | null
  max_guests: number
  max_adults: number
  max_children: number
  breakfast_included: number
  price_per_night: number
  base_price: number
  amenities: string[]
  image_url: string | null
  available_rooms: number
  created_at: string
  updated_at: string
}

export interface RoomRate {
  id: string
  room_type_id: string
  date: string
  price: number
  available_rooms: number | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: "user" | "admin"
  created_at: string
  updated_at: string
  email?: string
}

export interface Booking {
  id: string
  user_id: string
  hotel_id: string
  room_type_id: string
  check_in_date: string
  check_out_date: string
  guests: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  special_requests: string | null
  created_at: string
  updated_at: string
  hotel?: Hotel
  room_type?: RoomType
}

export interface Review {
  id: string
  user_id: string
  hotel_id: string
  booking_id: string | null
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  hotel_id: string
  created_at: string
  hotel?: Hotel
}

export interface SearchParams {
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  starRating?: number[]
  amenities?: string[]
}
