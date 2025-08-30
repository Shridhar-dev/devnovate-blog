"use client"

import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full bg-white shadow-pretty sticky top-0 z-30 animate-fade px-2 md:px-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4 md:py-3">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary font-serif hover:text-indigo-700 transition-colors">
          Devnovate
        </Link>
        <nav className="flex gap-2 items-center">
          <NavLink to="/" className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-muted transition-colors">Home</NavLink>
          {user && (
            <NavLink to="/create" className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-muted transition-colors">Write</NavLink>
          )}
          {user && (
            <NavLink to="/profile" className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-muted transition-colors">Profile</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="px-4 py-2 rounded-xl font-medium text-accent hover:bg-accent/10 transition-colors">Admin</NavLink>
          )}
          {user ? (
            <button onClick={logout} className="ml-2 px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-red-100 hover:text-red-600 transition-colors text-center justify-center">Logout</button>
          ) : (
            <NavLink to="/login" className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-muted transition-colors">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

