"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"

export default function EditPost() {
  const { slug } = useParams()
  const { token } = useAuth()
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const nav = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api(`/posts/${slug}`, { token })
        setPost(data.post)
        setTitle(data.post.title)
        setContent(data.post.content)
      } catch (err) {
        setError(err.message || "Failed to load post")
      }
    }
    load()
  }, [slug, token])

  const onSave = async (e) => {
    e.preventDefault()
    if (!post) return
    setSaving(true)
    setError("")
    try {
      const res = await api(`/posts/${post._id}`, { method: "PATCH", body: { title, content }, token })
      const updated = res.post
      nav(`/post/${updated.slug}`)
    } catch (err) {
      setError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (!post) {
    return <main className="container">{error ? <p className="error">{error}</p> : <p>Loading…</p>}</main>
  }

  return (
    <main className="container">
      <Card>
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
        </CardHeader>
        <form className="stack" onSubmit={onSave}>
          <CardContent className="stack" style={{ display: "grid", gap: 12 }}>
            {error && <p className="error">{error}</p>}
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
          </CardContent>
          <CardFooter>
            <Button disabled={saving} type="submit" className="text-center justify-center">
              {saving ? "Saving…" : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
