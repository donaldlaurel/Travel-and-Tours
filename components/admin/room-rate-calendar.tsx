"use client"

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
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns"

interface RoomRate {
  id?: string
  room_type_id: string
  date: string
  price: number
  available_rooms: number | null
}

interface RoomRateCalendarProps {
  roomTypeId: string
  basePrice: number
  onRatesChange?: (rates: RoomRate[]) => void
}

export function RoomRateCalendar({ roomTypeId, basePrice, onRatesChange }: RoomRateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [rates, setRates] = useState<Record<string, RoomRate>>({})
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [bulkPrice, setBulkPrice] = useState("")
  const [bulkAvailability, setBulkAvailability] = useState("")
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (roomTypeId) {
      loadRates()
    }
  }, [roomTypeId, currentMonth])

  const loadRates = async () => {
    const supabase = createClient()
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(addMonths(currentMonth, 2))

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

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const getRateForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    return rates[dateStr]?.price || basePrice
  }

  const getAvailabilityForDate = (date: Date): number | null => {
    const dateStr = format(date, "yyyy-MM-dd")
    return rates[dateStr]?.available_rooms ?? null
  }

  const handleDateClick = (date: Date) => {
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

  const handleBulkUpdate = async () => {
    if (selectedDates.length === 0) return
    setLoading(true)

    const supabase = createClient()
    const updates: RoomRate[] = selectedDates.map(date => ({
      room_type_id: roomTypeId,
      date: format(date, "yyyy-MM-dd"),
      price: bulkPrice ? parseFloat(bulkPrice) : basePrice,
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

  const selectAllDaysInMonth = () => {
    const days = getDaysInMonth(currentMonth)
    setSelectedDates(days)
  }

  const selectWeekends = () => {
    const days = getDaysInMonth(currentMonth)
    const weekends = days.filter(d => d.getDay() === 0 || d.getDay() === 6)
    setSelectedDates(weekends)
  }

  const selectWeekdays = () => {
    const days = getDaysInMonth(currentMonth)
    const weekdays = days.filter(d => d.getDay() !== 0 && d.getDay() !== 6)
    setSelectedDates(weekdays)
  }

  const clearSelection = () => {
    setSelectedDates([])
  }

  const days = getDaysInMonth(currentMonth)
  const firstDayOfWeek = startOfMonth(currentMonth).getDay()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Daily Room Rates
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={selectedDates.length === 0}>
              Set Rates ({selectedDates.length} selected)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Rates for Selected Dates</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Price per Night (₱)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={basePrice.toString()}
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Available Rooms (optional)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Leave empty to use default"
                  value={bulkAvailability}
                  onChange={(e) => setBulkAvailability(e.target.value)}
                />
              </div>
              <Button onClick={handleBulkUpdate} disabled={loading} className="w-full">
                {loading ? "Saving..." : "Apply to Selected Dates"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Selection Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={selectAllDaysInMonth}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={selectWeekends}>
          Weekends
        </Button>
        <Button variant="outline" size="sm" onClick={selectWeekdays}>
          Weekdays
        </Button>
        <Button variant="outline" size="sm" onClick={clearSelection}>
          Clear
        </Button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h4 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h4>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-muted">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium border-b">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before first day of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 border-b border-r bg-muted/30 min-h-[80px]" />
          ))}

          {/* Day cells */}
          {days.map((date) => {
            const price = getRateForDate(date)
            const availability = getAvailabilityForDate(date)
            const isSelected = isDateSelected(date)
            const hasCustomRate = rates[format(date, "yyyy-MM-dd")]

            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`p-2 border-b border-r min-h-[80px] cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/20 ring-2 ring-primary ring-inset"
                    : hasCustomRate
                    ? "bg-blue-50"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="text-sm font-medium">{format(date, "d")}</div>
                <div className={`text-xs mt-1 ${hasCustomRate ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  ₱{price.toLocaleString()}
                </div>
                {availability !== null && (
                  <div className="text-xs text-muted-foreground">{availability} rooms</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="inline-block w-3 h-3 bg-blue-50 border mr-1"></span> Custom rate set
        <span className="inline-block w-3 h-3 bg-primary/20 border ml-4 mr-1"></span> Selected
      </div>
    </div>
  )
}
