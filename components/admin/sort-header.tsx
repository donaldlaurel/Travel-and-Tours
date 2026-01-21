"use client"

import Link from "next/link"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

interface SortHeaderProps {
  column: string
  label: string
  currentSort?: string
  currentAscending?: boolean
  searchParams: Record<string, string>
  className?: string
}

export function SortHeader({ column, label, currentSort, currentAscending, searchParams, className }: SortHeaderProps) {
  const isActive = currentSort === column
  const newAscending = isActive ? !currentAscending : true
  
  const newParams = new URLSearchParams(searchParams as Record<string, string>)
  newParams.set("sort", column)
  newParams.set("ascending", newAscending.toString())
  newParams.set("page", "1") // Reset to page 1 when sorting changes

  return (
    <th className={`pb-3 text-left font-medium ${className || ""}`}>
      <Link
        href={`?${newParams.toString()}`}
        className="inline-flex items-center gap-2 hover:text-foreground/70 transition-colors cursor-pointer"
      >
        {label}
        {isActive ? (
          currentAscending ? (
            <ArrowUp className="h-4 w-4 text-primary" />
          ) : (
            <ArrowDown className="h-4 w-4 text-primary" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Link>
    </th>
  )
}
