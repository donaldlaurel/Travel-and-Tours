import type React from "react"

export const metadata = {
  title: "Admin - TMJ Travel and Tours",
  description: "Admin panel",
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
