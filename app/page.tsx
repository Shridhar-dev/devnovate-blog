export default function Page() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <header className="mb-6 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-sans">Devnovate — MERN Blogging Platform</h1>
        <p className="text-sm text-neutral-600">Minimal black & white. User submissions with admin approval.</p>
      </header>

      <section className="space-y-3">
        <p className="text-pretty">
          The full MERN app is scaffolded under <code className="px-1 border">/backend</code> and{" "}
          <code className="px-1 border">/frontend</code>. This Next.js page exists only to satisfy the preview and to
          confirm the project structure.
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>
            Backend: Express + MongoDB + JWT at <code className="px-1 border">/backend</code>
          </li>
          <li>
            Frontend: Vite + React at <code className="px-1 border">/frontend</code>
          </li>
          <li>See README.md for local setup and deployment instructions.</li>
        </ul>
        <div className="mt-4 rounded border p-3 text-sm">
          <strong>Next steps</strong>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Backend: cd backend → npm install → set .env → npm run dev</li>
            <li>Frontend: cd frontend → npm install → set VITE_API_URL → npm run dev</li>
            <li>Deploy: Netlify (frontend) + Render/Heroku (backend)</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
