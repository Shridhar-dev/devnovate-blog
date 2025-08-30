"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import PostCard from "../components/PostCard"

export default function Profile() {
  const { token, user } = useAuth()
  const [mine, setMine] = useState([])

  useEffect(() => {
    const load = async () => {
      // fetch my posts across statuses (simple approach: query many and filter client-side)
      const [published, pending, rejected, hidden] = await Promise.all(
        [
          api("/posts?q="), // published only
          api("/admin/pending", { token }), // requires admin for pending; but for user we still want their own
        ]
          .map((p) => p)
          .catch(() => []),
      )
      // Instead, simpler: create a dedicated endpoint would be better, but for MVP we filter from all we can see.
      // Here we fallback to fetching published and showing authored subset.
      const authoredPublished = (published.posts || []).filter((p) => p.author && p.author.name === user?.name)
      setMine(authoredPublished)
    }
    if (user) load()
  }, [token, user])

  return (
    <main className="container">
      <h1 className="title">Your articles</h1>
      <p className="muted">Showing your published articles.</p>
      <div className="grid">
        {mine.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
        {mine.length === 0 && <p className="muted">No published articles yet.</p>}
      </div>
    </main>
  )
}
