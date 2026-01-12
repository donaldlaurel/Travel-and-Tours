"use client"

import { useState, useEffect, useRef } from "react"
import { SearchForm } from "@/components/search-form"
import { cn } from "@/lib/utils"

export function StickySearch() {
  const [isSticky, setIsSticky] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible (scrolled past), make search sticky
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }, // Account for header height
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Sentinel element - when this scrolls out of view, search becomes sticky */}
      <div ref={sentinelRef} className="absolute bottom-0 left-0 right-0 h-1" />

      {/* Original search form position */}
      <div className={cn("max-w-5xl mx-auto w-full transition-opacity", isSticky && "opacity-0")}>
        <SearchForm variant="hero" />
      </div>

      {/* Sticky search bar */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-300",
          isSticky
            ? "top-[72px] opacity-100 translate-y-0"
            : "top-[72px] opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <div className="bg-background/95 backdrop-blur-md border-b shadow-md">
          <div className="container mx-auto px-4 py-3">
            <SearchForm variant="compact" />
          </div>
        </div>
      </div>
    </>
  )
}
