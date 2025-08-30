// routes/write.tsx
"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../auth-context"
import { useMyPosts, usePostActions } from "@/hooks/usePosts"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SectionTitle, Empty } from "../components"
import AdminLayout from "../admin-layout"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { Bold, Italic, Underline as UnderlineIcon, Heading2, List, TextQuote, AlignLeft, AlignRight, AlignCenter } from 'lucide-react'
import SelectionPopup from "../selection-popup"

export default function WritePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editId = params.get("edit") || undefined

  const { posts } = useMyPosts()
  const { createPost, updatePost, deletePost, loading } = usePostActions()
  
  const editing = editId ? posts.find((p) => p._id === editId) : null

  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [saving, setSaving] = useState(false)

  // Rich text editor setup
  const editor = useEditor({
    extensions: [StarterKit, Underline, LinkExtension, Image, TextAlign],
    content: "",
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] border border-black/10 rounded-lg p-3 focus:outline-none text-left",
      },
    },
  })

  // Load editing data when editing
  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setImageUrl(editing.imageUrl || "")
      editor?.commands.setContent(editing.content)
    } else {
      setTitle("")
      setImageUrl("")
      editor?.commands.setContent("")
    }
  }, [editing, editor])



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !editor?.getHTML()) return

    setSaving(true)
    try {
      const postData = {
        title: title.trim(),
        content: editor.getHTML(),
        ...(imageUrl && { imageUrl })
      }

      if (editId && editing) {
        await updatePost(editId, postData)
      } else {
        await createPost(postData)
      }

      navigate("/admin/profile")
    } catch (err) {
      console.error("Failed to save post:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId)
        // If we're editing this post, go back
        if (editId === postId) {
          navigate("/admin/profile")
        }
      } catch (err) {
        console.error("Failed to delete post:", err)
      }
    }
  }

  if (!user) return null

  return (
    <AdminLayout>
      <div className="w-full p-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Editor Side */}
        <div className="col-span-3">
          <SectionTitle>{editing ? "Edit Post" : "Write a Post"}</SectionTitle>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              required
              className="text-lg font-medium border-black/10 p-5"
            />

            {/* Image URL */}
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="border-black/10 p-5"
            />

            {/* Rich Text Editor */}
            <div>
              <div className="border border-black/10 rounded-lg">
                <div className="flex flex-wrap gap-2 border-b border-black/10 p-2 text-sm">
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <Bold />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                    <Italic />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <List />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setBlockquote().run()}>
                    <TextQuote />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}>
                    <Heading2 />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
                    <AlignLeft />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
                    <AlignCenter />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
                    <AlignRight />
                  </Button>
                </div>
                <EditorContent editor={editor} />
                {editor && <SelectionPopup editor={editor} />}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={saving || loading}>
                {saving ? "Saving..." : editing ? "Update Post" : "Create Post"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Side */}
        <div className="col-span-2 sticky top-10 h-fit text-left border border-black/10 rounded-lg p-6 bg-white shadow-sm">
          <div className="text-xs flex items-center gap-2 w-fit px-3 py-1 rounded-2xl mb-3 bg-black text-white">
            Live Preview <div className="bg-yellow-500 duration-1000 animate-ping w-1 h-1 rounded-full"></div>
          </div>
          <article className="prose max-w-none">
            {imageUrl && (
              <div className="mb-4 overflow-hidden rounded">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
            <h1 className="text-2xl font-bold">{title || "Untitled Post"}</h1>
            {/*<div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "<p>Start writing...</p>" }} />*/}
          </article>
        </div>

        {/* User's Posts */}
        <div className="lg:col-span-5 mt-12">
          <SectionTitle>Your Posts</SectionTitle>
          {posts.length === 0 ? (
            <div className="mt-3">
              <Empty>No posts yet.</Empty>
            </div>
          ) : (
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {new Date(post.createdAt).toLocaleDateString()} • {post.likesCount} likes • {post.commentsCount} comments
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/write?edit=${post._id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}