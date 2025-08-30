// routes/post.tsx
"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { usePost } from "@/hooks/usePosts"
import { useComments } from "@/hooks/useComments"
import { usePostActions } from "@/hooks/usePosts"
import { useAuth } from "../auth-context"
import { Empty } from "../components"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Navbar } from "../navbar"

export default function PostPage() {
  const { id: slug } = useParams()
  const { post, loading, error, refetch } = usePost(slug!)
  const { comments, addComment } = useComments(post?._id || "")
  const { likePost } = usePostActions()
  const { user } = useAuth()
  
  const [commentContent, setCommentContent] = useState("")
  const [commenting, setCommenting] = useState(false)
  const [liking, setLiking] = useState(false)

  const handleLike = async (e:any) => {
    e.preventDefault()
    if (!post || !user) return
    try {
      setLiking(true)
      await likePost(post._id)
      // Refresh the post to get updated like count
      refetch()
    } catch (err) {
      console.error("Failed to like post:", err)
    } finally {
      setLiking(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim() || !post) return
    
    try {
      setCommenting(true)
      await addComment(commentContent)
      setCommentContent("")
    } catch (err) {
      console.error("Failed to add comment:", err)
    } finally {
      setCommenting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p>Loading post...</p>
        </div>
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Empty>Post not found.</Empty>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <article className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-6 border-b border-gray-200 pb-4">
          {post.imageUrl && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img src={post.imageUrl} alt={post.title} className="h-64 w-full object-cover" />
            </div>
          )}
          <h1 className="text-balance text-3xl font-semibold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm">
                {post.author.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-1">
                ♥ {post.likesCount}
              </span>
              <span className="inline-flex items-center gap-1">
                💬 {post.commentsCount}
              </span>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Like Button */}
        {user && (
          <div className="mb-8 border-b border-gray-200 pb-6">
            <Button
              onClick={handleLike}
              disabled={liking}
              variant="outline"
              className="flex items-center gap-2"
            >
              ♥ {liking ? "Liking..." : `Like (${post.likesCount})`}
            </Button>
          </div>
        )}

        {/* Comments Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
          
          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleAddComment} className="mb-6 space-y-3">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                required
              />
              <Button type="submit" disabled={commenting}>
                {commenting ? "Adding..." : "Add Comment"}
              </Button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-white text-xs">
                      {comment.user.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </article>
    </>
  )
}