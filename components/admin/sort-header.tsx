"use client"

import Link from "next/link"
import { ArrowUp, ArrowDown } from "lucide-react"

interface SortHeaderProps {
  column: string
  label: string
  currentSort?: string
  currentAscending?: boolean
  searchParams: Record<string, string>
}

export function SortHeader({ column, label, currentSort, currentAscending, searchParams }: SortHeaderProps) {
  const isActive = currentSort === column
  const newAscending = isActive ? !currentAscending : true
  
  const newParams = new URLSearchParams(searchParams as Record<string, string>)
  newParams.set("sort", column)
  newParams.set("ascending", newAscending.toString())
  newParams.set("page", "1") // Reset to page 1 when sorting changes

  return (
    <th className="pb-3 text-left font-medium">
      <Link
        href={`?${newParams.toString()}`}
        className="inline-flex items-center gap-2 hover:text-foreground/70 transition-colors"
      >
        {label}
        {isActive && (
          newAscending ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        )}
      </Link>
    </th>
  )
}
