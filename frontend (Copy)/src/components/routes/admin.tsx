"use client"

import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/auth-context"
import AdminLayout from "../admin-layout"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionTitle } from "../components"

interface Analytics {
  totalPosts: number
  totalComments: number
  totalViews: number
  postsByDate: { _id: string; count: number }[]
  viewsByDate: { _id: string; totalViews: number }[]
  recentPosts: { _id: string; title: string; createdAt: string; views: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null)

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user===null) {
      navigate("/login")
    }
  }, [user, loading, navigate])


  useEffect(() => {
    const API_URL = "http://localhost:3000/api"
    fetch(`${API_URL}/analytics`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching analytics:", err))
  }, [])

  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  
  if (!user) return null 
  if (!data) return <p className="text-center py-10">Loading analytics...</p>
  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <p className="text-left text-3xl font-semibold">Welcome back {user.name} 👋</p>

      <SectionTitle>Analytics</SectionTitle>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalPosts}</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle>Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalComments}</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalViews}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle>Posts Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.postsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xs rounded-2xl">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.viewsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalViews" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Table */}
      <Card className="shadow-xs rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentPosts?.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{post.views}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  )
}
