import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ error: "Unauthorized" })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select("_id name email role")
    if (!user) return res.status(401).json({ error: "Unauthorized" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin only" })
  next()
}

export const authenticateOptional = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || ""
    if (!authHeader.startsWith("Bearer ")) return next()
    const token = authHeader.slice(7)
    if (!token) return next()
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload) return next()
    req.user = { _id: payload.id, role: payload.role }
    next()
  } catch {
    next()
  }
}
