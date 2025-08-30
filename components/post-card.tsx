import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PostCardProps = {
  href: string
  imageAlt: string
  title: string
  excerpt: string
  category?: string
  imageSrc?: string
}

export function PostCard({
  href,
  imageAlt,
  title,
  excerpt,
  category = "General",
  imageSrc = "/blog-article-cover.png",
}: PostCardProps) {
  return (
    <Card className="h-full overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] w-full">
          <Image
            alt={imageAlt}
            src={imageSrc || "/placeholder.svg"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
        <div className="space-y-2 p-4">
          <span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {category}
          </span>
          <h3 className="text-balance text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{excerpt}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="link" className="px-0 text-primary">
          <Link href={href} aria-label={`Read more: ${title}`}>
            Read more →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
