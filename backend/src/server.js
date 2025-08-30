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
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  }),
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

// Routes
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "devnovate-backend" }))
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/comments", commentRoutes)

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Devnovate] Error:", err)
  res.status(err.status || 500).json({ error: err.message || "Server Error" })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`[Devnovate] Server running on port ${port}`)
})
