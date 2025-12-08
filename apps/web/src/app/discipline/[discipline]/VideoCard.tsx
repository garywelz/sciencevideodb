'use client'

import type { VideoRecord } from '@scienceviddb/shared'

export default function VideoCard({ video }: { video: VideoRecord }) {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: '#fff',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {video.thumbnailUrl && (
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#f0f0f0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {video.duration && (
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}>
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1rem',
          lineHeight: '1.4',
          fontWeight: '600',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: '#1a1a1a',
        }}>
          {video.title}
        </h3>
        <p style={{ 
          margin: '0.5rem 0', 
          fontSize: '0.875rem', 
          color: '#666',
          fontWeight: '500'
        }}>
          {video.channelName}
        </p>
        <p style={{ 
          margin: '0.25rem 0 0 0', 
          fontSize: '0.8rem', 
          color: '#999' 
        }}>
          {new Date(video.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
    </a>
  )
}

