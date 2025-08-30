import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "published", "rejected", "hidden"], default: "pending", index: true },
    likesCount: { type: Number, default: 0, index: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
)

postSchema.index({ title: "text", content: "text" })

export default mongoose.model("Post", postSchema)
