/**
 * Video queries
 */

import { query, transaction } from '../client'
import { rowToVideoRecord, type VideoRow } from '../models'
import type { VideoRecord, Discipline, VideoSource } from '@scienceviddb/shared'

/**
 * Get video by source ID and source
 */
export async function getVideoBySourceId(
  sourceId: string,
  source: VideoSource = 'youtube'
): Promise<VideoRecord | null> {
  const result = await query<VideoRow>(
    `SELECT v.*, c.channel_name, c.channel_url
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE v.source_id = $1 AND v.source = $2`,
    [sourceId, source]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  const row = result.rows[0]
  const video = rowToVideoRecord(row as VideoRow)
  video.channelName = (row as VideoRow & { channel_name: string }).channel_name
  video.channelUrl = (row as VideoRow & { channel_url: string | null }).channel_url
  
  return video
}

/**
 * Get video by UUID
 */
export async function getVideoById(id: string): Promise<VideoRecord | null> {
  const result = await query<VideoRow>(
    `SELECT v.*, c.channel_name, c.channel_url
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE v.id = $1`,
    [id]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  const row = result.rows[0]
  const video = rowToVideoRecord(row as VideoRow)
  video.channelName = (row as VideoRow & { channel_name: string }).channel_name
  video.channelUrl = (row as VideoRow & { channel_url: string | null }).channel_url
  
  return video
}

/**
 * Create or update a video
 */
export async function upsertVideo(
  video: Omit<VideoRecord, 'id' | 'createdAt' | 'updatedAt' | 'channelName' | 'channelUrl'>,
  channelDbId?: string // Optional: if you already have the channel's database UUID
): Promise<VideoRecord> {
  return transaction(async (client) => {
    // Get the channel database ID if not provided
    let channelDatabaseId: string
    if (channelDbId) {
      channelDatabaseId = channelDbId
    } else {
      // video.channelId might be the platform channel ID, need to find the DB UUID
      const channelResult = await client.query(
        `SELECT id FROM channels WHERE channel_id = $1 AND source = $2`,
        [video.channelId, video.source]
      )
      
      if (channelResult.rows.length === 0) {
        throw new Error(`Channel ${video.channelId} (${video.source}) not found in database`)
      }
      
      channelDatabaseId = channelResult.rows[0].id
    }
    
    // Check if video exists
    const existingResult = await client.query<VideoRow>(
      `SELECT * FROM videos WHERE source_id = $1 AND source = $2`,
      [video.sourceId, video.source]
    )
    
    if (existingResult.rows.length > 0) {
      // Update existing video
      const result = await client.query<VideoRow>(
        `UPDATE videos SET
         title = $1,
         description = $2,
         published_at = $3,
         duration = $4,
         view_count = $5,
         thumbnail_url = $6,
         video_url = $7,
         disciplines = $8,
         tags = $9,
         transcript_available = $10,
         embedding_id = $11,
         search_index_id = $12,
         metadata = $13
         WHERE source_id = $14 AND source = $15
         RETURNING *`,
        [
          video.title,
          video.description,
          video.publishedAt,
          video.duration,
          video.viewCount,
          video.thumbnailUrl,
          video.videoUrl,
          video.disciplines,
          video.tags,
          video.transcriptAvailable,
          video.embeddingId,
          video.searchIndexId,
          JSON.stringify(video.metadata),
          video.sourceId,
          video.source,
        ]
      )
      
      const updatedVideo = rowToVideoRecord(result.rows[0])
      // Get channel info
      const channelInfo = await client.query(
        `SELECT channel_name, channel_url FROM channels WHERE id = $1`,
        [channelDatabaseId]
      )
      updatedVideo.channelName = channelInfo.rows[0].channel_name
      updatedVideo.channelUrl = channelInfo.rows[0].channel_url
      updatedVideo.channelId = channelDatabaseId
      
      return updatedVideo
    } else {
      // Insert new video
      const result = await client.query<VideoRow>(
        `INSERT INTO videos (
          source_id, source, title, description, published_at, duration,
          view_count, channel_id, thumbnail_url, video_url, disciplines,
          tags, transcript_available, embedding_id, search_index_id, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [
          video.sourceId,
          video.source,
          video.title,
          video.description,
          video.publishedAt,
          video.duration,
          video.viewCount,
          channelDatabaseId,
          video.thumbnailUrl,
          video.videoUrl,
          video.disciplines,
          video.tags,
          video.transcriptAvailable,
          video.embeddingId,
          video.searchIndexId,
          JSON.stringify(video.metadata),
        ]
      )
      
      const newVideo = rowToVideoRecord(result.rows[0])
      // Get channel info
      const channelInfo = await client.query(
        `SELECT channel_name, channel_url FROM channels WHERE id = $1`,
        [channelDatabaseId]
      )
      newVideo.channelName = channelInfo.rows[0].channel_name
      newVideo.channelUrl = channelInfo.rows[0].channel_url
      newVideo.channelId = channelDatabaseId
      
      return newVideo
    }
  })
}

/**
 * Get videos by channel
 */
export async function getVideosByChannel(
  channelId: string,
  limit: number = 50,
  offset: number = 0
): Promise<VideoRecord[]> {
  const result = await query<VideoRow>(
    `SELECT v.*, c.channel_name, c.channel_url
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE c.channel_id = $1
     ORDER BY v.published_at DESC
     LIMIT $2 OFFSET $3`,
    [channelId, limit, offset]
  )
  
  return result.rows.map((row) => {
    const video = rowToVideoRecord(row as VideoRow)
    video.channelName = (row as VideoRow & { channel_name: string }).channel_name
    video.channelUrl = (row as VideoRow & { channel_url: string | null }).channel_url
    return video
  })
}

/**
 * Search videos by discipline
 */
export async function getVideosByDiscipline(
  discipline: Discipline,
  limit: number = 50,
  offset: number = 0
): Promise<VideoRecord[]> {
  const result = await query<VideoRow>(
    `SELECT v.*, c.channel_name, c.channel_url
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE $1 = ANY(v.disciplines)
     ORDER BY v.published_at DESC
     LIMIT $2 OFFSET $3`,
    [discipline, limit, offset]
  )
  
  return result.rows.map((row) => {
    const video = rowToVideoRecord(row as VideoRow)
    video.channelName = (row as VideoRow & { channel_name: string }).channel_name
    video.channelUrl = (row as VideoRow & { channel_url: string | null }).channel_url
    return video
  })
}

/**
 * Get recent videos by discipline (within last N days)
 */
export async function getRecentVideosByDiscipline(
  discipline: Discipline,
  days: number = 30,
  limit: number = 50
): Promise<VideoRecord[]> {
  const result = await query<VideoRow>(
    `SELECT v.*, c.channel_name, c.channel_url
     FROM videos v
     JOIN channels c ON v.channel_id = c.id
     WHERE $1 = ANY(v.disciplines)
       AND v.published_at >= NOW() - INTERVAL '${days} days'
     ORDER BY v.published_at DESC
     LIMIT $2`,
    [discipline, limit]
  )
  
  return result.rows.map((row) => {
    const video = rowToVideoRecord(row as VideoRow)
    video.channelName = (row as VideoRow & { channel_name: string }).channel_name
    video.channelUrl = (row as VideoRow & { channel_url: string | null }).channel_url
    return video
  })
}

