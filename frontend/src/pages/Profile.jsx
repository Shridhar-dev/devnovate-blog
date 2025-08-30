"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import PostCard from "../components/PostCard"

export default function Profile() {
  const { token, user } = useAuth()
  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [latest, setLatest] = useState([])
  const [top, setTop] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const [latestRes, topRes] = await Promise.all([
          api(`/posts/mine?sort=latest&limit=3`, { token }),
          api(`/posts/mine?sort=trending&limit=3`, { token })
        ])
        setLatest(latestRes.posts || [])
        setTop(topRes.posts || [])
      } catch (err) {
        setError(err.message || "Failed to load your posts")
        setLatest([])
        setTop([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, user])

  return (
    <main className="container">
      <header className="section">
        <h1 className="title" style={{ marginBottom: 0 }}>{user?.name ? user.name : "Profile"}</h1>
        <p className="muted" style={{ marginTop: 4, marginBottom: 16 }}>@{user?.email?.split("@")[0] || "user"}</p>
        <h2 className="subtitle">Your articles</h2>
        {error && (
          <p role="alert" className="muted" style={{ color: "crimson" }}>
            {error}
          </p>
        )}
      </header>
      {loading ? (
        <section className="section">
          <p>Loading…</p>
        </section>
      ) : (
        <>
          <section className="section">
            <h2 className="subtitle">Most Liked</h2>
            <div className="grid">
              {top.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
              {top.length === 0 && !error && <p className="muted">No top posts yet.</p>}
            </div>
          </section>
          <section className="section">
            <h2 className="subtitle">Latest</h2>
            <div className="grid">
              {latest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
              {latest.length === 0 && !error && <p className="muted">No latest posts yet.</p>}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
