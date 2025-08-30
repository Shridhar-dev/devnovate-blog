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
    await api(`/auth/me`, { method: "DELETE", token })
    logout()
    nav("/")
  }

  const deletePost = async (id) => {
    await api(`/posts/${id}`, { method: "DELETE", token })
    setMine((list) => list.filter((p) => p._id !== id))
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 animate-fade">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {user?.name ? user.name : "Profile"}
            </h1>
            <p className="text-muted-foreground">
              @{user?.email?.split("@")[0] || "user"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="rounded-xl bg-primary hover:bg-indigo-700 text-center justify-center">
              <Link to="/create">Write</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl text-center justify-center">
              <Link to="/profile/edit">Edit profile</Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl text-center justify-center">Delete profile</Button>
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
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4" role="alert">
            {error}
          </div>
        )}
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Your Articles</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground animate-pulse">Loading…</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {mine.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-pretty p-6 border-l-4 border-primary">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Link to={`/post/${p.slug}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {p.title}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" asChild className="rounded-xl text-center justify-center">
                    <Link to={`/post/${p.slug}/edit`}>Edit</Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-xl text-center justify-center">Delete</Button>
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
              </div>
            ))}
            {mine.length === 0 && <p className="text-muted-foreground text-center py-8">No posts yet.</p>}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Most Liked</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {top.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
          {top.length === 0 && !error && <p className="text-muted-foreground text-center py-8">No top posts yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Latest</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {latest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
          {latest.length === 0 && !error && <p className="text-muted-foreground text-center py-8">No latest posts yet.</p>}
        </div>
      </section>
    </main>
  )
}
