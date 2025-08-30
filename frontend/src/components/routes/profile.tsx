// routes/profile.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth-context"
import { useMyPosts } from "@/hooks/usePosts"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SectionTitle, Empty } from "../components"
import AdminLayout from "../admin-layout"

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount, loading } = useAuth()
  const { posts } = useMyPosts()
  const navigate = useNavigate()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
   
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user, loading, navigate])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate password confirmation if changing password
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      setUpdating(true)
      const updateData: any = { name, email }
      
      if (newPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }
      
      await updateProfile(updateData)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount()
      } catch (err: any) {
        setError(err.message || "Failed to delete account")
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    )
  }


  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <SectionTitle>Profile Settings</SectionTitle>

        {/* Profile Update Form */}
        <div className="mt-6 space-y-8">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Change Password (optional)</h4>
                <div className="space-y-3">
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                  />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Posts Summary */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Your Posts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {posts.filter(p => p.status === 'published').length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {posts.reduce((sum, p) => sum + p.likesCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {posts.reduce((sum, p) => sum + p.commentsCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </div>
            </div>
            <Button onClick={() => navigate("/write")}>
              Write New Post
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. This will permanently delete your account and all your posts.
            </p>
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}