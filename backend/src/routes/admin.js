import { Router } from "express"
import { authenticate, requireAdmin } from "../middleware/auth.js"
import Post from "../models/Post.js"

const router = Router()
router.use(authenticate, requireAdmin)

// List pending posts
router.get("/pending", async (_req, res) => {
  try {
    const posts = await Post.find({ status: "pending" }).sort({ createdAt: 1 }).populate("author", "name email")
    res.json({ posts })
  } catch (err) {
    res.status(500).json({ error: "Failed to list pending posts" })
  }
})

router.patch("/:id/approve", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: "published" }, { new: true })
    if (!post) return res.status(404).json({ error: "Not found" })
    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to approve" })
  }
})

router.patch("/:id/reject", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })
    if (!post) return res.status(404).json({ error: "Not found" })
    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to reject" })
  }
})

router.patch("/:id/hide", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: "hidden" }, { new: true })
    if (!post) return res.status(404).json({ error: "Not found" })
    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to hide" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ error: "Not found" })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" })
  }
})

export default router
