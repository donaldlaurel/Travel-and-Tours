"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

function BookingsFilterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const statusFilter = searchParams.get("status") || "all"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSearch = formData.get("search") as string
    const newStatus = formData.get("status") as string
    router.push(`/admin/bookings?search=${newSearch}&status=${newStatus}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="search" placeholder="Search by hotel..." defaultValue={search} className="pl-9" />
      </div>
      <Select name="status" defaultValue={statusFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Filter</Button>
    </form>
  )
}

export function BookingsFilter() {
  return (
    <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded" />}>
      <BookingsFilterContent />
    </Suspense>
  )
}
