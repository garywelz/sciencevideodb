import { NextRequest, NextResponse } from 'next/server'
import { getRecentVideosByDiscipline, getVideosByDiscipline } from '@scienceviddb/db'
import type { Discipline } from '@scienceviddb/shared'

/**
 * API route for fetching videos by discipline
 * GET /api/videos/[discipline]?days=30&limit=50
 */
export const runtime = 'nodejs'
export const revalidate = 3600 // Revalidate every hour

export async function GET(
  request: NextRequest,
  { params }: { params: { discipline: string } }
) {
  try {
    const { discipline } = params
    const searchParams = request.nextUrl.searchParams
    
    // Validate discipline
    const validDisciplines: Discipline[] = ['biology', 'chemistry', 'cs', 'mathematics', 'physics']
    if (!validDisciplines.includes(discipline as Discipline)) {
      return NextResponse.json(
        { error: `Invalid discipline: ${discipline}` },
        { status: 400 }
      )
    }

    // Get query parameters
    const days = parseInt(searchParams.get('days') || '30', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const recent = searchParams.get('recent') !== 'false'

    // Fetch videos
    const videos = recent
      ? await getRecentVideosByDiscipline(discipline as Discipline, days, limit)
      : await getVideosByDiscipline(discipline as Discipline, limit, 0)

    return NextResponse.json({
      videos,
      count: videos.length,
      discipline,
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

