"use client"

import { useId } from "react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const emailId = useId()

  return (
    <aside className="space-y-6" aria-label="Sidebar">
      <section id="about" className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-base font-semibold">About</h2>
        <p className="text-sm text-muted-foreground">
          Devnovate is your source for modern web development, product thinking, and engineering leadership.
        </p>
      </section>

      <section id="categories" className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-base font-semibold">Categories</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>
            <a className="hover:text-accent" href="#cat-react">
              React
            </a>
          </li>
          <li>
            <a className="hover:text-accent" href="#cat-nextjs">
              Next.js
            </a>
          </li>
          <li>
            <a className="hover:text-accent" href="#cat-design">
              Design
            </a>
          </li>
          <li>
            <a className="hover:text-accent" href="#cat-product">
              Product
            </a>
          </li>
          <li>
            <a className="hover:text-accent" href="#cat-career">
              Career
            </a>
          </li>
          <li>
            <a className="hover:text-accent" href="#cat-opinion">
              Opinion
            </a>
          </li>
        </ul>
      </section>

      <section id="newsletter" className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-base font-semibold">Newsletter</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Get the latest posts in your inbox. No spam, unsubscribe anytime.
        </p>
        <form
          aria-labelledby={emailId}
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Subscribed!") // replace with proper action
          }}
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Subscribe
          </Button>
        </form>
      </section>
    </aside>
  )
}
