import { useState, useEffect, useCallback } from "react"
import { apiService, type Comment } from "../api/posts"

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!postId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getComments(postId)
      setComments(response.comments)
    } catch (err: any) {
      setError(err.message || "Failed to fetch comments")
    } finally {
      setLoading(false)
    }
  }, [postId])

  const addComment = async (content: string) => {
    try {
      setError(null)
      const response = await apiService.addComment(postId, content)
      fetchComments()
      return response.comment
    } catch (err: any) {
      setError(err.message || "Failed to add comment")
      throw err
    }
  }

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return { comments, loading, error, addComment, refetch: fetchComments }
}