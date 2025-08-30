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
  const [sort, setSort] = useState("latest") // 'latest' | 'trending'

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await api(`/posts/mine?sort=${encodeURIComponent(sort)}`, { token })
        setMine(data.posts || [])
      } catch (err) {
        setError(err.message || "Failed to load your posts")
        setMine([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, user, sort])

  return (
    <main className="container">
      <header className="section">
        <h1 className="title">Your articles</h1>
        <p className="muted">Showing your {sort === "latest" ? "latest" : "top"} published articles.</p>
        <div className="row" role="tablist" aria-label="Sort posts">
          <button className="button" aria-pressed={sort === "latest"} onClick={() => setSort("latest")}>
            Latest
          </button>
          <button className="button" aria-pressed={sort === "trending"} onClick={() => setSort("trending")}>
            Top
          </button>
        </div>
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
        <section className="section">
          <div className="grid">
            {mine.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            {mine.length === 0 && !error && <p className="muted">You have not published any articles yet.</p>}
          </div>
        </section>
      )}
    </main>
  )
}
