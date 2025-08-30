"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import ReactMarkdown from "react-markdown"

export default function CreatePost() {
  const { token } = useAuth()
  const nav = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const { post } = await api("/posts", { method: "POST", body: { title, content }, token })
      if (post?.status === "pending") {
        alert("Submitted for review. It will be published after admin approval.")
      }
      nav(`/post/${post.slug}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="container">
      <h1 className="title">Write an article</h1>
      <form onSubmit={onSubmit} className="stack">
        {error && <p className="error">{error}</p>}
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="row">
          <button type="button" className="button" onClick={() => setPreview((p) => !p)}>
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
        {!preview ? (
          <textarea
            className="textarea"
            placeholder="Write in Markdown..."
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        ) : (
          <div className="preview">
            <ReactMarkdown>{content || "*Nothing to preview*"}</ReactMarkdown>
          </div>
        )}
        <button className="button">Submit</button>
      </form>
    </main>
  )
}
