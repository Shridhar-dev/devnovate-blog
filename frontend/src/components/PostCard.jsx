"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

// Simple SVG icons
const LikeIcon = ({ filled }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={filled ? "#111" : "none"}
    stroke="#111"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
)
const CommentIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const hasExcerpt = typeof post.content === "string" && post.content.length > 0
  const excerpt = hasExcerpt ? post.content.slice(0, 160) + (post.content.length > 160 ? "…" : "") : null
  const { token, user } = useAuth()
  const [likes, setLikes] = useState(post.likesCount)
  const [liked, setLiked] = useState(
    !!(user && post.likedBy && Array.isArray(post.likedBy) && post.likedBy.some((u) => String(u) === String(user._id))),
  )
  const [comments, setComments] = useState(post.commentsCount)
  const [commentText, setCommentText] = useState("")
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState("")

  const handleLike = async () => {
    if (!token) return alert("Login to like posts.")
    try {
      const res = await api(`/posts/${post._id}/like`, { method: "POST", token })
      setLikes(res.likesCount)
      setLiked(res.liked)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!token) return alert("Login to comment.")
    if (!commentText.trim()) return
    setCommenting(true)
    setError("")
    try {
      await api(`/comments/${post._id}`, { method: "POST", body: { content: commentText }, token })
      setComments((c) => c + 1)
      setCommentText("")
    } catch (err) {
      setError(err.message)
    } finally {
      setCommenting(false)
    }
  }

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("form") || e.target.tagName === "A") return
    navigate(`/post/${post.slug}`)
  }

  return (
    <Card
      className="shadow-pretty border-0 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      aria-label={`View details for ${post.title}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">By:</strong> {post.author?.name || "Unknown"}
          </span>
          <span>
            <strong className="text-foreground">Published:</strong> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>

      {excerpt ? (
        <CardContent className="pb-3">
          <p className="text-muted-foreground text-sm leading-relaxed">{excerpt}</p>
        </CardContent>
      ) : null}

      <CardFooter className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleLike}
            disabled={!token}
            title={liked ? "Unlike" : "Like"}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-50 focus:bg-red-50 active:bg-red-100 transition-colors text-center text-gray-700 focus:text-gray-700 active:text-gray-700"
          >
            <LikeIcon filled={liked} />
            <span className="font-medium">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            type="button"
            disabled
            title="Comments"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-blue-50 focus:bg-blue-50 active:bg-blue-100 transition-colors text-center text-gray-700 focus:text-gray-700 active:text-gray-700"
          >
            <CommentIcon />
            <span className="font-medium">{comments}</span>
          </Button>
        </div>

        <Separator className="bg-border" />

        <form onClick={(e) => e.stopPropagation()} onSubmit={handleComment} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commenting}
            className="flex-1 rounded-xl border-2 focus:border-primary transition-colors"
          />
          <Button
            type="submit"
            disabled={commenting || !commentText.trim()}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 transition-colors text-center flex items-center justify-center text-white focus:text-white active:text-white"
          >
            Post
          </Button>
        </form>

        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-xl">{error}</p>}
      </CardFooter>
    </Card>
  )
}
