import { Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import EditProfile from "./pages/EditProfile"
import EditPost from "./pages/EditPost"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        {/* Add gap between sidebar and content */}
        <div className="flex-1 pt-16 md:pt-0 ml-0 md:ml-8 lg:ml-12">
          <main className="animate-fade p-4">
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
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post/:slug/edit"
                element={
                  <ProtectedRoute>
                    <EditPost />
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
                  <div className="flex justify-center items-center min-h-[60vh] px-4">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
                      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
