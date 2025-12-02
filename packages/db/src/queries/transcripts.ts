/**
 * Transcript segment queries
 */

import { query } from '../client'
import { rowToTranscriptSegment, type TranscriptSegmentRow } from '../models'
import type { TranscriptSegment } from '@scienceviddb/shared'

/**
 * Get transcript segments for a video
 */
export async function getTranscriptSegments(videoId: string): Promise<TranscriptSegment[]> {
  const result = await query<TranscriptSegmentRow>(
    `SELECT * FROM transcript_segments 
     WHERE video_id = $1 
     ORDER BY start_time ASC`,
    [videoId]
  )
  
  return result.rows.map(rowToTranscriptSegment)
}

/**
 * Insert transcript segments for a video
 */
export async function insertTranscriptSegments(
  videoId: string,
  segments: Array<{
    text: string
    startTime: number
    endTime: number
    confidence?: number
  }>
): Promise<TranscriptSegment[]> {
  if (segments.length === 0) {
    return []
  }

  // Delete existing segments first
  await query(
    `DELETE FROM transcript_segments WHERE video_id = $1`,
    [videoId]
  )

  // Insert new segments
  const values: unknown[] = []
  const placeholders: string[] = []
  
  segments.forEach((segment, index) => {
    const baseIndex = index * 5
    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`
    )
    values.push(
      videoId,
      segment.text,
      segment.startTime,
      segment.endTime,
      segment.confidence || null
    )
  })

  const result = await query<TranscriptSegmentRow>(
    `INSERT INTO transcript_segments (video_id, text, start_time, end_time, confidence)
     VALUES ${placeholders.join(', ')}
     RETURNING *`,
    values
  )

  return result.rows.map(rowToTranscriptSegment)
}

/**
 * Delete transcript segments for a video
 */
export async function deleteTranscriptSegments(videoId: string): Promise<void> {
  await query(
    `DELETE FROM transcript_segments WHERE video_id = $1`,
    [videoId]
  )
}

/**
 * Search transcript segments by text
 */
export async function searchTranscriptSegments(
  searchText: string,
  limit: number = 50
): Promise<TranscriptSegment[]> {
  const result = await query<TranscriptSegmentRow>(
    `SELECT * FROM transcript_segments 
     WHERE text ILIKE $1
     ORDER BY start_time ASC
     LIMIT $2`,
    [`%${searchText}%`, limit]
  )
  
  return result.rows.map(rowToTranscriptSegment)
}

