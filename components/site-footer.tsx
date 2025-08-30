export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} Devnovate. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <a className="hover:text-accent" href="#privacy">
            Privacy
          </a>
          <a className="hover:text-accent" href="#terms">
            Terms
          </a>
          <a className="hover:text-accent" href="#twitter" aria-label="Twitter">
            Twitter
          </a>
        </nav>
      </div>
    </footer>
  )
}
