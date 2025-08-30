"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"

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
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="stack" style={{ display: "grid", gap: 12 }}>
            {error && <p className="error">{error}</p>}
            <Input name="name" required placeholder="Name" />
            <Input name="email" type="email" required placeholder="Email" />
            <Input name="password" type="password" required placeholder="Password" />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Checkbox id="isAdmin" name="isAdmin" />
              <Label htmlFor="isAdmin">Sign up as admin</Label>
            </div>
          </CardContent>
          <CardFooter style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button type="submit">Sign up</Button>
            <span className="muted">
              Have an account?{" "}
              <Link to="/login" className="link">
                Log in
              </Link>
            </span>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
