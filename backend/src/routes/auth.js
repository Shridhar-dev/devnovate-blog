import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

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

import { authenticate } from "../middleware/auth.js"
router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user })
})

export default router
