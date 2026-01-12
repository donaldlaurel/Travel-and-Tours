"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, ShieldOff } from "lucide-react"

interface ToggleAdminRoleProps {
  userId: string
  currentRole: string
}

export function ToggleAdminRole({ userId, currentRole }: ToggleAdminRoleProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    const newRole = currentRole === "admin" ? "user" : "admin"

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (error) {
      alert("Error updating role: " + error.message)
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
  }

  const isAdmin = currentRole === "admin"

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className={isAdmin ? "text-destructive" : "text-primary"}>
          {isAdmin ? <ShieldOff className="mr-1 h-4 w-4" /> : <Shield className="mr-1 h-4 w-4" />}
          {isAdmin ? "Remove Admin" : "Make Admin"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isAdmin ? "Remove Admin Role" : "Grant Admin Role"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isAdmin
              ? "Are you sure you want to remove admin privileges from this user? They will no longer be able to access the admin dashboard."
              : "Are you sure you want to grant admin privileges to this user? They will be able to manage hotels, bookings, and other users."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            disabled={loading}
            className={isAdmin ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {loading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
