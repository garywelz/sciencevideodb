/**
 * Discipline Feed Page
 * 
 * Displays recent videos for a specific discipline
 * Auto-updates via Next.js revalidation
 */

import { getRecentVideosByDiscipline } from '@scienceviddb/db'
import type { Discipline, VideoRecord } from '@scienceviddb/shared'
import Link from 'next/link'
import VideoCard from './VideoCard'

interface PageProps {
  params: {
    discipline: string
  }
}

// Revalidate every hour to show fresh content
export const revalidate = 3600

const disciplineNames: Record<string, string> = {
  biology: 'Biology',
  chemistry: 'Chemistry',
  cs: 'Computer Science',
  mathematics: 'Mathematics',
  physics: 'Physics',
}

export default async function DisciplineFeedPage({ params }: PageProps) {
  const { discipline } = params
  
  // Validate discipline
  const validDisciplines: Discipline[] = ['biology', 'chemistry', 'cs', 'mathematics', 'physics']
  if (!validDisciplines.includes(discipline as Discipline)) {
      return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1>Invalid Discipline</h1>
          <p>The discipline &quot;{discipline}&quot; is not valid.</p>
          <Link href="/">← Back to Home</Link>
        </main>
      )
  }
  
  // Get recent videos from last 30 days
  const videos = await getRecentVideosByDiscipline(discipline as Discipline, 30, 50)
  
  return (
    <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/"
          style={{ 
            color: '#666', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            display: 'inline-block'
          }}
        >
          ← Back to Home
        </Link>
        <h1 style={{ 
          textTransform: 'capitalize', 
          marginTop: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          {disciplineNames[discipline]} Videos
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          {videos.length} recent videos from the last 30 days
        </p>
      </div>
      
      {videos.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center',
          border: '1px dashed #ddd',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            No recent videos found. Check back soon!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </main>
  )
}


