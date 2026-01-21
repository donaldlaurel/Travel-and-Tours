import { AvailabilityManager } from "@/components/admin/availability-manager"

export const metadata = {
  title: "Availability Management - Admin Dashboard",
  description: "Manage hotel and room availability blocks",
}

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Availability Management</h2>
        <p className="text-muted-foreground">
          Block date ranges for maintenance, renovations, seasonal closures, or other reasons.
        </p>
      </div>

      <AvailabilityManager />
    </div>
  )
}
