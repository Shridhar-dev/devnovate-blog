"use client";

import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Devnovate
          </Link>
          <div className="flex gap-2">
            <NavLink to="/" className="px-3 py-1 text-sm rounded-lg hover:bg-muted transition-colors text-center">Home</NavLink>
            {user && (
              <NavLink to="/create" className="px-3 py-1 text-sm rounded-lg hover:bg-muted transition-colors text-center">Write</NavLink>
            )}
            {user && (
              <NavLink to="/profile" className="px-3 py-1 text-sm rounded-lg hover:bg-muted transition-colors text-center">Profile</NavLink>
            )}
            {user ? (
              <button onClick={onLogout} className="px-3 py-1 text-sm rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors text-center justify-center">Logout</button>
            ) : (
              <NavLink to="/login" className="px-3 py-1 text-sm rounded-lg hover:bg-muted transition-colors text-center">Login</NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 h-screen bg-background border-r border-border shadow-pretty animate-fade sticky top-0">
        <div className="flex flex-col h-full p-6 gap-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary font-serif mb-4 hover:text-indigo-700 transition-colors">
          Devnovate
        </Link>
        <Separator className="my-3" />
        <nav className="flex flex-col gap-2" aria-label="Main navigation">
          <NavLink to="/" className={({isActive}) => `px-4 py-2 rounded-xl font-medium transition-colors text-center ${isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'}`}>Home</NavLink>
          {user && (
            <NavLink to="/create" className={({isActive}) => `px-4 py-2 rounded-xl font-medium transition-colors text-center ${isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'}`}>Write</NavLink>
          )}
          {user && (
            <NavLink to="/profile" className={({isActive}) => `px-4 py-2 rounded-xl font-medium transition-colors text-center ${isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'}`}>Profile</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={({isActive}) => `px-4 py-2 rounded-xl font-medium transition-colors text-center ${isActive ? 'bg-accent text-white' : 'text-accent hover:bg-accent/10'}`}>Admin</NavLink>
          )}
          {user ? (
            <button onClick={onLogout} className="mt-2 px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-red-100 hover:text-red-600 transition-colors text-center justify-center w-full">Logout</button>
          ) : (
            <NavLink to="/login" className={({isActive}) => `px-4 py-2 rounded-xl font-medium transition-colors text-center ${isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'}`}>Login</NavLink>
          )}
        </nav>
        <div className="flex-grow" />
        <div className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Devnovate</div>
      </div>
    </aside>
    </>
  );
}
