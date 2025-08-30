// routes/admin.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { apiService } from "@/api/posts"
import AdminLayout from "../admin-layout"
import { AdminPostsPanel } from "./admin-panel"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionTitle } from "../components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

interface Analytics {
  totalPosts: number
  totalComments: number
  recentPosts: { _id: string; title: string; createdAt: string; views?: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiService.getAnalytics()
        setData(response)
      } catch (err) {
        console.error("Error fetching analytics:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user?.role === 'admin') {
      fetchAnalytics()
    }
  }, [user])

  if (authLoading || loading || user === undefined) {
    return (
      <AdminLayout>
        <div className="h-screen flex items-center justify-center">
          <p>You have to be an Admin to access this page</p>
        </div>
      </AdminLayout>
    )
  }

  if (!user || user?.role !== 'admin') {
    return null
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-center py-10">Failed to load analytics data.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <p className="text-left text-3xl font-semibold">Welcome back {user.name} 👋</p>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <SectionTitle>Analytics Overview</SectionTitle>
            
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
                  <CardTitle>Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">-</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
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
                        <TableCell>{post.views || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <AdminPostsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}