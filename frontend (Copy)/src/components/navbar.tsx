"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <header className="flex h-16 max-w-7xl mx-auto items-center justify-between border-b bg-background mb-5">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        Devnovate
      </Link>

      {/* Desktop Links */}
      <nav className="hidden items-center gap-4 md:flex">
        <Link to="/about" className="text-sm font-medium hover:underline">
          About
        </Link>
        <Link to="/pricing" className="text-sm font-medium hover:underline">
          Pricing
        </Link>
        <Link to="/contact" className="text-sm font-medium hover:underline">
          Contact
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="hidden items-center gap-2 md:flex">
        <Button variant="outline" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-6">
              <Link to="/about" className="text-sm font-medium">
                About
              </Link>
              <Link to="/pricing" className="text-sm font-medium">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-medium">
                Contact
              </Link>
              <Button variant="outline" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
