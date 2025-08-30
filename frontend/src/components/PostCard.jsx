import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
// Simple SVG icons
const LikeIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ff006e" : "none"} stroke="#ff006e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
)
const CommentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a86ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
)

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const hasExcerpt = typeof post.content === "string" && post.content.length > 0;
  const excerpt = hasExcerpt ? post.content.slice(0, 160) + (post.content.length > 160 ? "…" : "") : null;
  const { token, user } = useAuth();
  const [likes, setLikes] = useState(post.likesCount);
  const [liked, setLiked] = useState(
    !!(user && post.likedBy && Array.isArray(post.likedBy) && post.likedBy.some((u) => String(u) === String(user._id)))
  );
  const [comments, setComments] = useState(post.commentsCount);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState("");

  const handleLike = async () => {
    if (!token) return alert("Login to like posts.");
    try {
      const res = await api(`/posts/${post._id}/like`, { method: "POST", token });
      setLikes(res.likesCount);
      setLiked(res.liked);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login to comment.");
    if (!commentText.trim()) return;
    setCommenting(true);
    setError("");
    try {
      await api(`/comments/${post._id}`, { method: "POST", body: { content: commentText }, token });
      setComments((c) => c + 1);
      setCommentText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCommenting(false);
    }
  };

  // Prevent navigation when clicking inside a button or form
  const handleCardClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("form") ||
      e.target.tagName === "A"
    ) {
      return;
    }
    navigate(`/post/${post.slug}`);
  };

  return (
    <article
      className="card post-card"
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${post.title}`}
    >
      <h3 className="card-title post-card-title" style={{ textDecoration: 'underline' }}>{post.title}</h3>
      <div className="post-card-meta" style={{ margin: '4px 0 10px 0', fontSize: '0.98rem', color: '#6b7280', display: 'flex', gap: 16 }}>
        <span><strong>Author:</strong> {post.author?.name || "Unknown"}</span>
        <span><strong>Publish date:</strong> {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      {excerpt ? <p className="muted post-card-excerpt">{excerpt}</p> : null}
      <div className="post-card-actions">
        <button
          className="button"
          style={{ minWidth: 44, padding: 8, display: "flex", alignItems: "center", justifyContent: "center", background: '#fff', border: '1px solid #eee' }}
          onClick={handleLike}
          disabled={!token}
          title={liked ? "Unlike" : "Like"}
        >
          <LikeIcon filled={liked} />
        </button>
        <span style={{ color: "#ff006e", fontWeight: 500 }}>{likes}</span>
        <button
          className="button"
          type="button"
          style={{ minWidth: 44, padding: 8, display: "flex", alignItems: "center", justifyContent: "center", background: '#fff', border: '1px solid #eee' }}
          tabIndex={-1}
          disabled
          title="Comments"
        >
          <CommentIcon />
        </button>
        <span style={{ color: "#3a86ff", fontWeight: 500 }}>{comments}</span>
      </div>
      <form onClick={e => e.stopPropagation()} onSubmit={handleComment} className="post-card-comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="input"
          style={{ flex: 1 }}
          disabled={commenting}
        />
        <button className="button" type="submit" disabled={commenting || !commentText.trim()}>
          Post
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </article>
  );
}

// ...existing code...
