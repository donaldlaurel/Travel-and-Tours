"use client"

import React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns"

interface RoomRate {
  id?: string
  room_type_id: string
  date: string
  price: number
  available_rooms: number | null
}

interface AvailabilityBlock {
  id: string
  start_date: string
  end_date: string
  block_type: string
  reason: string | null
}

interface RoomRateCalendarProps {
  roomTypeId: string
  hotelId?: string
  onRatesChange?: (rates: RoomRate[]) => void
}

export function RoomRateCalendar({ roomTypeId, hotelId, onRatesChange }: RoomRateCalendarProps) {
  const [startMonth, setStartMonth] = useState(new Date())
  const [rates, setRates] = useState<Record<string, RoomRate>>({})
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [blockInfo, setBlockInfo] = useState<Record<string, AvailabilityBlock>>({})
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [bulkPrice, setBulkPrice] = useState("")
  const [bulkAvailability, setBulkAvailability] = useState("")
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Generate 3 months array
  const months = [startMonth, addMonths(startMonth, 1), addMonths(startMonth, 2)]

  useEffect(() => {
    if (roomTypeId) {
      loadRates()
      loadBlocks(roomTypeId, setBlockedDates, setBlockInfo)
    }
  }, [roomTypeId, startMonth])

  const loadRates = async () => {
    const supabase = createClient()
    const start = startOfMonth(startMonth)
    const end = endOfMonth(addMonths(startMonth, 2))

    const { data } = await supabase
      .from("room_rates")
      .select("*")
      .eq("room_type_id", roomTypeId)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))

    if (data) {
      const ratesMap: Record<string, RoomRate> = {}
      data.forEach((rate) => {
        ratesMap[rate.date] = rate
      })
      setRates(ratesMap)
    }
  }

  const loadBlocks = async () => {
    const supabase = createClient()
    const start = startOfMonth(startMonth)
    const end = endOfMonth(addMonths(startMonth, 2))
    const startStr = format(start, "yyyy-MM-dd")
    const endStr = format(end, "yyyy-MM-dd")

    // Build query for blocks affecting this room or its hotel
    let query = supabase
      .from("availability_blocks")
      .select("*")
      .lte("start_date", endStr)
      .gte("end_date", startStr)

    // Filter by room_type_id or hotel_id
    if (hotelId) {
      query = query.or(`room_type_id.eq.${roomTypeId},and(hotel_id.eq.${hotelId},room_type_id.is.null)`)
    } else {
      query = query.eq("room_type_id", roomTypeId)
    }

    const { data: blocks } = await query

    if (blocks) {
      const blocked = new Set<string>()
      const info: Record<string, AvailabilityBlock> = {}
      
      blocks.forEach((block) => {
        // Generate all dates in the block range that overlap with our view
        const blockStart = new Date(block.start_date)
        const blockEnd = new Date(block.end_date)
        const viewStart = start > blockStart ? start : blockStart
        const viewEnd = end < blockEnd ? end : blockEnd
        
        const datesInRange = eachDayOfInterval({ start: viewStart, end: viewEnd })
        datesInRange.forEach((date) => {
          const dateStr = format(date, "yyyy-MM-dd")
          blocked.add(dateStr)
          info[dateStr] = block
        })
      })
      
      setBlockedDates(blocked)
      setBlockInfo(info)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const getRateForDate = (date: Date): number | null => {
    const dateStr = format(date, "yyyy-MM-dd")
    return rates[dateStr]?.price ?? null
  }

  const getAvailabilityForDate = (date: Date): number | null => {
    const dateStr = format(date, "yyyy-MM-dd")
    return rates[dateStr]?.available_rooms ?? null
  }

  const hasRateSet = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd")
    return !!rates[dateStr]
  }

  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dateStr = format(date, "yyyy-MM-dd")
    if (selectedDates.some(d => format(d, "yyyy-MM-dd") === dateStr)) {
      setSelectedDates(selectedDates.filter(d => format(d, "yyyy-MM-dd") !== dateStr))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  const handleBulkUpdate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedDates.length === 0 || !bulkPrice) return
    setLoading(true)

    const supabase = createClient()
    const updates: RoomRate[] = selectedDates.map(date => ({
      room_type_id: roomTypeId,
      date: format(date, "yyyy-MM-dd"),
      price: parseFloat(bulkPrice),
      available_rooms: bulkAvailability ? parseInt(bulkAvailability) : null,
    }))

    // Upsert rates
    const { error } = await supabase
      .from("room_rates")
      .upsert(updates, { onConflict: "room_type_id,date" })

    if (!error) {
      await loadRates()
      setSelectedDates([])
      setBulkPrice("")
      setBulkAvailability("")
      setDialogOpen(false)
      onRatesChange?.(Object.values(rates))
    }

    setLoading(false)
  }

  const handleCloseDates = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedDates.length === 0) return
    setLoading(true)

    const supabase = createClient()
    
    // Delete rates for selected dates (making them closed)
    const datesToClose = selectedDates.map(date => format(date, "yyyy-MM-dd"))
    
    const { error } = await supabase
      .from("room_rates")
      .delete()
      .eq("room_type_id", roomTypeId)
      .in("date", datesToClose)

    if (!error) {
      await loadRates()
      setSelectedDates([])
      onRatesChange?.(Object.values(rates))
    }

    setLoading(false)
  }

  const selectAllDays = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const allDays = months.flatMap(month => getDaysInMonth(month))
    setSelectedDates(allDays)
  }

  const selectWeekends = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const allDays = months.flatMap(month => getDaysInMonth(month))
    const weekends = allDays.filter(d => d.getDay() === 0 || d.getDay() === 6)
    setSelectedDates(weekends)
  }

  const selectWeekdays = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const allDays = months.flatMap(month => getDaysInMonth(month))
    const weekdays = allDays.filter(d => d.getDay() !== 0 && d.getDay() !== 6)
    setSelectedDates(weekdays)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedDates([])
  }

  const handlePrevMonths = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStartMonth(subMonths(startMonth, 3))
  }

  const handleNextMonths = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStartMonth(addMonths(startMonth, 3))
  }

  const renderMonth = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate)
    const firstDayOfWeek = startOfMonth(monthDate).getDay()

    return (
      <div key={monthDate.toISOString()} className="border rounded-lg overflow-hidden">
        {/* Month Header */}
        <div className="bg-muted p-3 text-center font-semibold border-b">
          {format(monthDate, "MMMM yyyy")}
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-muted/50">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="p-1 text-center text-xs font-medium border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before first day of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1 border-b border-r bg-muted/20 min-h-[60px]" />
          ))}

          {/* Day cells */}
          {days.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd")
            const price = getRateForDate(date)
            const availability = getAvailabilityForDate(date)
            const isSelected = isDateSelected(date)
            const hasRate = hasRateSet(date)
            const isBlocked = blockedDates.has(dateStr)
            const block = blockInfo[dateStr]
            // Dates without a rate are considered closed
            const isClosed = !hasRate && !isBlocked

            return (
              <div
                key={date.toISOString()}
                onClick={(e) => handleDateClick(date, e)}
                title={isBlocked ? `Blocked: ${block?.block_type}${block?.reason ? ` - ${block.reason}` : ''}` : isClosed ? "Closed - No rate set" : undefined}
                className={`p-1 border-b border-r min-h-[60px] transition-colors relative overflow-hidden cursor-pointer ${
                  isBlocked
                    ? "bg-red-50"
                    : isSelected
                    ? "bg-primary/20 ring-2 ring-primary ring-inset"
                    : hasRate
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {/* Diagonal strikethrough for blocked or closed dates */}
                {(isBlocked || isClosed) && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 4px,
                        ${isBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(156, 163, 175, 0.4)'} 4px,
                        ${isBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(156, 163, 175, 0.4)'} 5px
                      )`
                    }}
                  />
                )}
                <div className={`text-xs font-medium relative z-10 ${(isBlocked || isClosed) ? "text-gray-400" : ""}`}>
                  {format(date, "d")}
                </div>
                {hasRate && price !== null ? (
                  <div className="text-[10px] mt-0.5 relative z-10 text-green-700 font-medium">
                    ₱{price.toLocaleString()}
                  </div>
                ) : (
                  <div className="text-[10px] mt-0.5 relative z-10 text-gray-400">
                    {isBlocked ? "Blocked" : "Closed"}
                  </div>
                )}
                {availability !== null && hasRate && (
                  <div className="text-[10px] text-muted-foreground relative z-10">{availability}r</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Room Availability Calendar
        </h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            disabled={selectedDates.length === 0 || loading}
            onClick={handleCloseDates}
          >
            Close Dates ({selectedDates.length})
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" disabled={selectedDates.length === 0}>
                Open Dates ({selectedDates.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Open Dates for Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Set the price to make these {selectedDates.length} dates available for booking.
                </p>
                <div className="space-y-2">
                  <Label>Price per Night (₱) *</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter price"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Rooms (optional)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Leave empty to use room default"
                    value={bulkAvailability}
                    onChange={(e) => setBulkAvailability(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleBulkUpdate} 
                  disabled={loading || !bulkPrice} 
                  className="w-full"
                >
                  {loading ? "Saving..." : "Open Selected Dates"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Selection Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={selectAllDays}>
          Select All
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={selectWeekends}>
          Weekends
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={selectWeekdays}>
          Weekdays
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
          Clear
        </Button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" onClick={handlePrevMonths}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {format(months[0], "MMM yyyy")} - {format(months[2], "MMM yyyy")}
        </span>
        <Button type="button" variant="ghost" size="icon" onClick={handleNextMonths}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 3 Month Calendar Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {months.map(month => renderMonth(month))}
      </div>

      <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
        <span><span className="inline-block w-3 h-3 bg-green-50 border border-green-200 mr-1"></span> Available</span>
        <span><span className="inline-block w-3 h-3 bg-primary/20 border mr-1"></span> Selected</span>
        <span>
          <span 
            className="inline-block w-3 h-3 border mr-1"
            style={{
              background: `repeating-linear-gradient(
                -45deg,
                #f3f4f6,
                #f3f4f6 2px,
                rgba(156, 163, 175, 0.4) 2px,
                rgba(156, 163, 175, 0.4) 3px
              )`
            }}
          ></span> Closed
        </span>
        <span>
          <span 
            className="inline-block w-3 h-3 border mr-1"
            style={{
              background: `repeating-linear-gradient(
                -45deg,
                #fef2f2,
                #fef2f2 2px,
                rgba(239, 68, 68, 0.3) 2px,
                rgba(239, 68, 68, 0.3) 3px
              )`
            }}
          ></span> Blocked
        </span>
      </div>
    </div>
  )
}
