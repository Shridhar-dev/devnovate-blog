"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/components/auth-context"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SectionTitle } from "../components"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@monoblog.dev")
  const [password, setPassword] = useState("admin123")

  const { login, loading, error } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="h-screen flex items-center">
      <div className="mx-auto w-1/3 my-auto">
        <SectionTitle>Log in</SectionTitle>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Log in"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-3 text-sm text-gray-600">
          No account?{" "}
          <Link className="underline" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
