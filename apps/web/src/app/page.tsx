import Link from 'next/link'
import { getRecentVideosByDiscipline } from '@scienceviddb/db'
import type { Discipline } from '@scienceviddb/shared'
import DisciplineCard from './components/DisciplineCard'

const disciplines: Array<{ id: Discipline; name: string; emoji: string; color: string }> = [
  { id: 'biology', name: 'Biology', emoji: '🧬', color: '#10b981' },
  { id: 'chemistry', name: 'Chemistry', emoji: '⚗️', color: '#3b82f6' },
  { id: 'cs', name: 'Computer Science', emoji: '💻', color: '#8b5cf6' },
  { id: 'mathematics', name: 'Mathematics', emoji: '📐', color: '#f59e0b' },
  { id: 'physics', name: 'Physics', emoji: '⚛️', color: '#ef4444' },
]

export const dynamic = 'force-dynamic' // Force dynamic rendering - no static generation
export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  // Get video counts for each discipline
  // Skip database calls during build - will fetch at runtime
  let disciplineCounts = disciplines.map(d => ({ ...d, count: 0 }))
  
  // Only fetch if not in build environment
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    try {
      disciplineCounts = await Promise.all(
        disciplines.map(async (d) => {
          try {
            const videos = await getRecentVideosByDiscipline(d.id, 30, 1)
            return { ...d, count: videos.length }
          } catch (error) {
            // If database query fails, return 0 count
            console.error(`Failed to fetch videos for ${d.id}:`, error)
            return { ...d, count: 0 }
          }
        })
      )
    } catch (error) {
      // If all queries fail, use default counts
      console.error('Failed to fetch video counts:', error)
    }
  }

  return (
    <main>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <a 
              href="https://copernicusai.fyi"
              style={{
                fontSize: '0.9rem',
                color: '#666',
                textDecoration: 'none',
              }}
            >
              ← Part of CopernicusAI
            </a>
          </div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Science Video Database
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#666',
            marginTop: '0.5rem'
          }}>
            Curated search experience for technical science enthusiasts
          </p>
        </header>
        
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#1a1a1a'
          }}>
            Browse by Discipline
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem',
            marginTop: '1rem' 
          }}>
            {disciplineCounts.map((discipline) => (
              <DisciplineCard
                key={discipline.id}
                id={discipline.id}
                name={discipline.name}
                emoji={discipline.emoji}
                color={discipline.color}
                count={discipline.count}
              />
            ))}
          </div>
        </section>

        <section style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1a1a1a'
          }}>
            About
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Science Video Database is a curated collection of high-quality science videos from YouTube. 
            We index videos from trusted channels across biology, chemistry, computer science, mathematics, and physics. 
            Each video includes metadata, transcripts, and searchable content to help you find exactly what you&apos;re looking for.
          </p>
        </section>
      </div>
    </main>
  )
}

