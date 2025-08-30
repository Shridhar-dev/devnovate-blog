"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../api"

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const data = await api("/auth/me", { token })
          setUser(data.user)
        }
      } catch {
        setToken("")
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const login = async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: { email, password } })
    setToken(data.token)
    localStorage.setItem("token", data.token)
    setUser(data.user)
  }
  const signup = async (name, email, password, isAdmin) => {
    const data = await api("/auth/signup", { method: "POST", body: { name, email, password, isAdmin } })
    setToken(data.token)
    localStorage.setItem("token", data.token)
    setUser(data.user)
  }
  const logout = () => {
    setToken("")
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, token, login, signup, logout, loading }}>{children}</AuthCtx.Provider>
}
