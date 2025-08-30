"use client"

import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { usePosts } from "../posts-store"
import { Empty, Badge } from "../components"

export default function PostPage() {
  const { id } = useParams()
  const { posts, incrementViews } = usePosts()
  const post = useMemo(() => posts.find((p) => p.id === id), [posts, id])
  const users = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("blog_users") || "[]") as any[]) : []
  const author = users.find((u) => u.id === post?.authorId)

  useEffect(() => {
    if (post?.id && post.published) incrementViews(post.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  if (!post) return <Empty>Post not found.</Empty>
  if (!post.published) return <Empty>This post is unpublished.</Empty>

  return (
    <article className="max-w-5xl mx-auto">
      <header className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-balance text-2xl font-semibold">{post.title}</h1>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm">
              {(author?.name || "?")
                .split(" ")
                .map((s:any) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <span>{author?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="inline-flex items-center gap-1" aria-label="Views">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> {post.views}
            </span>
          </div>
        </div>
      </header>
      <p className="leading-relaxed text-gray-800">{post.content}</p>
      {post.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      ) : null}
    </article>
  )
}
