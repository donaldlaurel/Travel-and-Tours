import type React from "react"
import { requireAdmin } from "@/lib/admin"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Admin Dashboard - TMJ Travel and Tours",
  description: "Manage hotels, bookings, and users",
}

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
