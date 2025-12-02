/**
 * Database models and type definitions
 * 
 * Maps database rows to TypeScript types
 */

import type {
  VideoRecord,
  ChannelRegistry,
  TranscriptSegment,
  Discipline,
  VideoSource,
} from '@scienceviddb/shared'

/**
 * Database row types (as returned from PostgreSQL)
 */
export interface ChannelRow {
  id: string
  channel_id: string
  channel_name: string
  channel_url: string | null
  source: string
  disciplines: string[]
  priority: number
  update_cadence: string
  is_active: boolean
  last_checked_at: Date | null
  last_video_at: Date | null
  tags: string[]
  metadata: Record<string, unknown>
  created_at: Date
  updated_at: Date
}

export interface VideoRow {
  id: string
  source_id: string
  source: string
  title: string
  description: string | null
  published_at: Date
  duration: number | null
  view_count: number | null
  channel_id: string
  thumbnail_url: string | null
  video_url: string
  disciplines: string[]
  tags: string[]
  transcript_available: boolean
  embedding_id: string | null
  search_index_id: string | null
  metadata: Record<string, unknown>
  created_at: Date
  updated_at: Date
}

export interface TranscriptSegmentRow {
  id: string
  video_id: string
  text: string
  start_time: number
  end_time: number
  confidence: number | null
}

/**
 * Convert database row to ChannelRegistry
 */
export function rowToChannelRegistry(row: ChannelRow): ChannelRegistry {
  return {
    id: row.id,
    channelId: row.channel_id,
    channelName: row.channel_name,
    channelUrl: row.channel_url || '',
    source: row.source as VideoSource,
    disciplines: row.disciplines as Discipline[],
    priority: row.priority,
    updateCadence: row.update_cadence as 'hourly' | 'daily' | 'weekly',
    isActive: row.is_active,
    lastCheckedAt: row.last_checked_at,
    lastVideoAt: row.last_video_at,
    tags: row.tags,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Convert database row to VideoRecord
 */
export function rowToVideoRecord(row: VideoRow): VideoRecord {
  return {
    id: row.id,
    sourceId: row.source_id,
    source: row.source as VideoSource,
    title: row.title,
    description: row.description,
    publishedAt: row.published_at,
    duration: row.duration || 0,
    viewCount: row.view_count,
    channelId: row.channel_id,
    channelName: '', // Will need to join with channels table
    channelUrl: null,
    thumbnailUrl: row.thumbnail_url,
    videoUrl: row.video_url,
    disciplines: row.disciplines as Discipline[],
    tags: row.tags,
    transcriptAvailable: row.transcript_available,
    embeddingId: row.embedding_id,
    searchIndexId: row.search_index_id,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Convert database row to TranscriptSegment
 */
export function rowToTranscriptSegment(row: TranscriptSegmentRow): TranscriptSegment {
  return {
    id: row.id,
    videoId: row.video_id,
    text: row.text,
    startTime: row.start_time,
    endTime: row.end_time,
    confidence: row.confidence || undefined,
  }
}

