"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    try {
      await login(fd.get("email"), fd.get("password"))
      nav("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="container narrow">
      <h1 className="title">Login</h1>
      <form onSubmit={onSubmit} className="stack">
        {error && <p className="error">{error}</p>}
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
        <button className="button">Login</button>
      </form>
      <p className="muted">
        No account?{" "}
        <Link to="/signup" className="link">
          Sign up
        </Link>
      </p>
    </main>
  )
}
