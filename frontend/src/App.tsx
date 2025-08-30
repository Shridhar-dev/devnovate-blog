import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import HomePage from "./components/routes/home"
import BrowsePage from "./components/routes/browse"
import SearchPage from "./components/routes/search"
import PostPage from "./components/routes/post"
import WritePage from "./components/routes/write"
import ProfilePage from "./components/routes/profile"
import LoginPage from "./components/routes/login"
import SignupPage from "./components/routes/signup"
import AdminPage from "./components/routes/admin"
import { AuthProvider } from "./components/auth-context"
import { AdminPostsPanel } from "./components/routes/admin-panel"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/blogs" element={<AdminPostsPanel />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
