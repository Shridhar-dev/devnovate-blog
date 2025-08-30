"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import StatusBadge from "../components/StatusBadge"
import PostCard from "../components/PostCard"
import { Button } from "../components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

export default function Profile() {
  const { token, user, logout } = useAuth()
  const nav = useNavigate()
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
        const [latestRes, topRes, mineRes] = await Promise.all([
          api(`/posts/mine?sort=latest&limit=3&status=published`, { token }),
          api(`/posts/mine?sort=trending&limit=3&status=published`, { token }),
          api(`/posts/mine?status=all&limit=100&sort=latest`, { token }),
        ])
        setLatest(latestRes.posts || [])
        setTop(topRes.posts || [])
        setMine(mineRes.posts || [])
      } catch (err) {
        setError(err.message || "Failed to load your posts")
        setLatest([])
        setTop([])
        setMine([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, user])

  const deleteAccount = async () => {
    await api(`/users/me`, { method: "DELETE", token })
    logout()
    nav("/")
  }

  const deletePost = async (id) => {
    await api(`/posts/${id}`, { method: "DELETE", token })
    setMine((list) => list.filter((p) => p._id !== id))
  }

  return (
    <main className="container">
      <header className="section">
        <h1 className="title" style={{ marginBottom: 0 }}>
          {user?.name ? user.name : "Profile"}
        </h1>
        <p className="muted" style={{ marginTop: 4, marginBottom: 16 }}>
          @{user?.email?.split("@")[0] || "user"}
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Button asChild>
            <Link to="/create">Write</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile/edit">Edit profile</Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete profile</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove your profile and all your posts. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {error && (
          <p role="alert" className="muted" style={{ color: "#111", marginTop: 8 }}>
            {error}
          </p>
        )}
      </header>

      <section className="section">
        <h2 className="subtitle">Your articles</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="list">
            {mine.map((p) => (
              <li key={p._id} className="card" style={{ display: "grid", gap: 8 }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <Link to={`/post/${p.slug}`} className="link" style={{ textDecoration: "underline" }}>
                      <strong>{p.title}</strong>
                    </Link>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                  <Button variant="outline" asChild>
                    <Link to={`/post/${p.slug}/edit`}>Edit</Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove the post. You can&apos;t undo this action.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePost(p._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
            {mine.length === 0 && <p className="muted">No posts yet.</p>}
          </ul>
        )}
      </section>

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
    </main>
  )
}
