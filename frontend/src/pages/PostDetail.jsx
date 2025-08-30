"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import ReactMarkdown from "react-markdown"
import StatusBadge from "../components/StatusBadge"
import { Button } from "../components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

export default function PostDetail() {
  const { slug } = useParams()
  const nav = useNavigate()
  const { token, user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")

  const load = async () => {
    try {
      const headers = token ? { token } : {}
      const data = await api(`/posts/${slug}`, headers)
      setPost(data.post)
      const c = await api(`/comments/${data.post._id}`)
      setComments(c.comments)
    } catch (err) {
      setError(err.message)
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const toggleLike = async () => {
    if (!user) return alert("Login to like")
    const data = await api(`/posts/${post._id}/like`, { method: "POST", token })
    setPost({ ...post, likesCount: data.likesCount })
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!user) return alert("Login to comment")
    const c = await api(`/comments/${post._id}`, { method: "POST", body: { content: commentText }, token })
    setComments([c.comment, ...comments])
    setCommentText("")
    setPost({ ...post, commentsCount: (post.commentsCount || 0) + 1 })
  }

  const canEdit = user && (user.role === "admin" || String(user.id || user._id) === String(post?.author?._id))
  const approve = async () => {
    await api(`/admin/${post._id}/approve`, { method: "PATCH", token })
    await load()
  }
  const reject = async () => {
    await api(`/admin/${post._id}/reject`, { method: "PATCH", token })
    await load()
  }
  const hide = async () => {
    await api(`/admin/${post._id}/hide`, { method: "PATCH", token })
    await load()
  }
  const del = async () => {
    await api(`/posts/${post._id}`, { method: "DELETE", token })
    nav("/profile")
  }

  if (error)
    return (
      <main className="container">
        <p className="error">{error}</p>
      </main>
    )
  if (!post)
    return (
      <main className="container">
        <p>Loading…</p>
      </main>
    )

  return (
    <main className="container">
      <article className="article">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <h1 className="title" style={{ marginBottom: 0 }}>
            {post.title}
          </h1>
          <StatusBadge status={post.status} />
        </div>
        <p className="muted">
          By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="article-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="outline" onClick={toggleLike}>
            ♥ {post.likesCount}
          </Button>
          {canEdit && (
            <>
              <Button onClick={() => nav(`/post/${post.slug}/edit`)}>Edit</Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the post. You can&apos;t undo this action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={del}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {user?.role === "admin" && (
            <>
              {post.status === "pending" && (
                <>
                  <Button onClick={approve}>Approve</Button>
                  <Button variant="outline" onClick={reject}>
                    Reject
                  </Button>
                </>
              )}
              {post.status === "published" && (
                <Button variant="outline" onClick={hide}>
                  Hide
                </Button>
              )}
            </>
          )}
        </div>

        {post.status !== "published" && canEdit && (
          <p className="muted" style={{ marginBottom: 10 }}>
            This post is not published yet. You can still view it as the author
            {user?.role === "admin" ? " or admin" : ""}.
          </p>
        )}

        <div className="prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <section className="section">
        <h2 className="subtitle">Comments ({post.commentsCount || 0})</h2>
        <form onSubmit={addComment} className="row" style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit">Post</Button>
        </form>
        <ul className="list">
          {comments.map((c) => (
            <li key={c._id} className="comment">
              <div className="row">
                <strong>{c.user?.name || "User"}</strong>
                <span className="muted">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p>{c.content}</p>
            </li>
          ))}
          {comments.length === 0 && <p className="muted">No comments yet.</p>}
        </ul>
      </section>
    </main>
  )
}
