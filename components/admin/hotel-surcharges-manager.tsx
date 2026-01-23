"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"

interface HotelSurcharge {
  id: string
  room_type_id: string
  room_type_name: string
  surcharge_name: string
  surcharge_price: number
  minimum_nights: number
  start_date: string
  end_date: string
  created_at: string
}

interface HotelSurchargesManagerProps {
  hotelId: string
}

export function HotelSurchargesManager({ hotelId }: HotelSurchargesManagerProps) {
  const [surcharges, setSurcharges] = useState<HotelSurcharge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSurcharges = async () => {
    try {
      const supabase = createClient()
      
      // Query room_surcharges joined with room_types to get the room type name
      const { data, error } = await supabase
        .from("room_surcharges")
        .select(`
          id,
          room_type_id,
          surcharge_name,
          surcharge_price,
          minimum_nights,
          start_date,
          end_date,
          created_at,
          room_types!inner(name, hotel_id)
        `)
        .filter("room_types.hotel_id", "eq", hotelId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform the data to flatten the room_types relationship
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        room_type_id: item.room_type_id,
        room_type_name: item.room_types?.name || "Unknown",
        surcharge_name: item.surcharge_name,
        surcharge_price: item.surcharge_price,
        minimum_nights: item.minimum_nights,
        start_date: item.start_date,
        end_date: item.end_date,
        created_at: item.created_at,
      })) || []

      setSurcharges(transformedData)
    } catch (err) {
      console.error("[v0] Error loading surcharges:", err)
      setError(err instanceof Error ? err.message : "Failed to load surcharges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurcharges()
  }, [hotelId])

  const handleDeleteSurcharge = async (surchargeId: string) => {
    if (!confirm("Are you sure you want to delete this surcharge?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("room_surcharges")
        .delete()
        .eq("id", surchargeId)

      if (error) throw error
      await fetchSurcharges()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete surcharge")
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading surcharges...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {surcharges.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          No surcharges added yet. Add surcharges to room types in the Availability & Pricing section.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price per Night</TableHead>
              <TableHead>Minimum Nights</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surcharges.map((surcharge) => (
              <TableRow key={surcharge.id}>
                <TableCell className="font-medium">{surcharge.room_type_name}</TableCell>
                <TableCell>{surcharge.surcharge_name}</TableCell>
                <TableCell>₱{Number(surcharge.surcharge_price).toLocaleString()}</TableCell>
                <TableCell>{surcharge.minimum_nights} night{surcharge.minimum_nights !== 1 ? "s" : ""}</TableCell>
                <TableCell className="text-sm">
                  {surcharge.start_date && surcharge.end_date ? (
                    <span className="text-muted-foreground">
                      {format(new Date(surcharge.start_date), "MMM d, yyyy")} - {format(new Date(surcharge.end_date), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Always</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSurcharge(surcharge.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
