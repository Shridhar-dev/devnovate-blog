"use client"

import type React from "react"

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-700">{children}</span>
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight text-left">{children}</h2>
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded border border-dashed border-gray-200 p-6 text-center text-gray-500">{children}</div>
}

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-gray-400" />
      {label}
    </div>
  )
}
