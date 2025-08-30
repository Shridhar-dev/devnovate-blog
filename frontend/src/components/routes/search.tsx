// routes/search.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { usePosts } from "@/hooks/usePosts"
import { SectionTitle, Empty } from "../components"
import { Navbar } from "../navbar"
import type { Post } from "@/api/posts"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block rounded border border-gray-200 p-4 hover:bg-gray-50"
    >
        <div className="mb-3 overflow-hidden rounded">
          <img src={post.imageUrl || "https://images.pexels.com/photos/5368046/pexels-photo-5368046.jpeg"} alt={post.title} className="h-32 w-full object-cover" />
        </div>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold group-hover:underline">{post.title}</h3>
        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">{post.author.name}</div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            ♥ {post.likesCount}
          </span>
          <span className="inline-flex items-center gap-1">
            💬 {post.commentsCount}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  
  const { posts, loading, error, pagination, refetch } = usePosts({ 
    q: searchQuery,
    limit: 12 
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(query)
    setSearchParams({ q: query })
    refetch()
  }

  useEffect(() => {
    const q = searchParams.get("q") || ""
    setQuery(q)
    setSearchQuery(q)
  }, [searchParams])

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <SectionTitle>Search Posts</SectionTitle>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-4 mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        {searchQuery && (
          <p className="mb-6 text-sm text-gray-600">
            {loading ? "Searching..." : `Search results for: "${searchQuery}"`}
            {!loading && posts.length > 0 && ` (${posts.length} found)`}
          </p>
        )}

        {error ? (
          <div className="text-center text-red-600">
            <p>Error searching posts: {error}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <p>Searching...</p>
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-10 text-gray-500">
            <p>Enter a search term to find posts</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-4">
            <Empty>No matching posts found.</Empty>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}