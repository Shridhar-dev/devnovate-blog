"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SectionTitle } from "../components"
import { useAuth } from "@/components/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signup, loading, error } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup(name, email, password)
  }

  return (
    <div className="h-screen flex items-center">
      <div className="mx-auto w-1/3 my-auto">
        <SectionTitle>Sign up</SectionTitle>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            {loading ? "Creating account..." : "Sign up"}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <p className="mt-3 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
