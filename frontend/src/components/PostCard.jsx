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
      className="post-card"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      aria-label={`View details for ${post.title}`}
    >
      <CardHeader>
        <CardTitle className="post-card-title" style={{ textDecoration: "underline" }}>
          {post.title}
        </CardTitle>
        <div className="post-card-meta" style={{ margin: "4px 0 10px 0" }}>
          <span>
            <strong>Author:</strong> {post.author?.name || "Unknown"}
          </span>
          <span>
            <strong>Publish date:</strong> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>

      {excerpt ? (
        <CardContent>
          <p className="muted post-card-excerpt">{excerpt}</p>
        </CardContent>
      ) : null}

      <CardFooter style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
        <div className="post-card-actions">
          <Button
            variant="outline"
            onClick={handleLike}
            disabled={!token}
            title={liked ? "Unlike" : "Like"}
            style={{ minWidth: 44, padding: 8 }}
          >
            <LikeIcon filled={liked} />
          </Button>
          <span style={{ color: "#111", fontWeight: 600 }}>{likes}</span>
          <Button variant="outline" type="button" disabled title="Comments" style={{ minWidth: 44, padding: 8 }}>
            <CommentIcon />
          </Button>
          <span style={{ color: "#111", fontWeight: 600 }}>{comments}</span>
        </div>

        <Separator />

        <form onClick={(e) => e.stopPropagation()} onSubmit={handleComment} className="post-card-comment-form">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commenting}
          />
          <Button type="submit" disabled={commenting || !commentText.trim()}>
            Post
          </Button>
        </form>

        {error && <p className="error">{error}</p>}
      </CardFooter>
    </Card>
  )
}
