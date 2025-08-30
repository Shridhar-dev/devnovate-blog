"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import PostCard from "../components/PostCard"
import { useSearchParams } from "react-router-dom"

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") || ""
  const [trending, setTrending] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [t, p] = await Promise.all([api("/posts/trending"), api(`/posts?q=${encodeURIComponent(q)}&sort=latest`)])
      setTrending(t.posts || [])
      setPosts(p.posts || [])
    } catch (err) {
      setError(err.message || "Failed to load posts")
      setTrending([])
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [q])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const query = form.get("q") || ""
    setSearchParams(query ? { q: query } : {})
  }

  return (
    <main className="container">
      <section className="section">
        <h1 className="title text-balance">Latest from Devnovate</h1>
        <form onSubmit={onSubmit} className="row">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles"
            className="input"
            aria-label="Search articles"
          />
          <button className="button">Search</button>
        </form>
        {error && (
          <p role="alert" className="muted" style={{ color: "crimson" }}>
            {error}
          </p>
        )}
      </section>

      <section className="section">
        <h2 className="subtitle">Trending</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid">
            {trending.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            {trending.length === 0 && !error && <p className="muted">No trending posts yet.</p>}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="subtitle">{q ? `Results for "${q}"` : "Latest"}</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            {posts.length === 0 && !error && <p className="muted">No posts found.</p>}
          </div>
        )}
      </section>
    </main>
  )
}
