"use client"

import React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Trash2, AlertCircle, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"

type SortField = "start_date" | "end_date" | "block_type" | "created_at"
type SortDirection = "asc" | "desc"

interface AvailabilityBlock {
  id: string
  hotel_id: string | null
  room_type_id: string | null
  start_date: string
  end_date: string
  block_type: string
  reason: string | null
  created_at: string
  hotel?: { name: string }
  room_type?: { name: string }
}

interface Hotel {
  id: string
  name: string
}

interface RoomType {
  id: string
  name: string
  hotel_id: string
}

interface AvailabilityManagerProps {
  hotelId?: string
  roomTypeId?: string
}

const BLOCK_TYPES = [
  { value: "maintenance", label: "Maintenance" },
  { value: "renovation", label: "Renovation" },
  { value: "seasonal_closure", label: "Seasonal Closure" },
  { value: "private_event", label: "Private Event" },
  { value: "overbooking_protection", label: "Overbooking Protection" },
  { value: "other", label: "Other" },
]

export function AvailabilityManager({ hotelId, roomTypeId }: AvailabilityManagerProps) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sortField, setSortField] = useState<SortField>("start_date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const [formData, setFormData] = useState({
    hotel_id: hotelId || "",
    room_type_id: roomTypeId || "",
    start_date: "",
    end_date: "",
    block_type: "maintenance",
    reason: "",
  })

  useEffect(() => {
    loadData()
  }, [hotelId, roomTypeId])

  useEffect(() => {
    // Load room types when hotel changes
    if (formData.hotel_id && !roomTypeId) {
      loadRoomTypes(formData.hotel_id)
    }
  }, [formData.hotel_id, roomTypeId])

  const loadData = async () => {
    const supabase = createClient()
    setLoading(true)

    // Load hotels if not filtering by specific hotel
    if (!hotelId) {
      const { data: hotelsData } = await supabase
        .from("hotels")
        .select("id, name")
        .order("name")
      setHotels(hotelsData || [])
    }

    // Load availability blocks
    let query = supabase
      .from("availability_blocks")
      .select(`
        *,
        hotel:hotels(name),
        room_type:room_types(name)
      `)
      .order("start_date", { ascending: true })

    if (hotelId) {
      query = query.eq("hotel_id", hotelId)
    }
    if (roomTypeId) {
      query = query.eq("room_type_id", roomTypeId)
    }

    const { data: blocksData } = await query
    setBlocks(blocksData || [])

    // Load room types if filtering by hotel
    if (hotelId) {
      loadRoomTypes(hotelId)
    }

    setLoading(false)
  }

  const loadRoomTypes = async (selectedHotelId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("room_types")
      .select("id, name, hotel_id")
      .eq("hotel_id", selectedHotelId)
      .order("name")
    setRoomTypes(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()

    // Handle "all" value for room_type_id
    const roomTypeValue = formData.room_type_id === "all" ? null : formData.room_type_id || roomTypeId || null

    const blockData = {
      hotel_id: formData.hotel_id || hotelId || null,
      room_type_id: roomTypeValue,
      start_date: formData.start_date,
      end_date: formData.end_date,
      block_type: formData.block_type,
      reason: formData.reason || null,
    }

    console.log("[v0] Submitting block data:", blockData)

    const { data, error } = await supabase.from("availability_blocks").insert(blockData).select()

    console.log("[v0] Insert result - data:", data, "error:", error)

    if (error) {
      console.error("[v0] Error creating block:", error.message, error.details, error.hint)
      alert(`Error creating block: ${error.message}`)
    } else {
      setDialogOpen(false)
      setFormData({
        hotel_id: hotelId || "",
        room_type_id: roomTypeId || "",
        start_date: "",
        end_date: "",
        block_type: "maintenance",
        reason: "",
      })
      loadData()
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability block?")) return

    const supabase = createClient()
    const { error } = await supabase.from("availability_blocks").delete().eq("id", id)

    if (!error) {
      loadData()
    }
  }

  const getBlockTypeLabel = (type: string) => {
    return BLOCK_TYPES.find((t) => t.value === type)?.label || type
  }

  const getBlockTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "maintenance":
        return "secondary"
      case "renovation":
        return "default"
      case "seasonal_closure":
        return "outline"
      case "private_event":
        return "default"
      case "overbooking_protection":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const isBlockActive = (block: AvailabilityBlock) => {
    const today = new Date()
    const start = new Date(block.start_date)
    const end = new Date(block.end_date)
    return today >= start && today <= end
  }

  const isBlockUpcoming = (block: AvailabilityBlock) => {
    const today = new Date()
    const start = new Date(block.start_date)
    return today < start
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedBlocks = [...blocks].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "start_date":
        comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        break
      case "end_date":
        comparison = new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        break
      case "block_type":
        comparison = a.block_type.localeCompare(b.block_type)
        break
      case "created_at":
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`h-3 w-3 ${sortField === field ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </TableHead>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Availability Blocks
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Availability Block</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Hotel Selection (if not pre-filtered) */}
              {!hotelId && (
                <div className="space-y-2">
                  <Label>Hotel *</Label>
                  <Select
                    value={formData.hotel_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, hotel_id: value, room_type_id: "" })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel (or leave empty for all)" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotels.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Room Type Selection */}
              {!roomTypeId && (formData.hotel_id || hotelId) && (
                <div className="space-y-2">
                  <Label>Room Type (optional)</Label>
                  <Select
                    value={formData.room_type_id}
                    onValueChange={(value) => setFormData({ ...formData, room_type_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All rooms in hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All rooms</SelectItem>
                      {roomTypes.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    min={formData.start_date}
                    required
                  />
                </div>
              </div>

              {/* Block Type */}
              <div className="space-y-2">
                <Label>Block Type *</Label>
                <Select
                  value={formData.block_type}
                  onValueChange={(value) => setFormData({ ...formData, block_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason / Notes</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Optional notes about this block..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Creating..." : "Create Block"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-4">Loading...</p>
        ) : blocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No availability blocks set.</p>
            <p className="text-sm">Add blocks to mark dates as unavailable for booking.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {!hotelId && <TableHead>Hotel</TableHead>}
                {!roomTypeId && <TableHead>Room</TableHead>}
                <SortableHeader field="start_date">Start Date</SortableHeader>
                <SortableHeader field="end_date">End Date</SortableHeader>
                <SortableHeader field="block_type">Type</SortableHeader>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBlocks.map((block) => (
                <TableRow key={block.id}>
                  {!hotelId && (
                    <TableCell className="font-medium">
                      {block.hotel?.name || "All Hotels"}
                    </TableCell>
                  )}
                  {!roomTypeId && (
                    <TableCell>
                      {block.room_type?.name || "All Rooms"}
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(block.start_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(block.end_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBlockTypeBadgeVariant(block.block_type) as "default" | "secondary" | "destructive" | "outline"}>
                      {getBlockTypeLabel(block.block_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isBlockActive(block) ? (
                      <Badge variant="destructive">Active</Badge>
                    ) : isBlockUpcoming(block) ? (
                      <Badge variant="outline">Upcoming</Badge>
                    ) : (
                      <Badge variant="secondary">Ended</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                    {block.reason || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(block.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
