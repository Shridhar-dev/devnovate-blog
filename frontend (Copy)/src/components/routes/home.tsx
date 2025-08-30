"use client"

import { useMemo } from "react"
import { Link } from "react-router-dom"
import { usePosts, type Post } from "../posts-store"
import { SectionTitle, Empty, Badge } from "../components"
import { Navbar } from "../navbar"

function BlogCard({ post, authorName }: { post: Post; authorName?: string }) {
  return (
    <Link to={`/post/${post.id}`} className="group block rounded border border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold group-hover:underline">{post.title}</h3>
        <div className="ml-3 inline-flex items-center gap-3 text-xs text-gray-500">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1" aria-label="Views">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> {post.views}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700 text-left">{post.excerpt}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">{authorName || "Unknown"}</div>
        <div className="flex flex-wrap gap-1">
          {post.tags?.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { posts } = usePosts()
  const users = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("blog_users") || "[]") as any[]) : []

  const published = useMemo(() => posts.filter((p) => p.published), [posts])

  const trending = useMemo(
    () => [...published].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [published],
  )
  const latest = useMemo(
    () => [...published].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6),
    [published],
  )

  const findAuthor = (id?: string) => users.find((u) => u.id === id)?.name || "Unknown"

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-left">
          <h1 className="text-pretty text-3xl font-semibold ">Devnovate Blog</h1>
          <p className="mt-2 text-gray-600 text-xl">Read, search, and explore articles. Clean black-and-white theme focused on readability.</p>
        </header>

        <section className="mb-10">
          <SectionTitle>Trending</SectionTitle>
          {trending.length === 0 ? (
            <div className="mt-4">
              <Empty>No trending posts yet.</Empty>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((p) => (
                <BlogCard key={p.id} post={p} authorName={findAuthor(p.authorId)} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <SectionTitle>Latest</SectionTitle>
          {latest.length === 0 ? (
            <div className="mt-4">
              <Empty>No recent posts.</Empty>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <BlogCard key={p.id} post={p} authorName={findAuthor(p.authorId)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <SectionTitle>All Blogs</SectionTitle>
            <Link to="/browse" className="text-sm text-gray-700 underline underline-offset-4">
              Browse all
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published.slice(0, 6).map((p) => (
              <BlogCard key={p.id} post={p} authorName={findAuthor(p.authorId)} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
