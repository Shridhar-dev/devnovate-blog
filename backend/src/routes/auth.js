import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

const issueToken = (user) => {
  const payload = { id: user._id, role: user.role }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
  return token
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: "Email already in use" })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    let role = "user"
    if (isAdmin) role = "admin"
    else {
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      if (adminEmails.includes(email.toLowerCase())) role = "admin"
    }

    const user = await User.create({ name, email, password: hash, role })
    const token = issueToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: "Signup failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: "Missing fields" })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: "Invalid credentials" })
    const token = issueToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
})

router.patch("/me", authenticate, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Update basic profile fields
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim()
    }

    if (typeof email === "string" && email.trim() && email.trim().toLowerCase() !== user.email) {
      const exists = await User.findOne({ email: email.trim().toLowerCase() })
      if (exists) return res.status(400).json({ error: "Email already in use" })
      user.email = email.trim().toLowerCase()
    }

    // Handle password change if requested
    if (newPassword || currentPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Both currentPassword and newPassword are required" })
      }
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) return res.status(400).json({ error: "Current password is incorrect" })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    await user.save()
    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      message: "Profile updated",
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" })
  }
})

router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user })
})

router.delete("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    // Delete user's comments
    await Comment.deleteMany({ user: userId })

    // Find user's posts to delete their comments as well
    const myPosts = await Post.find({ author: userId }).select("_id")
    const myPostIds = myPosts.map((p) => p._id)
    if (myPostIds.length) {
      await Comment.deleteMany({ post: { $in: myPostIds } })
      await Post.deleteMany({ _id: { $in: myPostIds } })
    }

    // Remove user likes from posts and decrement likesCount accordingly
    await Post.updateMany({ likedBy: userId }, { $pull: { likedBy: userId }, $inc: { likesCount: -1 } })

    // Finally delete the user
    const user = await User.findByIdAndDelete(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" })
  }
})

export default router
