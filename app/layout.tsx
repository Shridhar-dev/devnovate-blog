import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google" // use Manrope for body text
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans" // add Geist Sans for headings
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Devnovate Blog",
  description: "A professional, clean editorial blog experience.",
  generator: "v0.app",
}

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased ${GeistSans.variable} ${GeistMono.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
