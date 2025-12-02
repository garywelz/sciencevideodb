/**
 * Channel registry queries
 */

import { query, transaction } from '../client'
import { rowToChannelRegistry, type ChannelRow } from '../models'
import type { ChannelRegistry, Discipline, VideoSource } from '@scienceviddb/shared'

/**
 * Get all active channels
 */
export async function getActiveChannels(): Promise<ChannelRegistry[]> {
  const result = await query<ChannelRow>(
    `SELECT * FROM channels 
     WHERE is_active = true 
     ORDER BY priority DESC, last_checked_at NULLS FIRST`
  )
  return result.rows.map(rowToChannelRegistry)
}

/**
 * Get channels due for update based on their update cadence
 */
export async function getChannelsDueForUpdate(): Promise<ChannelRegistry[]> {
  const result = await query<ChannelRow>(
    `SELECT * FROM channels 
     WHERE is_active = true 
     AND (
       last_checked_at IS NULL
       OR (update_cadence = 'hourly' AND last_checked_at < NOW() - INTERVAL '1 hour')
       OR (update_cadence = 'daily' AND last_checked_at < NOW() - INTERVAL '1 day')
       OR (update_cadence = 'weekly' AND last_checked_at < NOW() - INTERVAL '1 week')
     )
     ORDER BY priority DESC, last_checked_at NULLS FIRST`
  )
  return result.rows.map(rowToChannelRegistry)
}

/**
 * Get channel by platform-specific channel ID
 */
export async function getChannelByChannelId(
  channelId: string,
  source: VideoSource = 'youtube'
): Promise<ChannelRegistry | null> {
  const result = await query<ChannelRow>(
    `SELECT * FROM channels 
     WHERE channel_id = $1 AND source = $2`,
    [channelId, source]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return rowToChannelRegistry(result.rows[0])
}

/**
 * Get channel by UUID
 */
export async function getChannelById(id: string): Promise<ChannelRegistry | null> {
  const result = await query<ChannelRow>(
    `SELECT * FROM channels WHERE id = $1`,
    [id]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return rowToChannelRegistry(result.rows[0])
}

/**
 * Create a new channel
 */
export async function createChannel(
  channel: Omit<ChannelRegistry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ChannelRegistry> {
  const result = await query<ChannelRow>(
    `INSERT INTO channels (
      channel_id, channel_name, channel_url, source, disciplines,
      priority, update_cadence, is_active, tags, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      channel.channelId,
      channel.channelName,
      channel.channelUrl || null,
      channel.source,
      channel.disciplines,
      channel.priority,
      channel.updateCadence,
      channel.isActive,
      channel.tags,
      JSON.stringify(channel.metadata),
    ]
  )
  
  return rowToChannelRegistry(result.rows[0])
}

/**
 * Update channel's last checked time
 */
export async function updateChannelLastChecked(
  channelId: string,
  lastVideoAt?: Date
): Promise<void> {
  if (lastVideoAt) {
    await query(
      `UPDATE channels 
       SET last_checked_at = NOW(), last_video_at = $1
       WHERE id = $2`,
      [lastVideoAt, channelId]
    )
  } else {
    await query(
      `UPDATE channels 
       SET last_checked_at = NOW()
       WHERE id = $1`,
      [channelId]
    )
  }
}

/**
 * Update channel
 */
export async function updateChannel(
  id: string,
  updates: Partial<Pick<ChannelRegistry, 'priority' | 'updateCadence' | 'isActive' | 'tags' | 'metadata'>>
): Promise<ChannelRegistry> {
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (updates.priority !== undefined) {
    fields.push(`priority = $${paramIndex++}`)
    values.push(updates.priority)
  }
  if (updates.updateCadence !== undefined) {
    fields.push(`update_cadence = $${paramIndex++}`)
    values.push(updates.updateCadence)
  }
  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${paramIndex++}`)
    values.push(updates.isActive)
  }
  if (updates.tags !== undefined) {
    fields.push(`tags = $${paramIndex++}`)
    values.push(updates.tags)
  }
  if (updates.metadata !== undefined) {
    fields.push(`metadata = $${paramIndex++}`)
    values.push(JSON.stringify(updates.metadata))
  }

  if (fields.length === 0) {
    const channel = await getChannelById(id)
    if (!channel) {
      throw new Error(`Channel ${id} not found`)
    }
    return channel
  }

  values.push(id)
  const result = await query<ChannelRow>(
    `UPDATE channels 
     SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`,
    values
  )

  return rowToChannelRegistry(result.rows[0])
}

