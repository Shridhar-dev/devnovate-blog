// routes/browse.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { usePosts } from "@/hooks/usePosts"
import { SectionTitle, Empty } from "../components"
import { Navbar } from "../navbar"
import type { Post } from "@/api/posts"
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
        <div className="ml-3 inline-flex items-center gap-3 text-xs text-gray-500">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1" aria-label="Likes">
            ♥ {post.likesCount}
          </span>
          <span className="inline-flex items-center gap-1" aria-label="Comments">
            💬 {post.commentsCount}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">{post.author.name}</div>
      </div>
    </Link>
  )
}

export default function BrowsePage() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<"latest" | "trending">("latest")
  const { posts, loading, pagination, error, refetch } = usePosts({ page, sort, limit: 12 })

  useEffect(() => {
    refetch();
  },[sort])
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center text-red-600">
          <p>Error loading posts: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle>All Blogs</SectionTitle>
          <div className="flex gap-2">
            <Button
              variant={sort === "latest" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("latest")}
            >
              Latest
            </Button>
            <Button
              variant={sort === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("trending")}
            >
              Trending
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-4">
            <Empty>No posts yet.</Empty>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 12 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm text-gray-600">
                  Page {page} of {Math.ceil(pagination.total / 12)}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= Math.ceil(pagination.total / 12)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}