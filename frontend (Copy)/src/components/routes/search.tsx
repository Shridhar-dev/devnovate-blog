"use client"

import { useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { usePosts } from "../posts-store"
import { SectionTitle, Empty, Badge } from "../components"

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get("q") || "").toLowerCase()
  const { posts } = usePosts()
  const users = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("blog_users") || "[]") as any[]) : []

  const results = useMemo(() => {
    const hay = (s?: string) => (s || "").toLowerCase()
    return posts.filter(
      (p) =>
        p.published &&
        (hay(p.title).includes(q) ||
          hay(p.excerpt).includes(q) ||
          hay(p.content).includes(q) ||
          (p.tags || []).some((t) => hay(t).includes(q))),
    )
  }, [posts, q])

  const authorName = (id?: string) => users.find((u) => u.id === id)?.name || "Unknown"

  return (
    <div className="max-w-5xl mx-auto">
      <SectionTitle>Search Results</SectionTitle>
      <p className="mt-1 text-sm text-gray-600">
        Query: <code className="font-mono">{q || "(empty)"}</code>
      </p>
      {results.length === 0 ? (
        <div className="mt-4">
          <Empty>No matching posts.</Empty>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <Link
              to={`/post/${p.id}`}
              key={p.id}
              className="group block rounded border border-gray-200 p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold group-hover:underline">{p.title}</h3>
                <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{p.excerpt}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-700">{authorName(p.authorId)}</div>
                <div className="flex flex-wrap gap-1">
                  {p.tags?.slice(0, 3).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
