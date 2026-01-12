import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderAuth } from "@/components/header-auth"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/image.png"
            alt="TMJ Travel and Tours"
            width={200}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/hotels"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hotels
          </Link>
          <Link
            href="/deals"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Deals
          </Link>
          <Link
            href="/destinations"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Destinations
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/favorites">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Link>
          </Button>
          <HeaderAuth />
        </div>
      </div>
    </header>
  )
}
