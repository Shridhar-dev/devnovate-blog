import { Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route
          path="*"
          element={
            <main className="container">
              <h1 className="title">Not found</h1>
            </main>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
