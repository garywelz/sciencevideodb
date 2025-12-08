#!/usr/bin/env node

/**
 * Test transcript fetching on a batch of videos
 * Tests the new API-based method and verifies storage
 */

import { YouTubeClient } from '../youtube/client'
import { getYouTubeApiKey } from '@scienceviddb/gcp-utils'
import { query, close } from '@scienceviddb/db'
import { insertTranscriptSegments } from '@scienceviddb/db'

async function testTranscriptBatch() {
  try {
    console.log('Testing transcript fetching on batch of videos...\n')
    
    // Get a few videos that should have transcripts
    const result = await query(`
      SELECT v.id, v.source_id, v.title, v.transcript_available
      FROM videos v
      WHERE v.transcript_available = true
      AND NOT EXISTS (
        SELECT 1 FROM transcript_segments ts WHERE ts.video_id = v.id
      )
      LIMIT 5
    `)
    
    if (result.rows.length === 0) {
      console.log('No videos found that need transcripts')
      await close()
      return
    }
    
    console.log(`Found ${result.rows.length} videos to test\n`)
    
    // Initialize YouTube client
    const apiKey = await getYouTubeApiKey()
    const client = new YouTubeClient(apiKey)
    
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (const video of result.rows) {
      const videoId = video.source_id as string
      const dbVideoId = video.id as string
      const title = (video.title as string).substring(0, 50)
      
      console.log(`\n📹 ${title}...`)
      console.log(`   Video ID: ${videoId}`)
      
      try {
        // Try to fetch transcript
        const transcriptSegments = await client.fetchTranscriptWithTimestamps(videoId)
        
        if (transcriptSegments.length > 0) {
          // Store transcript segments
          await insertTranscriptSegments(
            dbVideoId,
            transcriptSegments.map((seg) => ({
              text: seg.text,
              startTime: seg.start,
              endTime: seg.start + seg.duration,
            }))
          )
          console.log(`   ✅ Stored ${transcriptSegments.length} segments`)
          successCount++
        } else {
          console.log(`   ⚠️  Transcript returned empty (0 segments)`)
          skipCount++
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        console.log(`   ❌ Failed: ${errorMsg.substring(0, 80)}`)
        failCount++
        // Continue to next video - don't let failures stop the process
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('Summary:')
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ⚠️  Skipped (empty): ${skipCount}`)
    console.log(`  ❌ Failed: ${failCount}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await close()
  }
}

testTranscriptBatch()

