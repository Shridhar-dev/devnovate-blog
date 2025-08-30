"use client"

import type React from "react"
import { useMemo, useState, useCallback } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useDropzone } from "react-dropzone"

import { usePosts } from "../posts-store"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SectionTitle, Empty, Badge } from "../components"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import { Bold, Italic, Underline as UnderlineIcon, Heading2, List, TextQuote, AlignLeft, AlignRight, AlignCenter } from 'lucide-react';
import AdminLayout from "../admin-layout"

export default function WritePage() {
  const { posts, create, update, remove } = usePosts()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editId = params.get("edit") || undefined
  const editing = useMemo(() => posts.find((p) => p.id === editId), [posts, editId])

  const [title, setTitle] = useState(editing?.title || "")
  const [excerpt, setExcerpt] = useState(editing?.excerpt || "")
  const [tags, setTags] = useState((editing?.tags || []).join(", "))
  const [published, setPublished] = useState<boolean>(editing?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<File[]>([])

  // Rich text editor setup
  const editor = useEditor({
    extensions: [StarterKit, Underline, LinkExtension, Image, TextAlign],
    content: editing?.content || "",
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] border border-black/10 rounded-lg p-3 focus:outline-none text-left",
      },
    },
  })

  // Image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [] } })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const post = {
      id: editId || crypto.randomUUID(),
      title,
      content: editor?.getHTML() || "",
      excerpt,
      tags: tags.split(",").map((t) => t.trim()),
      published,
      images,
      createdAt: new Date().toISOString(),
      authorId: "user.id",
    }

    if (editId) update(editId, post)
    else create(post)

    setSaving(false)
    navigate("/profile")
  }

  const mine = posts.filter((p) => p.authorId === "user.id")

  return (
    <AdminLayout>
      <div className=" w-full px-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
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

            {/* Excerpt */}
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short excerpt (for previews)"
              className="italic border-black/10 p-5"
            />

            {/* Tags */}
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
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
                    <Italic/>
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <List/>
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setBlockquote().run()}>
                    <TextQuote />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}>
                    <Heading2/>
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
              </div>
            </div>

            {/* Image Upload */}
            <div {...getRootProps()} className="cursor-pointer border-dashed border-black/10 border-2 rounded-lg p-4 text-center">
              <input {...getInputProps()} />
              <p className="text-gray-500">Drag & drop images here, or click to select</p>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Publish toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Post"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Side */}
        <div className="col-span-2 sticky top-10 h-fit text-left border border-black/10 rounded-lg p-6 bg-white shadow-sm">
          <div className="text-xs flex items-center gap-2 w-fit px-3 py-1 rounded-2xl mb-3 bg-black text-white">Live Preview <div className="bg-yellow-500 duration-1000 animate-ping w-1 h-1  rounded-full"></div></div>
          <article className="prose max-w-none">
            <h1 className="text-3xl font-bold">{title || "Untitled Post"}</h1>
            {excerpt && <p className="text-gray-600 text-xl mt-1 mb-5">{excerpt}</p>}
            <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "<p>Start writing...</p>" }} />
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {images.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="rounded-lg border w-48 h-32 object-cover"
                  />
                ))}
              </div>
            )}
            {tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.split(",").map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>

        {/* User's Posts (below editor, full width) */}
        <div className="lg:col-span-2 mt-12">
          <SectionTitle>Your Posts</SectionTitle>
          {mine.length === 0 ? (
            <div className="mt-3">
              <Empty>No posts yet.</Empty>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-gray-200">
              {mine.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/write?edit=${p.id}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Button variant="ghost" onClick={() => remove(p.id)}>
                      Delete
                    </Button>
                    {p.published ? <Badge>Published</Badge> : <Badge>Draft</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
