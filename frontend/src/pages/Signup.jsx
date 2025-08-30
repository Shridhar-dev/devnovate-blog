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
    try {
      await signup(fd.get("name"), fd.get("email"), fd.get("password"))
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
        <input name="name" required placeholder="Name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
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
