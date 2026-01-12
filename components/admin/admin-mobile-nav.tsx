"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Hotel, CalendarCheck, Users, Star, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hotels", href: "/admin/hotels", icon: Hotel },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin">
          <Image src="/images/image.png" alt="TMJ Travel and Tours" width={150} height={38} className="h-8 w-auto" />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
