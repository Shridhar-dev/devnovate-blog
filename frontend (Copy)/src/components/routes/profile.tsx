"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth-context"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { SectionTitle } from "../components"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) navigate("/login")
  }, [user, navigate])

  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")

  if (!user) return null

  const onSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, bio })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SectionTitle>Profile</SectionTitle>
      <form onSubmit={onSave} className="mt-4 space-y-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <Textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" />
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}
