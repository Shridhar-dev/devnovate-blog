"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "./auth-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function AvatarCircle({ name }: { name?: string }) {
  const initials =
    (name || "?")
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  return (
    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm">
      {initials}
    </div>
  )
}

function Nav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded bg-black text-white text-xs">MB</div>
          <span className="font-semibold tracking-tight">MonoBlog</span>
        </Link>

        <form onSubmit={onSubmit} className="hidden w-full max-w-md md:block">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="bg-white"
          />
        </form>

        <div className="flex items-center gap-2">
          <Link to="/write">
            <Button variant="outline" className="hidden bg-transparent sm:inline-flex">
              Write
            </Button>
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" className="flex items-center gap-2">
                  <AvatarCircle name={user.name} />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button onClick={() =>{}} className="hidden sm:inline-flex">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-2 md:hidden">
        <form onSubmit={onSubmit}>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="bg-white"
          />
        </form>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8 text-sm text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} MonoBlog</p>
        <p className="text-gray-500">Black & white, readable by design.</p>
      </div>
    </footer>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-6xl grow px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
