import Image from "next/image"
import Link from "next/link"
import { BlogHeader } from "@/components/blog-header"
import { PostCard } from "@/components/post-card"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Featured Post */}
        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="relative overflow-hidden md:col-span-2">
            <div className="relative aspect-[16/9]">
              <Image
                alt="Featured article cover"
                src="/featured-article-image.png"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            </div>
            <div className="space-y-3 p-5">
              <span className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                Editorial
              </span>
              <h2 className="text-pretty text-2xl font-semibold leading-tight md:text-3xl">
                Designing a Modern Editorial Blog with Next.js and shadcn/ui
              </h2>
              <p className="text-pretty text-sm text-muted-foreground md:text-base">
                A practical look at building a clean, accessible blog layout that balances readability and visual
                appeal.
              </p>
              <div className="flex items-center gap-3">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/posts/modern-editorial-blog">Read article</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/posts">All posts</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Sidebar />
          </div>
        </section>

        {/* Article Grid */}
        <section aria-label="Latest articles" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PostCard
            href="/posts/performance-ux"
            title="Performance and UX: Small Choices, Big Impact"
            excerpt="How micro-interactions, perceived speed, and thoughtful defaults shape great experiences."
            category="UX"
            imageAlt="Laptop with performance charts"
            imageSrc="/performance-charts.png"
          />
          <PostCard
            href="/posts/nextjs-routing"
            title="Rethinking App Router Patterns in 2025"
            excerpt="Practical routing patterns and file structure tips to scale your Next.js projects with clarity."
            category="Next.js"
            imageAlt="Code editor showing routes"
            imageSrc="/code-routes.png"
          />
          <PostCard
            href="/posts/product-thinking"
            title="Product Thinking for Engineers"
            excerpt="A simple framework to align engineering decisions with user value and business outcomes."
            category="Product"
            imageAlt="Sticky notes on a wall"
            imageSrc="/product-thinking.png"
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
