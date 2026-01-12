"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function UsersFilterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSearch = formData.get("search") as string
    router.push(`/admin/users?search=${newSearch}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="search" placeholder="Search users..." defaultValue={search} className="pl-9" />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}

export function UsersFilter() {
  return (
    <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded" />}>
      <UsersFilterContent />
    </Suspense>
  )
}
