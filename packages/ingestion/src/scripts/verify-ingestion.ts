#!/usr/bin/env node

/**
 * Verify ingestion results - check videos and transcripts in database
 */

import { getChannelByChannelId, getVideosByChannel, getTranscriptSegments } from '@scienceviddb/db'
import { close } from '@scienceviddb/db'

async function verify() {
  try {
    const channelId = 'UCYO_jab_esuFRV4b17AJtAw' // 3Blue1Brown
    
    console.log('Verifying ingestion results...\n')
    
    // Get channel
    const channel = await getChannelByChannelId(channelId)
    if (!channel) {
      console.error('❌ Channel not found')
      process.exit(1)
    }
    
    console.log(`✅ Channel: ${channel.channelName}`)
    console.log(`   Last checked: ${channel.lastCheckedAt}`)
    console.log(`   Last video: ${channel.lastVideoAt}\n`)
    
    // Get videos (use YouTube channel ID, not database UUID)
    const videos = await getVideosByChannel(channel.channelId, 10)
    console.log(`✅ Found ${videos.length} videos (showing first 10):\n`)
    
    videos.forEach((video, i) => {
      console.log(`${i + 1}. ${video.title}`)
      console.log(`   ID: ${video.id}`)
      console.log(`   Published: ${video.publishedAt.toISOString().split('T')[0]}`)
      console.log(`   Transcript: ${video.transcriptAvailable ? '✅' : '❌'}`)
      
      // Check transcript segments
      if (video.transcriptAvailable) {
        getTranscriptSegments(video.id).then((segments) => {
          console.log(`   Transcript segments: ${segments.length}`)
        }).catch(() => {
          console.log(`   Transcript segments: Error loading`)
        })
      }
      console.log('')
    })
    
    // Get transcript count for first video
    if (videos.length > 0 && videos[0].transcriptAvailable) {
      const segments = await getTranscriptSegments(videos[0].id)
      console.log(`\n📝 Sample transcript from "${videos[0].title}":`)
      console.log(`   Total segments: ${segments.length}`)
      if (segments.length > 0) {
        console.log(`   First segment: "${segments[0].text.substring(0, 100)}..."`)
        console.log(`   Time: ${segments[0].startTime}s - ${segments[0].endTime}s`)
      }
    }
    
    console.log('\n✅ Verification complete!')
  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  } finally {
    await close()
  }
}

verify()

