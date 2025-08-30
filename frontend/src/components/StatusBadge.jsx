import { Badge } from "./ui/badge"

export default function StatusBadge({ status = "pending" }) {
  const map = {
    published: { bg: "var(--foreground)", fg: "var(--background)" },
    pending: { bg: "rgba(17,24,39,0.08)", fg: "var(--foreground)" },
    rejected: { bg: "rgba(245, 158, 11, 0.2)", fg: "var(--foreground)" },
    hidden: { bg: "rgba(17,24,39,0.08)", fg: "var(--foreground)" },
  }
  const s = map[status] || map.pending

  const variantMap = {
    published: "default", // solid neutral
    pending: "outline", // outline neutral
    rejected: "secondary", // subtle neutral
    hidden: "outline",
  }
  const variant = variantMap[status] || "outline"

  return (
    <Badge variant={variant} aria-label={`status ${status}`} style={{ background: s.bg, color: s.fg }}>
      {status}
    </Badge>
  )
}
