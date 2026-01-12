"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Check, X, Clock, CheckCircle } from "lucide-react"

interface UpdateBookingStatusProps {
  bookingId: string
  currentStatus: string
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
  { value: "confirmed", label: "Confirmed", icon: Check, color: "text-green-600" },
  { value: "completed", label: "Completed", icon: CheckCircle, color: "text-blue-600" },
  { value: "cancelled", label: "Cancelled", icon: X, color: "text-red-600" },
]

export function UpdateBookingStatus({ bookingId, currentStatus }: UpdateBookingStatusProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)

    if (error) {
      alert("Error updating status: " + error.message)
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {loading ? "Updating..." : "Update"}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={option.value === currentStatus}
            className="flex items-center gap-2"
          >
            <option.icon className={`h-4 w-4 ${option.color}`} />
            {option.label}
            {option.value === currentStatus && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
