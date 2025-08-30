import { Router } from "express"
import Post from "../models/Post.js"
import { authenticate, authenticateOptional } from "../middleware/auth.js"
import slugify from "slugify"
import Comment from "../models/Comment.js"

const router = Router()

// Admin: Approve a blog post (set status to published)
router.post("/:id/approve", authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" })
    }
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    post.status = "published"
    await post.save()
    res.json({ success: true, post })
  } catch (err) {
    res.status(500).json({ error: "Failed to approve post" })
  }
})

// helper to ensure unique slugs
const uniqueSlug = async (title) => {
  const base = slugify(title, { lower: true, strict: true })
  let slug = base || `post-${Date.now()}`
  let i = 1
  while (await Post.findOne({ slug })) {
    slug = `${base}-${i++}`
  }
  return slug
}

// Create a post (users => pending, admins => published)
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body
    if (!title || !content) return res.status(400).json({ error: "Missing title or content" })
    const slug = await uniqueSlug(title)
    const status = req.user.role === "admin" ? "published" : "pending"
    const post = await Post.create({ title, content, slug, author: req.user._id, status, imageUrl })
    res.status(201).json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" })
  }
})

// List posts (published only unless admin querying with status)
router.get("/", async (req, res) => {
  try {
    const { q, page = 1, limit = 10, sort = "latest" } = req.query
    const filter = { status: "published" }
    if (q) {
      filter.$text = { $search: q }
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Math.min(Number(limit), 50),
      sort: sort === "trending" ? { likesCount: -1, commentsCount: -1, createdAt: -1 } : { createdAt: -1 },
    }

    const posts = await Post.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .select("title slug createdAt likesCount commentsCount likedBy imageUrl")
      .populate("author", "name")

    const total = await Post.countDocuments(filter)
    res.json({ posts, page: Number(page), total })
  } catch (err) {
    res.status(500).json({ error: "Failed to list posts" })
  }
})

// Trending shortcut
router.get("/trending", async (_req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .sort({ likesCount: -1, commentsCount: -1, createdAt: -1 })
      .limit(3)
      .select("title slug createdAt likesCount commentsCount likedBy imageUrl")
      .populate("author", "name")
    res.json({ posts })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending" })
  }
})

// Add per-user posts endpoint (profile page)
router.get("/mine", authenticate, async (req, res) => {
  try {
    let { sort = "latest", status = "all", page = 1, limit = 10 } = req.query
    limit = Math.max(1, Math.min(Number(limit), 50))

    const filter = {
      author: req.user._id,
      ...(status === "all" ? {} : { status }),
    }

    const skip = (Number(page) - 1) * limit
    const sortObj = sort === "trending" ? { likesCount: -1, commentsCount: -1, createdAt: -1 } : { createdAt: -1 }
    const posts = await Post.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select("title slug createdAt likesCount commentsCount imageUrl") // keep list lightweight
      .populate("author", "name")

    const total = await Post.countDocuments(filter)
    res.json({ posts, page: Number(page), total })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your posts" })
  }
})

// Get single post by slug
router.get("/:slug", authenticateOptional, async (req, res) => {
  try {
    const { slug } = req.params
    const post = await Post.findOne({ slug }).populate("author", "name _id").lean()
    if (!post) return res.status(404).json({ error: "Not found" })
    // Only allow viewing if published, or if admin
    if (post.status !== "published") {
      const viewer = req.user
      if (!viewer || viewer.role !== "admin") {
        return res.status(404).json({ error: "Not found" })
      }
    }
    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" })
  }
})

// Like / Unlike
router.post("/:id/like", authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    // Allow likes on all posts, not just published

    const hasLiked = post.likedBy.some((u) => String(u) === String(userId))
    if (hasLiked) {
      post.likedBy = post.likedBy.filter((u) => String(u) !== String(userId))
      post.likesCount = Math.max(0, post.likesCount - 1)
    } else {
      post.likedBy.push(userId)
      post.likesCount += 1
    }
    await post.save()
    res.json({ likesCount: post.likesCount, liked: !hasLiked })
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" })
  }
})

// Edit a post (author or admin). Authors cannot edit published posts.
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, imageUrl } = req.body
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const isOwner = String(post.author) === String(req.user._id)
    const isAdmin = req.user.role === "admin"
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" })

    // Authors cannot edit published posts; admins can.
    if (post.status === "published" && !isAdmin) {
      return res.status(400).json({ error: "Published posts cannot be edited by the author" })
    }

    // Update fields
    if (typeof title === "string" && title.trim()) {
      // Only regenerate slug when NOT published to keep URLs stable
      if (post.status !== "published") {
        post.slug = await uniqueSlug(title.trim())
      }
      post.title = title.trim()
    }
    if (typeof content === "string" && content.trim()) {
      post.content = content.trim()
    }
    if (typeof imageUrl === "string") {
      post.imageUrl = imageUrl
    }

    await post.save()
    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: "Failed to edit post" })
  }
})

// Delete a post (author or admin). Also delete related comments.
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ error: "Post not found" })

    const isOwner = String(post.author) === String(req.user._id)
    const isAdmin = req.user.role === "admin"
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" })

    await Comment.deleteMany({ post: id })
    await Post.findByIdAndDelete(id)
    res.json({ message: "Post deleted" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" })
  }
})

export default router
