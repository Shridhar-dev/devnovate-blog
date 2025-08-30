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
    <main className="container narrow">
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <form className="stack" onSubmit={onSubmit}>
          <CardContent className="stack" style={{ display: "grid", gap: 12 }}>
            {error && <p className="error">{error}</p>}
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input
              type="password"
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={saving} type="submit">
              {saving ? "Saving…" : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
