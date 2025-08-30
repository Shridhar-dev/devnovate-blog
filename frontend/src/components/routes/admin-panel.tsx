import { useState } from "react"
import { useAdminPosts } from "@/hooks/useAdminPosts"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SectionTitle, Empty } from "../components"

export function AdminPostsPanel() {
  const { posts, loading, error, approvePost, rejectPost, hidePost } = useAdminPosts()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleAction = async (action: 'approve' | 'reject' | 'hide', postId: string) => {
    try {
      setActionLoading(postId)
      if (action === 'approve') await approvePost(postId)
      else if (action === 'reject') await rejectPost(postId)
      else if (action === 'hide') await hidePost(postId)
    } catch (err) {
      console.error(`Failed to ${action} post:`, err)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading pending posts...</div>
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <SectionTitle>Pending Posts ({posts.length})</SectionTitle>
      
      {posts.length === 0 ? (
        <Empty>No pending posts to review.</Empty>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post._id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      By {post.author.name} ({post.author.email}) • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction('approve', post._id)}
                      disabled={actionLoading === post._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === post._id ? "..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('reject', post._id)}
                      disabled={actionLoading === post._id}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {actionLoading === post._id ? "..." : "Reject"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('hide', post._id)}
                      disabled={actionLoading === post._id}
                    >
                      {actionLoading === post._id ? "..." : "Hide"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.length > 300 
                      ? post.content.substring(0, 300) + "..." 
                      : post.content 
                  }} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}