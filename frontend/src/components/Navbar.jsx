"use client"

import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="container">
      <div className="nav">
        <Link to="/" className="brand" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Devnovate
        </Link>
        <nav className="links">
          <Button variant="ghost" asChild>
            <NavLink to="/" className="link">
              Home
            </NavLink>
          </Button>

          {user && (
            <Button variant="ghost" asChild>
              <NavLink to="/create" className="link">
                Write
              </NavLink>
            </Button>
          )}

          {user && (
            <Button variant="ghost" asChild>
              <NavLink to="/profile" className="link">
                Profile
              </NavLink>
            </Button>
          )}

          {user?.role === "admin" && (
            <Button variant="ghost" asChild>
              <NavLink to="/admin" className="link">
                Admin
              </NavLink>
            </Button>
          )}

          {!user ? (
            <>
              <Button variant="outline" asChild>
                <NavLink to="/login" className="link">
                  Login
                </NavLink>
              </Button>
              <Button variant="default" asChild>
                <NavLink to="/signup" className="link">
                  Signup
                </NavLink>
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
