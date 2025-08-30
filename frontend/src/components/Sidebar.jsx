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
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar-inner">
        <Link to="/" className="brand sidebar-brand">
          Devnovate
        </Link>

        <Separator className="my-3" />

        <nav className="sidebar-nav" aria-label="Main navigation">
          <Button variant="ghost" asChild>
            <NavLink to="/" className="sidebar-link">
              Home
            </NavLink>
          </Button>

          {user && (
            <Button variant="ghost" asChild>
              <NavLink to="/create" className="sidebar-link">
                Write
              </NavLink>
            </Button>
          )}

          {user && (
            <Button variant="ghost" asChild>
              <NavLink to="/profile" className="sidebar-link">
                Profile
              </NavLink>
            </Button>
          )}

          {user?.role === "admin" && (
            <Button variant="ghost" asChild>
              <NavLink to="/admin" className="sidebar-link">
                Admin
              </NavLink>
            </Button>
          )}

          {!user ? (
            <>
              <Button variant="outline" asChild>
                <NavLink to="/login" className="sidebar-link">
                  Login
                </NavLink>
              </Button>
              <Button variant="default" asChild>
                <NavLink to="/signup" className="sidebar-link">
                  Signup
                </NavLink>
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </aside>
  );
}
