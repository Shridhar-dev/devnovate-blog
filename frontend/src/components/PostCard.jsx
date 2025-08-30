import { Link } from "react-router-dom"

export default function PostCard({ post }) {
  const excerpt = (post.content || "").slice(0, 160)
  return (
    <article className="card">
      <h3 className="card-title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="muted">
        {excerpt}
        {post.content && post.content.length > 160 ? "…" : ""}
      </p>
      <div className="row">
        <span className="muted">By {post.author?.name || "Unknown"}</span>
        <span className="muted">{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="muted">
          {post.likesCount} likes · {post.commentsCount} comments
        </span>
      </div>
    </article>
  )
}
