"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    const isAdmin = fd.get("isAdmin") === "on"
    try {
      await signup(fd.get("name"), fd.get("email"), fd.get("password"), isAdmin)
      nav("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="container narrow">
      <h1 className="title">Create account</h1>
      <form onSubmit={onSubmit} className="stack">
        {error && <p className="error">{error}</p>}
        <div style={{ marginBottom: 16 }}>
          <input name="name" required placeholder="Name" className="input" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input name="email" type="email" required placeholder="Email" className="input" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input name="password" type="password" required placeholder="Password" className="input" />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <input id="isAdmin" type="checkbox" name="isAdmin" style={{ marginRight: 10, width: 18, height: 18 }} />
          <label htmlFor="isAdmin" style={{ fontSize: 17, fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
            Sign up as <span style={{ color: '#3a86ff', fontWeight: 700 }}>admin</span>
          </label>
        </div>
        <button className="button">Sign up</button>
      </form>
      <p className="muted">
        Have an account?{" "}
        <Link to="/login" className="link">
          Log in
        </Link>
      </p>
    </main>
  )
}
