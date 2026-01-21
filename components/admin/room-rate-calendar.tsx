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

interface RoomRateCalendarProps {
  roomTypeId: string
  basePrice: number
  onRatesChange?: (rates: RoomRate[]) => void
}

export function RoomRateCalendar({ roomTypeId, basePrice, onRatesChange }: RoomRateCalendarProps) {
  const [startMonth, setStartMonth] = useState(new Date())
  const [rates, setRates] = useState<Record<string, RoomRate>>({})
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
            const price = getRateForDate(date)
            const availability = getAvailabilityForDate(date)
            const isSelected = isDateSelected(date)
            const hasCustomRate = rates[format(date, "yyyy-MM-dd")]

            return (
              <div
                key={date.toISOString()}
                onClick={(e) => handleDateClick(date, e)}
                className={`p-1 border-b border-r min-h-[60px] cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/20 ring-2 ring-primary ring-inset"
                    : hasCustomRate
                    ? "bg-blue-50"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="text-xs font-medium">{format(date, "d")}</div>
                <div className={`text-[10px] mt-0.5 ${hasCustomRate ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  ₱{price.toLocaleString()}
                </div>
                {availability !== null && (
                  <div className="text-[10px] text-muted-foreground">{availability}r</div>
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
          Daily Room Rates
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" disabled={selectedDates.length === 0}>
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
              <Button type="button" onClick={handleBulkUpdate} disabled={loading} className="w-full">
                {loading ? "Saving..." : "Apply to Selected Dates"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
        <span><span className="inline-block w-3 h-3 bg-blue-50 border mr-1"></span> Custom rate</span>
        <span><span className="inline-block w-3 h-3 bg-primary/20 border mr-1"></span> Selected</span>
      </div>
    </div>
  )
}
