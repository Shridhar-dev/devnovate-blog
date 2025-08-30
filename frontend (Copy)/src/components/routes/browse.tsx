import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { SectionTitle, Empty, Badge } from "../components"

export default function BrowsePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const users = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("blog_users") || "[]") as any[]) : []

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/posts") // adjust to your backend URL
        const data = await res.json()
        console.log("Fetched posts:", data)
        setPosts(data.posts)
      } catch (err) {
        console.error("Failed to fetch posts", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const authorName = (id?: string) => users.find((u) => u.id === id)?.name || "Unknown"

  if (loading) return <div className="max-w-5xl mx-auto">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto py-10">
      <SectionTitle>All Blogs</SectionTitle>
      {posts.length === 0 ? (
        <div className="mt-4">
          <Empty>No posts yet.</Empty>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p._id}
              to={`/post/${p._id}`}
              className="group block rounded border border-gray-200 p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold group-hover:underline">{p.title}</h3>
                <div className="ml-3 inline-flex items-center gap-3 text-xs text-gray-500">
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1" aria-label="Views">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> {p.views}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{p.excerpt}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-700">{authorName(p.authorId)}</div>
                <div className="flex flex-wrap gap-1">
                  {p.tags?.slice(0, 3).map((t: string) => (
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
