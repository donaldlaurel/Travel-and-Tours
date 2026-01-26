"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPin, Users, Search, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface SearchFormProps {
  variant?: "hero" | "compact"
  initialCity?: string
  initialCheckIn?: Date
  initialCheckOut?: Date
  initialRooms?: number
  initialAdults?: number
  initialChildren?: number
  initialChildrenAges?: number[]
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GuestSelectorProps {
  rooms: number
  adults: number
  children: number
  childrenAges: number[]
  onRoomsChange: (value: number) => void
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onChildAgeChange: (index: number, age: number) => void
}

function GuestSelector({
  rooms,
  adults,
  children,
  childrenAges,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
  onChildAgeChange,
}: GuestSelectorProps) {
  const CounterRow = ({
    label,
    description,
    value,
    onChange,
    min = 0,
    max = 10,
  }: {
    label: string
    description?: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="w-72 p-4">
      <CounterRow label="Room" value={rooms} onChange={onRoomsChange} min={1} max={8} />
      <div className="border-t" />
      <CounterRow label="Adults" description="Ages 18 or above" value={adults} onChange={onAdultsChange} min={1} max={16} />
      <div className="border-t" />
      <CounterRow
        label="Children"
        description="Ages 0-17"
        value={children}
        onChange={onChildrenChange}
        min={0}
        max={8}
      />
      
      {/* Children Age Selectors */}
      {children > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            For accurate room pricing, make sure to enter your children&apos;s correct ages.
          </p>
          <div className="space-y-3">
            {Array.from({ length: children }).map((_, index) => (
              <Select
                key={index}
                value={childrenAges[index] !== undefined && childrenAges[index] >= 0 ? childrenAges[index].toString() : undefined}
                onValueChange={(value) => onChildAgeChange(index, parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Age of Child ${index + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 18 }).map((_, age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age === 0 ? "Under 1 year old" : `${age} ${age === 1 ? "year old" : "years old"}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface CustomCalendarProps {
  checkIn: Date | undefined
  checkOut: Date | undefined
  onSelect: (checkIn: Date | undefined, checkOut: Date | undefined) => void
}

function CustomCalendar({ checkIn, checkOut, onSelect }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)
  const [activeTab, setActiveTab] = useState<"calendar" | "flexible">("calendar")

  const nextMonth = addMonths(currentMonth, 1)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return

    if (!selectingCheckOut || !checkIn) {
      // Selecting check-in date
      onSelect(date, undefined)
      setSelectingCheckOut(true)
    } else {
      // Selecting check-out date
      if (isBefore(date, checkIn)) {
        // If selected date is before check-in, make it the new check-in
        onSelect(date, undefined)
      } else {
        onSelect(checkIn, date)
        setSelectingCheckOut(false)
      }
    }
  }

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

    return (
      <div className="w-[280px]">
        <h3 className="text-center font-semibold mb-4">{format(month, "MMMM yyyy")}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, month)
            const isPast = isBefore(day, today)
            const isCheckIn = checkIn && isSameDay(day, checkIn)
            const isCheckOut = checkOut && isSameDay(day, checkOut)
            const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut)
            const isDisabled = isPast || !isCurrentMonth

            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleDateClick(day)}
                disabled={isDisabled}
                className={cn(
                  "h-9 w-9 rounded-full text-sm relative flex items-center justify-center transition-colors",
                  !isCurrentMonth && "invisible",
                  isCurrentMonth && isPast && "text-muted-foreground/40 cursor-not-allowed",
                  isCurrentMonth && !isPast && "hover:bg-primary/10 cursor-pointer",
                  (isCheckIn || isCheckOut) && "bg-primary text-primary-foreground hover:bg-primary",
                  isInRange && "bg-primary/10 rounded-none",
                  isCheckIn && isInRange && "rounded-l-full",
                  isCheckOut && isInRange && "rounded-r-full",
                )}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("calendar")}
          className={cn(
            "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "calendar"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab("flexible")}
          className={cn(
            "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "flexible"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          I&apos;m flexible
        </button>
      </div>

      {activeTab === "calendar" ? (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              disabled={isSameMonth(currentMonth, new Date())}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dual Month Calendar */}
          <div className="flex gap-8">
            {renderMonth(currentMonth)}
            {renderMonth(nextMonth)}
          </div>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t">
            Approximate prices for one night stay in a 3-star property for the searched location
          </p>
        </>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>Flexible dates feature coming soon</p>
        </div>
      )}
    </div>
  )
}

export function SearchForm({
  variant = "hero",
  initialCity = "",
  initialCheckIn,
  initialCheckOut,
  initialRooms = 1,
  initialAdults = 2,
  initialChildren = 0,
  initialChildrenAges = [],
}: SearchFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [city, setCity] = useState(initialCity)
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn)
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut)
  const [rooms, setRooms] = useState(initialRooms)
  const [adults, setAdults] = useState(initialAdults)
  const [children, setChildren] = useState(initialChildren)
  const [childrenAges, setChildrenAges] = useState<number[]>(initialChildrenAges)

  const handleChildrenChange = (value: number) => {
    setChildren(value)
    // Adjust childrenAges array when children count changes
    if (value > childrenAges.length) {
      // Add more ages with undefined/default
      setChildrenAges([...childrenAges, ...Array(value - childrenAges.length).fill(-1)])
    } else if (value < childrenAges.length) {
      // Remove extra ages
      setChildrenAges(childrenAges.slice(0, value))
    }
  }

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges]
    newAges[index] = age
    setChildrenAges(newAges)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"))
    params.set("rooms", rooms.toString())
    params.set("adults", adults.toString())
    params.set("children", children.toString())
    if (children > 0) {
      // Include all children ages, using 0 as default for unselected ages
      const validAges = childrenAges.map(age => age >= 0 ? age : 0)
      params.set("childrenAges", validAges.join(","))
    }

    router.push(`/hotels?${params.toString()}`)
  }

  const getGuestSummary = () => {
    const parts = []
    parts.push(`${rooms} ${rooms === 1 ? "Room" : "Rooms"}`)
    parts.push(`${adults} ${adults === 1 ? "Adult" : "Adults"}`)
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? "Child" : "Children"}`)
    }
    return parts.join(", ")
  }

  const isHero = variant === "hero"

  return (
    <div className={cn("bg-card rounded-xl shadow-lg border", isHero ? "p-6" : "p-4")}>
      <div className={cn("flex flex-col gap-4", isHero ? "lg:flex-row lg:items-end" : "md:flex-row md:items-end")}>
        {/* Destination */}
        <div className={cn("flex-1", isHero && "lg:min-w-[200px]")}>
          <label className="text-sm font-medium mb-2 block text-muted-foreground">Search location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('home.search_location')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className={cn("flex-1", isHero && "lg:min-w-[320px]")}>
          <label className="text-sm font-medium mb-2 block text-muted-foreground">{t('home.check_in')} / {t('home.check_out')}</label>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex">
                {/* Check-in Box */}
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal h-12 rounded-r-none border-r-0",
                    !checkIn && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    {checkIn ? (
                      <>
                        <span className="text-sm font-medium">{format(checkIn, "d MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{format(checkIn, "EEEE")}</span>
                      </>
                    ) : (
                      <span>Check-in</span>
                    )}
                  </div>
                </Button>
                {/* Check-out Box */}
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal h-12 rounded-l-none",
                    !checkOut && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    {checkOut ? (
                      <>
                        <span className="text-sm font-medium">{format(checkOut, "d MMM yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{format(checkOut, "EEEE")}</span>
                      </>
                    ) : (
                      <span>Check-out</span>
                    )}
                  </div>
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CustomCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onSelect={(newCheckIn, newCheckOut) => {
                  setCheckIn(newCheckIn)
                  setCheckOut(newCheckOut)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className={cn("flex-1", isHero && "lg:min-w-[200px]")}>
          <label className="text-sm font-medium mb-2 block text-muted-foreground">Guests</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal h-12 bg-transparent">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">{getGuestSummary()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <GuestSelector
                rooms={rooms}
                adults={adults}
                children={children}
                childrenAges={childrenAges}
                onRoomsChange={setRooms}
                onAdultsChange={setAdults}
                onChildrenChange={handleChildrenChange}
                onChildAgeChange={handleChildAgeChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} size="lg" className={cn("h-12", isHero && "lg:px-8")}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  )
}
