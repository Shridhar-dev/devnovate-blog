// api/posts.ts
const API_BASE_URL = "http://localhost:3000/api"

export interface Post {
  _id: string
  title: string
  slug: string
  content: string
  imageUrl?: string
  author: {
    _id: string
    name: string
  }
  status: "pending" | "published" | "rejected" | "hidden"
  likesCount: number
  likedBy: string[]
  commentsCount: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  content: string
  user: {
    _id: string
    name: string
  }
  post: string
  createdAt: string
  updatedAt: string
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  // Posts API
  async getPosts(params?: { q?: string; page?: number; limit?: number; sort?: "latest" | "trending" }) {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.append("q", params.q)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.sort) searchParams.append("sort", params.sort)
    
    const response = await fetch(`${API_BASE_URL}/posts?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch posts")
    return response.json()
  }

  async getPostBySlug(slug: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch post")
    return response.json()
  }

  async getTrendingPosts() {
    const response = await fetch(`${API_BASE_URL}/posts/trending`)
    if (!response.ok) throw new Error("Failed to fetch trending posts")
    return response.json()
  }

  async getMyPosts(params?: { status?: string; page?: number; limit?: number; sort?: "latest" | "trending" }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.sort) searchParams.append("sort", params.sort)

    const response = await fetch(`${API_BASE_URL}/posts/mine?${searchParams}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch your posts")
    return response.json()
  }

  async createPost(post: { title: string; content: string; imageUrl?: string }) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(post)
    })
    if (!response.ok) throw new Error("Failed to create post")
    return response.json()
  }

  async updatePost(id: string, updates: { title?: string; content?: string; imageUrl?: string }) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error("Failed to update post")
    return response.json()
  }

  async deletePost(id: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to delete post")
    return response.json()
  }

  async likePost(id: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: "POST",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to like post")
    return response.json()
  }

  // Comments API
  async getComments(postId: string) {
    const response = await fetch(`${API_BASE_URL}/comments/${postId}`)
    if (!response.ok) throw new Error("Failed to fetch comments")
    return response.json()
  }

  async addComment(postId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content })
    })
    if (!response.ok) throw new Error("Failed to add comment")
    return response.json()
  }

  // Admin API
  async getPendingPosts() {
    const response = await fetch(`${API_BASE_URL}/admin/pending`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch pending posts")
    return response.json()
  }

  async approvePost(id: string) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/approve`, {
      method: "PATCH",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to approve post")
    return response.json()
  }

  async rejectPost(id: string) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/reject`, {
      method: "PATCH",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to reject post")
    return response.json()
  }

  async hidePost(id: string) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/hide`, {
      method: "PATCH",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to hide post")
    return response.json()
  }

  // Analytics API
  async getAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics`)
    if (!response.ok) throw new Error("Failed to fetch analytics")
    return response.json()
  }

  // Auth API
  async updateProfile(data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Failed to update profile")
    return response.json()
  }

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to delete account")
    return response.json()
  }
}

export const apiService = new ApiService()