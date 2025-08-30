import { Link } from "react-router-dom"

export default function PostCard({ post }) {
  const hasExcerpt = typeof post.content === "string" && post.content.length > 0
  const excerpt = hasExcerpt ? post.content.slice(0, 160) + (post.content.length > 160 ? "…" : "") : null

  return (
    <article className="card">
      <h3 className="card-title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h3>

      {excerpt ? <p className="muted">{excerpt}</p> : null}

      <div className="row">
        <span className="muted" aria-label="Author">
          By {post.author?.name || "Unknown"}
        </span>
        <span className="muted" aria-label="Published date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="muted" aria-label="Engagement">
          {post.likesCount} likes · {post.commentsCount} comments
        </span>
      </div>
    </article>
  )
}
