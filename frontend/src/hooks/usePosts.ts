// hooks/usePosts.ts
import { useState, useEffect, useCallback } from "react"
import { apiService, type Post } from "../api/posts"

export function usePosts(params?: { q?: string; page?: number; limit?: number; sort?: "latest" | "trending" }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0 })

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getPosts(params)
      setPosts(response.posts)
      setPagination({ page: response.page, total: response.total })
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, loading, error, pagination, refetch: fetchPosts }
}

export function useTrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTrendingPosts()
      setPosts(response.posts)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trending posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  return { posts, loading, error, refetch: fetchTrending }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getPostBySlug(slug)
      setPost(response.post)
    } catch (err: any) {
      setError(err.message || "Post not found")
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPost()
  }, [])

  return { post, loading, error, refetch: fetchPost }
}

export function useMyPosts(params?: { status?: string; page?: number; limit?: number; sort?: "latest" | "trending" }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0 })

  const fetchMyPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getMyPosts(params)
      setPosts(response.posts)
      setPagination({ page: response.page, total: response.total })
    } catch (err: any) {
      setError(err.message || "Failed to fetch your posts")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchMyPosts()
  }, [fetchMyPosts])

  return { posts, loading, error, pagination, refetch: fetchMyPosts }
}

export function usePostActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = async (post: { title: string; content: string; imageUrl?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.createPost(post)
      return response.post
    } catch (err: any) {
      setError(err.message || "Failed to create post")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id: string, updates: { title?: string; content?: string; imageUrl?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.updatePost(id, updates)
      return response.post
    } catch (err: any) {
      setError(err.message || "Failed to update post")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiService.deletePost(id)
      return true
    } catch (err: any) {
      setError(err.message || "Failed to delete post")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const likePost = async (id: string) => {
    try {
      const response = await apiService.likePost(id)
      return response
    } catch (err: any) {
      setError(err.message || "Failed to like post")
      throw err
    }
  }

  return { createPost, updatePost, deletePost, likePost, loading, error }
}
