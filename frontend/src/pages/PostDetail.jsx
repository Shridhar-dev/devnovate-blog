"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import ReactMarkdown from "react-markdown"

export default function PostDetail() {
  const { slug } = useParams()
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
        <h1 className="title">{post.title}</h1>
        <p className="muted">
          By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="article-actions">
          <button className="button ghost" onClick={toggleLike}>
            ♥ {post.likesCount}
          </button>
        </div>
        <div className="prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <section className="section">
        <h2 className="subtitle">Comments ({post.commentsCount || 0})</h2>
        <form onSubmit={addComment} className="row">
          <input
            className="input"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="button">Post</button>
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
