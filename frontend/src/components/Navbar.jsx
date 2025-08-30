"use client"

import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="container">
      <div className="nav">
        <Link to="/" className="brand">
          Devnovate
        </Link>
        <nav className="links">
          <NavLink to="/" className="link">
            Home
          </NavLink>
          {user && (
            <NavLink to="/create" className="link">
              Write
            </NavLink>
          )}
          {user && (
            <NavLink to="/profile" className="link">
              Profile
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="link">
              Admin
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" className="link">
                Login
              </NavLink>
              <NavLink to="/signup" className="link">
                Signup
              </NavLink>
            </>
          ) : (
            <button className="link button-inline" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
