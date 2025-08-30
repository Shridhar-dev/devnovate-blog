"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  if (admin && user.role !== "admin") return <Navigate to="/" replace />
  return children
}
