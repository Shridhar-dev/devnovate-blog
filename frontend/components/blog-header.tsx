"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function BlogHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">DN</span>
          <span className="text-lg font-semibold tracking-tight text-foreground">Devnovate Blog</span>
        </Link>

        <nav aria-label="Main Navigation" className="hidden items-center gap-6 md:flex">
          <Link className="text-sm text-foreground/80 hover:text-accent" href="/">
            Home
          </Link>
          <Link className="text-sm text-foreground/80 hover:text-accent" href="#categories">
            Categories
          </Link>
          <Link className="text-sm text-foreground/80 hover:text-accent" href="#about">
            About
          </Link>
          <Link className="text-sm text-foreground/80 hover:text-accent" href="#newsletter">
            Newsletter
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex">
            <Link href="#subscribe">Subscribe</Link>
          </Button>
          <Button variant="outline" asChild className="md:hidden bg-transparent">
            <Link href="#menu">Menu</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
