"use client"

import { useCallback, useEffect, useState } from "react"

export type Post = {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  authorId: string
  views: number
  likes: number
  published: boolean
  createdAt: string
  updatedAt: string
}

const uid = () => Math.random().toString(36).slice(2, 10)
const nowISO = () => new Date().toISOString()

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function lsSet<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function seedPostsIfEmpty() {
  const posts = lsGet<Post[]>("blog_posts", [])
  if (posts.length === 0) {
    const users = lsGet<any[]>("blog_users", [])
    const authorId = users[0]?.id || uid()
    const demo: Post[] = Array.from({ length: 8 }).map((_, i) => ({
      id: uid(),
      title: `Designing with Restraint ${i + 1}`,
      content:
        "Simplicity is a powerful constraint. A black-and-white palette enhances focus, reduces noise, and creates timeless interfaces.",
      excerpt: "Simplicity is a powerful constraint. Black-and-white enhances focus and timelessness.",
      tags: ["design", "minimalism"],
      authorId,
      views: Math.floor(Math.random() * 400 + 50),
      likes: Math.floor(Math.random() * 100),
      published: true,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: nowISO(),
    }))
    lsSet("blog_posts", demo)
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setPosts(lsGet<Post[]>("blog_posts", []))
  }, [])

  useEffect(() => {
    seedPostsIfEmpty()
    refresh()
  }, [refresh])

  const create = async (post: Omit<Post, "id" | "createdAt" | "updatedAt" | "views" | "likes">) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 250))
      const list = lsGet<Post[]>("blog_posts", [])
      const newPost: Post = {
        ...post,
        id: uid(),
        createdAt: nowISO(),
        updatedAt: nowISO(),
        views: 0,
        likes: 0,
      }
      lsSet("blog_posts", [newPost, ...list])
      refresh()
      return newPost
    } catch (e: any) {
      setError(e.message || "Create failed")
      return null
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string, updates: Partial<Post>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 250))
      const list = lsGet<Post[]>("blog_posts", [])
      const idx = list.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error("Post not found")
      const next = [...list]
      next[idx] = { ...next[idx], ...updates, updatedAt: nowISO() }
      lsSet("blog_posts", next)
      refresh()
      return next[idx]
    } catch (e: any) {
      setError(e.message || "Update failed")
      return null
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 250))
      const list = lsGet<Post[]>("blog_posts", [])
      lsSet(
        "blog_posts",
        list.filter((p) => p.id !== id),
      )
      refresh()
      return true
    } catch (e: any) {
      setError(e.message || "Delete failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const incrementViews = (id: string) => {
    const list = lsGet<Post[]>("blog_posts", [])
    const idx = list.findIndex((p) => p.id === id)
    if (idx === -1) return
    list[idx].views = (list[idx].views || 0) + 1
    lsSet("blog_posts", list)
    refresh()
  }

  return { posts, loading, error, create, update, remove, incrementViews, refresh }
}
