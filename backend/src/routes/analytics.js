import { Router } from "express"
import Post from "../models/Post.js"
const router = Router()

router.get("/", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments()

    const totalComments = await Post.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: { $size: { $ifNull: ["$comments", []] } }
          }
        }
      }
    ])

    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt views")

    res.json({
      totalPosts,
      totalComments: totalComments[0]?.total || 0,
      recentPosts,
    })
  } catch (err) {
    console.error("Error fetching post analytics:", err)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
})

export default router
