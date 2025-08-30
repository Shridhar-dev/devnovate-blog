"use client"

import { useEffect, useState } from "react"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function AdminDashboard() {
  const { token } = useAuth()
  const [pending, setPending] = useState([])

  const load = async () => {
    const data = await api("/admin/pending", { token })
    setPending(data.posts || [])
  }
  useEffect(() => {
    load()
  }, [])

  const action = async (id, kind) => {
    const res = await api(`/admin/${id}/${kind}`, { method: "PATCH", token })
    await load()
    return res
  }

  return (
    <main className="container">
      <h1 className="title">Admin moderation</h1>
      <section className="section">
        <h2 className="subtitle">Pending</h2>
        <ul className="list">
          {pending.map((p) => (
            <li key={p._id} className="card">
              <div className="row">
                <strong>{p.title}</strong>
                <span className="muted">by {p.author?.name}</span>
                <Link className="link" to={`/post/${p.slug}`}>
                  View
                </Link>
              </div>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <Button onClick={() => action(p._id, "approve")} className="text-center justify-center">Approve</Button>
                <Button variant="outline" onClick={() => action(p._id, "reject")} className="text-center justify-center"> 
                  Reject
                </Button>
                <Button variant="outline" onClick={() => action(p._id, "hide")} className="text-center justify-center"> 
                  Hide
                </Button>
                <Button className="text-center justify-center"
                  variant="destructive"
                  onClick={async () => {
                    await api(`/admin/${p._id}`, { method: "DELETE", token })
                    load()
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {pending.length === 0 && <p className="muted">No pending posts.</p>}
        </ul>
      </section>
    </main>
  )
}
