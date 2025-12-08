#!/usr/bin/env node

/**
 * Science Video Database - Ingestion Worker
 * 
 * Fetches videos from YouTube and other sources,
 * extracts transcripts, generates embeddings, and indexes them.
 */

import { YouTubeClient } from './youtube/client'
import { getYouTubeApiKey } from '@scienceviddb/gcp-utils'
import {
  getChannelByChannelId,
  updateChannelLastChecked,
  getActiveChannels,
  getChannelsDueForUpdate,
  upsertVideo,
  getVideoBySourceId,
  insertTranscriptSegments,
  type ChannelRegistry,
} from '@scienceviddb/db'
import { close as closeDatabase } from '@scienceviddb/db'
import type { IngestionStatus, VideoRecord } from '@scienceviddb/shared'

/**
 * Ingest videos for a specific channel
 */
async function ingestChannel(channelId: string): Promise<IngestionStatus> {
  const startedAt = new Date()
  const status: IngestionStatus = {
    channelId,
    status: 'processing',
    videosProcessed: 0,
    videosNew: 0,
    videosUpdated: 0,
    errors: [],
    startedAt,
    completedAt: null,
  }

  try {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Starting ingestion for channel: ${channelId}`)
    console.log(`${'='.repeat(60)}\n`)

    // 1. Get channel from database
    console.log('📋 Fetching channel from database...')
    const channel = await getChannelByChannelId(channelId)
    if (!channel) {
      throw new Error(`Channel ${channelId} not found in database. Add it to channels table first.`)
    }
    console.log(`✅ Found channel: ${channel.channelName}`)
    console.log(`   Disciplines: ${channel.disciplines.join(', ')}`)
    console.log(`   Last checked: ${channel.lastCheckedAt || 'Never'}\n`)

    // 2. Initialize YouTube client
    console.log('🔑 Initializing YouTube API client...')
    const apiKey = await getYouTubeApiKey()
    const youtubeClient = new YouTubeClient(apiKey)
    console.log('✅ YouTube client ready\n')

    // 3. Determine date range for fetching videos
    const publishedAfter = channel.lastCheckedAt 
      ? new Date(channel.lastCheckedAt)
      : undefined

    if (publishedAfter) {
      console.log(`📅 Fetching videos published after: ${publishedAfter.toISOString()}\n`)
    } else {
      console.log('📅 Fetching all recent videos (no previous check)\n')
    }

    // 4. Fetch videos from YouTube
    console.log('🎥 Fetching videos from YouTube...')
    const youtubeVideos = await youtubeClient.fetchChannelVideos(
      channelId,
      publishedAfter,
      50 // Fetch up to 50 videos at a time
    )
    console.log(`✅ Found ${youtubeVideos.length} videos from YouTube\n`)

    if (youtubeVideos.length === 0) {
      console.log('ℹ️  No new videos to process')
      status.status = 'completed'
      status.completedAt = new Date()
      
      // Update channel last checked time even if no videos
      await updateChannelLastChecked(channel.id)
      
      return status
    }

    // 5. Process each video
    let latestVideoDate: Date | undefined
    for (let i = 0; i < youtubeVideos.length; i++) {
      const youtubeVideo = youtubeVideos[i]
      status.videosProcessed++

      try {
        console.log(`\n[${i + 1}/${youtubeVideos.length}] Processing: ${youtubeVideo.title}`)
        console.log(`   Video ID: ${youtubeVideo.id}`)

        // Check if video already exists
        const existingVideo = await getVideoBySourceId(youtubeVideo.id, 'youtube')

        // Convert to VideoRecord format
        const videoRecord = YouTubeClient.convertToVideoRecord(youtubeVideo, channelId)
        
        // Use channel's disciplines
        videoRecord.disciplines = channel.disciplines
        videoRecord.tags = channel.tags.length > 0 ? channel.tags : (youtubeVideo.tags || [])

        // Check if video has captions
        const hasCaptions = await youtubeClient.hasCaptions(youtubeVideo.id)
        videoRecord.transcriptAvailable = hasCaptions

        // Upsert video in database
        const savedVideo = await upsertVideo(videoRecord, channel.id)

        if (existingVideo) {
          status.videosUpdated++
          console.log(`   ✅ Updated existing video in database`)
        } else {
          status.videosNew++
          console.log(`   ✅ Added new video to database`)
        }

        // Fetch and store transcript if available
        if (hasCaptions) {
          try {
            console.log(`   📝 Fetching transcript...`)
            const transcriptSegments = await youtubeClient.fetchTranscriptWithTimestamps(youtubeVideo.id)
            
            if (transcriptSegments.length > 0) {
              // Store transcript segments
              // Note: fetchTranscriptWithTimestamps returns {text, start, duration}
              await insertTranscriptSegments(
                savedVideo.id,
                transcriptSegments.map((seg) => ({
                  text: seg.text,
                  startTime: seg.start,
                  endTime: seg.start + seg.duration,
                }))
              )
              console.log(`   ✅ Stored ${transcriptSegments.length} transcript segments`)
            } else {
              console.log(`   ⚠️  Transcript fetched but empty (0 segments) - captions may be restricted or unavailable`)
              status.errors.push({
                videoId: youtubeVideo.id,
                error: 'Transcript fetched but returned empty array',
              })
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error)
            console.log(`   ⚠️  Failed to fetch transcript: ${errorMsg}`)
            status.errors.push({
              videoId: youtubeVideo.id,
              error: `Transcript fetch failed: ${errorMsg}`,
            })
          }
        } else {
          console.log(`   ℹ️  No captions available for this video`)
        }

        // Track latest video date
        const videoDate = new Date(videoRecord.publishedAt)
        if (!latestVideoDate || videoDate > latestVideoDate) {
          latestVideoDate = videoDate
        }

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.error(`   ❌ Error processing video: ${errorMsg}`)
        status.errors.push({
          videoId: youtubeVideo.id,
          error: errorMsg,
        })
      }
    }

    // 6. Update channel's last checked time
    console.log(`\n📝 Updating channel last checked time...`)
    await updateChannelLastChecked(channel.id, latestVideoDate)
    console.log(`✅ Channel updated\n`)

    status.status = 'completed'
    status.completedAt = new Date()

    console.log(`${'='.repeat(60)}`)
    console.log('Ingestion Complete!')
    console.log(`${'='.repeat(60)}`)
    console.log(`Videos processed: ${status.videosProcessed}`)
    console.log(`New videos: ${status.videosNew}`)
    console.log(`Updated videos: ${status.videosUpdated}`)
    console.log(`Errors: ${status.errors.length}`)
    console.log(`Duration: ${((status.completedAt.getTime() - status.startedAt.getTime()) / 1000).toFixed(2)}s`)
    console.log(`${'='.repeat(60)}\n`)

  } catch (error) {
    status.status = 'failed'
    status.completedAt = new Date()
    const errorMsg = error instanceof Error ? error.message : String(error)
    status.errors.push({
      videoId: null,
      error: errorMsg,
    })
    console.error(`\n❌ Ingestion failed: ${errorMsg}\n`)
  }

  return status
}

/**
 * Ingest videos for all channels due for update
 */
async function ingestAllChannels(): Promise<void> {
  console.log('Starting ingestion for all channels due for update...\n')

  const channels = await getChannelsDueForUpdate()
  console.log(`Found ${channels.length} channels due for update\n`)

  if (channels.length === 0) {
    console.log('✅ All channels are up to date!\n')
    return
  }

  const results: Array<{ channel: ChannelRegistry; status: IngestionStatus }> = []

  for (const channel of channels) {
    try {
      const status = await ingestChannel(channel.channelId)
      results.push({ channel, status })
    } catch (error) {
      console.error(`Failed to ingest channel ${channel.channelId}:`, error)
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY - All Channels')
  console.log('='.repeat(60))
  console.log(`Total channels: ${results.length}`)
  console.log(`Successful: ${results.filter((r) => r.status.status === 'completed').length}`)
  console.log(`Failed: ${results.filter((r) => r.status.status === 'failed').length}`)
  console.log(`Total videos processed: ${results.reduce((sum, r) => sum + r.status.videosProcessed, 0)}`)
  console.log(`Total new videos: ${results.reduce((sum, r) => sum + r.status.videosNew, 0)}`)
  console.log(`Total errors: ${results.reduce((sum, r) => sum + r.status.errors.length, 0)}`)
  console.log('='.repeat(60) + '\n')
}

async function main() {
  const args = process.argv.slice(2)
  
  try {
    if (args.includes('--all')) {
      await ingestAllChannels()
    } else if (args.includes('--channel')) {
      const channelIndex = args.indexOf('--channel')
      const channelId = args[channelIndex + 1]
      if (!channelId) {
        console.error('Error: --channel requires a channel ID')
        console.log('\nUsage:')
        console.log('  npm run ingest -- --channel <channel-id>')
        process.exit(1)
      }
      await ingestChannel(channelId)
    } else {
      console.log('Usage:')
      console.log('  npm run ingest -- --all                    - Ingest all channels due for update')
      console.log('  npm run ingest -- --channel <channel-id>   - Ingest specific channel')
      console.log('\nExamples:')
      console.log('  npm run ingest -- --channel UC_x5XG1OV2P6uZZ5FSM9Ttw')
      process.exit(1)
    }
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    // Close database connection
    await closeDatabase()
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

