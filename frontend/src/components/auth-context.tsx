// auth-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type AuthContextType = {
  user: any
  token: string | null
  loading: boolean
  error: string
  signup: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>()
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const API_URL = "https://devnovate-blog-90vz.onrender.com/api/auth"

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  })

  const signup = async (name: string, email: string, password: string) => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")

      navigate("/login")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      if (data.token) {
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user || { email })
      }

      // Navigate based on user role
      if (data.user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      })
      const responseData = await res.json()
      if (!res.ok) throw new Error(responseData.error || "Update failed")

      setUser(responseData.user)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Delete failed")

      // Clear local state and redirect
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      navigate("/")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    navigate("/login")
  }

  // Auto-load user on refresh if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error("Error loading user:", err)
        // if token invalid, clear it
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchUser()
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      signup, 
      login, 
      logout, 
      updateProfile,
      deleteAccount 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}