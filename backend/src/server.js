import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import adminRoutes from "./routes/admin.js"
import commentRoutes from "./routes/comments.js"

const app = express()

// Middleware
app.use(express.json({ limit: "1mb" }))
app.use(
  cors(
    (() => {
      const allowed = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      // If specific origins are configured, allow credentials for those origins.
      // Otherwise allow all origins but disable credentials (safer default).
      return allowed.length ? { origin: allowed, credentials: true } : { origin: true, credentials: false }
    })(),
  ),
)
app.use(morgan("dev"))

// MongoDB
const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
  console.error("[Devnovate] MONGO_URI is missing in environment.")
  process.exit(1)
}
mongoose
  .connect(mongoUri, { dbName: "devnovate" })
  .then(() => console.log("[Devnovate] MongoDB connected"))
  .catch((err) => {
    console.error("[Devnovate] MongoDB connection error:", err.message)
    process.exit(1)
  })

// Ensure JWT secret exists on boot so auth is reliable
if (!process.env.JWT_SECRET) {
  console.error("[Devnovate] JWT_SECRET is missing in environment.")
  process.exit(1)
}

// Routes
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "devnovate-backend" }))
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/comments", commentRoutes)

// Not-found handler
app.use((req, res, next) => {
  if (res.headersSent) return next()
  return res.status(404).json({ error: "Not found" })
})

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Devnovate] Error:", err)
  const status = err.status || 500
  const message = err.message || "Server Error"
  const payload = process.env.NODE_ENV === "production" ? { error: message } : { error: message, stack: err.stack }
  res.status(status).json(payload)
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`[Devnovate] Server running on port ${port}`)
})
