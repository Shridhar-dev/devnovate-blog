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
    <main className="flex justify-center items-center min-h-[80vh] px-4 py-8 animate-fade">
      <Card className="w-full max-w-md shadow-pretty">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error && <p className="text-red-500 font-medium text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
            <Input 
              name="email" 
              type="email" 
              required 
              placeholder="Email" 
              className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
            />
            <Input 
              name="password" 
              type="password" 
              required 
              placeholder="Password" 
              className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-indigo-700 transition-colors text-center justify-center">
              Sign In
            </Button>
            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-indigo-700 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
