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
}

export function SurchargesManager({ roomTypeId }: SurchargesManagerProps) {
  const [surcharges, setSurcharges] = useState<Surcharge[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    price_per_night: "",
    minimum_nights: "1",
  })

  useEffect(() => {
    fetchSurcharges()
  }, [roomTypeId])

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

  const handleAddSurcharge = async () => {
    if (!formData.name || !formData.price_per_night) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("room_surcharges")
        .insert({
          room_type_id: roomTypeId,
          name: formData.name,
          price_per_night: Number.parseFloat(formData.price_per_night),
          minimum_nights: Number.parseInt(formData.minimum_nights) || 1,
        })

      if (error) throw error

      setFormData({
        name: "",
        price_per_night: "",
        minimum_nights: "1",
      })
      setDialogOpen(false)
      await fetchSurcharges()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add surcharge")
    } finally {
      setSaving(false)
    }
  }

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Surcharge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Surcharge</DialogTitle>
            <DialogDescription>
              Create a new surcharge for this room type
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="surcharge_name">Surcharge Name *</Label>
              <Input
                id="surcharge_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Resort Fee, Cleaning Fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surcharge_price">Price per Night (₱) *</Label>
              <Input
                id="surcharge_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                placeholder="e.g., 500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surcharge_min_nights">Minimum Nights</Label>
              <Input
                id="surcharge_min_nights"
                type="number"
                min="1"
                value={formData.minimum_nights}
                onChange={(e) => setFormData({ ...formData, minimum_nights: e.target.value })}
                placeholder="e.g., 1"
              />
              <p className="text-xs text-muted-foreground">
                Surcharge applies only to bookings with at least this many nights
              </p>
            </div>

            <Button
              onClick={handleAddSurcharge}
              disabled={saving}
              className="w-full"
            >
              {saving ? "Adding..." : "Add Surcharge"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {surcharges.length === 0 ? (
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
          No surcharges added yet. Click "Add Surcharge" to create one.
        </div>
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
