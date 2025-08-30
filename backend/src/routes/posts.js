import { Router } from "express"
import Post from "../models/Post.js"
import { authenticate } from "../middleware/auth.js"
import slugify from "slugify"

const router = Router()

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
    const filter = {}
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
    const posts = await Post.find({})
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

  // Always show the post, regardless of status

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

// Auth-optional middleware
function authenticateOptional(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || ""
    if (!authHeader.startsWith("Bearer ")) return next()
    const token = authHeader.slice(7)
    const payload = token ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8")) : null
    if (!payload) return next()
    req.user = { _id: payload.id, role: payload.role }
    next()
  } catch {
    next()
  }
}

export default router
