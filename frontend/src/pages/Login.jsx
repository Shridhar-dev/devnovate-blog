"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"

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
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="stack" style={{ display: "grid", gap: 12 }}>
            {error && <p className="error">{error}</p>}
            <Input name="email" type="email" required placeholder="Email" />
            <Input name="password" type="password" required placeholder="Password" />
          </CardContent>
          <CardFooter style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button type="submit">Login</Button>
            <span className="muted" style={{ marginLeft: 8 }}>
              No account?{" "}
              <Link to="/signup" className="link">
                Sign up
              </Link>
            </span>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
