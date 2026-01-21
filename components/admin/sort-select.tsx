"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortOption {
  value: string
  label: string
  column: string
  ascending: boolean
}

interface SortSelectProps {
  options: SortOption[]
  defaultValue?: string
  paramName?: string
}

export function SortSelect({ options, defaultValue, paramName = "sort" }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get(paramName) || defaultValue || (options[0]?.value || "")

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, value)
    params.set("page", "1") // Reset to first page when sorting changes
    router.push(`?${params.toString()}`)
  }

  if (!options || options.length === 0) {
    return null
  }

  return (
    <Select value={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Predefined sort options for common entities
export const hotelSortOptions: SortOption[] = [
  { value: "created_desc", label: "Newest First", column: "created_at", ascending: false },
  { value: "created_asc", label: "Oldest First", column: "created_at", ascending: true },
  { value: "name_asc", label: "Name (A-Z)", column: "name", ascending: true },
  { value: "name_desc", label: "Name (Z-A)", column: "name", ascending: false },
  { value: "rating_desc", label: "Highest Rated", column: "star_rating", ascending: false },
  { value: "rating_asc", label: "Lowest Rated", column: "star_rating", ascending: true },
  { value: "city_asc", label: "City (A-Z)", column: "city", ascending: true },
]

export const roomSortOptions: SortOption[] = [
  { value: "created_desc", label: "Newest First", column: "created_at", ascending: false },
  { value: "created_asc", label: "Oldest First", column: "created_at", ascending: true },
  { value: "name_asc", label: "Name (A-Z)", column: "name", ascending: true },
  { value: "name_desc", label: "Name (Z-A)", column: "name", ascending: false },
  { value: "price_asc", label: "Price (Low-High)", column: "base_price", ascending: true },
  { value: "price_desc", label: "Price (High-Low)", column: "base_price", ascending: false },
  { value: "capacity_desc", label: "Capacity (High-Low)", column: "max_guests", ascending: false },
  { value: "available_desc", label: "Most Available", column: "available_rooms", ascending: false },
]

export const bookingSortOptions: SortOption[] = [
  { value: "created_desc", label: "Newest First", column: "created_at", ascending: false },
  { value: "created_asc", label: "Oldest First", column: "created_at", ascending: true },
  { value: "checkin_asc", label: "Check-in (Soonest)", column: "check_in_date", ascending: true },
  { value: "checkin_desc", label: "Check-in (Latest)", column: "check_in_date", ascending: false },
  { value: "price_desc", label: "Price (High-Low)", column: "total_price", ascending: false },
  { value: "price_asc", label: "Price (Low-High)", column: "total_price", ascending: true },
]

export const userSortOptions: SortOption[] = [
  { value: "created_desc", label: "Newest First", column: "created_at", ascending: false },
  { value: "created_asc", label: "Oldest First", column: "created_at", ascending: true },
  { value: "name_asc", label: "Name (A-Z)", column: "full_name", ascending: true },
  { value: "name_desc", label: "Name (Z-A)", column: "full_name", ascending: false },
  { value: "role_asc", label: "Role (Admin First)", column: "role", ascending: false },
]

export const availabilitySortOptions: SortOption[] = [
  { value: "created_desc", label: "Newest First", column: "created_at", ascending: false },
  { value: "created_asc", label: "Oldest First", column: "created_at", ascending: true },
  { value: "start_asc", label: "Start Date (Soonest)", column: "start_date", ascending: true },
  { value: "start_desc", label: "Start Date (Latest)", column: "start_date", ascending: false },
  { value: "end_asc", label: "End Date (Soonest)", column: "end_date", ascending: true },
  { value: "end_desc", label: "End Date (Latest)", column: "end_date", ascending: false },
]

// Helper to parse sort param and get column/direction
export function parseSortParam(
  sortParam: string | undefined,
  options: SortOption[]
): { column: string; ascending: boolean } {
  if (!sortParam || !options || options.length === 0) {
    return { column: "created_at", ascending: false }
  }

  const option = options.find((o) => o.value === sortParam)
  if (option) {
    return { column: option.column, ascending: option.ascending }
  }

  // Fallback to first option
  const defaultOption = options[0]
  return { column: defaultOption.column, ascending: defaultOption.ascending }
}
