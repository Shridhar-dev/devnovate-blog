import { useState, useEffect, useCallback } from "react"
import { apiService } from "../api/posts"

interface PendingPost {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
}

export function useAdminPosts() {
  const [posts, setPosts] = useState<PendingPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getPendingPosts()
      setPosts(response.posts)
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending posts")
    } finally {
      setLoading(false)
    }
  }, [])

  const approvePost = async (id: string) => {
    try {
      await apiService.approvePost(id)
      setPosts(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to approve post")
      throw err
    }
  }

  const rejectPost = async (id: string) => {
    try {
      await apiService.rejectPost(id)
      setPosts(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to reject post")
      throw err
    }
  }

  const hidePost = async (id: string) => {
    try {
      await apiService.hidePost(id)
      setPosts(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to hide post")
      throw err
    }
  }

  useEffect(() => {
    fetchPendingPosts()
  }, [fetchPendingPosts])

  return { 
    posts, 
    loading, 
    error, 
    approvePost, 
    rejectPost, 
    hidePost, 
    refetch: fetchPendingPosts 
  }
}