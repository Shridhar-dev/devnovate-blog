import { Router } from "express"
import { authenticate } from "../middleware/auth.js"
import Comment from "../models/Comment.js"
import Post from "../models/Post.js"

const router = Router()

// list comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params
    const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 }).populate("user", "name")
    res.json({ comments })
  } catch (err) {
    res.status(500).json({ error: "Failed to list comments" })
  }
})

// add a comment to a published post
router.post("/:postId", authenticate, async (req, res) => {
  try {
    const { postId } = req.params
    const { content } = req.body
    if (!content) return res.status(400).json({ error: "Missing content" })
    const post = await Post.findById(postId)
    if (!post || post.status !== "published") return res.status(400).json({ error: "Cannot comment on this post" })

    const comment = await Comment.create({ post: postId, user: req.user._id, content })
    post.commentsCount += 1
    await post.save()
    res.status(201).json({ comment })
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" })
  }
})

export default router
