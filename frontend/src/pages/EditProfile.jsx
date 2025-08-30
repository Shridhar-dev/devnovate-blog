"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../api"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"

export default function EditProfile() {
  const { user, token, setUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await api(`/users/me`, { method: "PATCH", body: { name, password: password || undefined }, token })
      setUser(res.user)
      nav("/profile")
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[60vh] px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="pb-2">
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error && <p className="text-red-500 font-medium mb-2">{error}</p>}
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              type="password"
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter className="pt-2">
            <Button disabled={saving} type="submit" className="w-full py-2 text-center justify-center">
              {saving ? "Saving…" : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
