'use client'

import Link from 'next/link'

interface DisciplineCardProps {
  id: string
  name: string
  emoji: string
  color: string
  count: number
}

export default function DisciplineCard({ id, name, emoji, color, count }: DisciplineCardProps) {
  return (
    <Link
      href={`/discipline/${id}`}
      style={{
        padding: '1.5rem',
        border: `2px solid ${color}20`,
        borderRadius: '12px',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 8px 16px ${color}20`
        e.currentTarget.style.borderColor = color
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = `${color}20`
      }}
    >
      <span style={{ fontSize: '3rem' }}>{emoji}</span>
      <div>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          {name}
        </h3>
        <p style={{ 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          {count} recent videos
        </p>
      </div>
    </Link>
  )
}

