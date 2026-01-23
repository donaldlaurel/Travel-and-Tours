"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { format } from "date-fns"

interface Surcharge {
  id: string
  room_type_id: string
  surcharge_name?: string
  name?: string
  surcharge_price?: number
  price_per_night?: number
  minimum_nights: number
  start_date?: string
  end_date?: string
  created_at: string
}

interface SurchargesManagerProps {
  roomTypeId: string
  refreshTrigger?: number
}

export function SurchargesManager({ roomTypeId, refreshTrigger }: SurchargesManagerProps) {
  const [surcharges, setSurcharges] = useState<Surcharge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSurcharges = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("room_surcharges")
        .select("*")
        .eq("room_type_id", roomTypeId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSurcharges(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load surcharges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurcharges()
  }, [roomTypeId, refreshTrigger])

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
          No surcharges added yet. Select dates on the calendar and use "Surcharge Dates" to add one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell className="font-medium">{surcharge.surcharge_name || surcharge.name}</TableCell>
                <TableCell>₱{Number(surcharge.surcharge_price || surcharge.price_per_night).toLocaleString()}</TableCell>
                <TableCell>{surcharge.minimum_nights} night{surcharge.minimum_nights !== 1 ? 's' : ''}</TableCell>
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
