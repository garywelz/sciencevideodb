import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Science Video Database | CopernicusAI',
  description: 'Curated search experience for biology, chemistry, CS, mathematics, and physics videos - Part of CopernicusAI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

