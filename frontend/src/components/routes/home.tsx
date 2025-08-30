// routes/home.tsx
"use client"

import { Link } from "react-router-dom"
import { usePosts, useTrendingPosts } from "@/hooks/usePosts"
import { SectionTitle, Empty, Badge } from "../components"
import { Navbar } from "../navbar"
import type { Post } from "@/api/posts"
import { Button } from "../ui/button"
import { ArrowRight, MoveRightIcon } from "lucide-react"

function BlogCard({ post }: { post: Post }) {
  return (
    <Link to={`/post/${post.slug}`} className="group block rounded border border-gray-200 p-4 hover:bg-gray-50">
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
        <div className="text-sm text-gray-700">By - {post.author.name}</div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { posts: latestPosts, loading: latestLoading } = usePosts({ sort: "latest", limit: 6 })
  const { posts: trendingPosts, loading: trendingLoading } = useTrendingPosts()

  if (latestLoading && trendingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 text-left">
          <img src="https://devnovate.co/DEVNOVATE%20LOGO%20BLACK.svg" className=" object-cover mb-10"/>
          <h1 className="text-pretty text-3xl font-semibold">Devnovate Blog</h1>
          <p className="mt-2 text-gray-600 text-xl">
            A full suite blogging platform for developers to create, publish, and explore content — all while ensuring quality through admin moderation.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/login">
              <button className="flex items-center  gap-5 mt-5 text-white bg-[#9224bb] text-lg py-3 font-semibold hover:scale-[1.05] cursor-pointer duration-300 px-6 rounded-md">
                Get Started <ArrowRight />
              </button>
            </Link>
            <Link to="/browse">
              <button className="flex items-center  gap-5 mt-5 text-black border text-lg py-3 font-semibold hover:scale-[1.05] cursor-pointer duration-300 px-6 rounded-md">
                Browse Collection
              </button>
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <SectionTitle>Trending</SectionTitle>
          {trendingLoading ? (
            <div className="mt-4">
              <p>Loading trending posts...</p>
            </div>
          ) : trendingPosts.length === 0 ? (
            <div className="mt-4">
              <Empty>No trending posts yet.</Empty>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trendingPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <SectionTitle>Latest</SectionTitle>
          {latestLoading ? (
            <div className="mt-4">
              <p>Loading latest posts...</p>
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="mt-4">
              <Empty>No recent posts.</Empty>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
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
            {latestPosts.slice(0, 6).map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}