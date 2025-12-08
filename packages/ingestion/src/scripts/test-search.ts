#!/usr/bin/env node

/**
 * Test search functionality with existing videos
 */

import {
  getVideosByDiscipline,
  getRecentVideosByDiscipline,
  getVideosByChannel,
  searchTranscriptSegments,
} from '@scienceviddb/db'
import { close } from '@scienceviddb/db'
import type { Discipline } from '@scienceviddb/shared'

async function testSearch() {
  try {
    console.log('🔍 Testing Search Functionality\n')
    console.log('='.repeat(60))
    
    // Test 1: Search by discipline
    console.log('\n📚 Test 1: Search by Discipline')
    console.log('-'.repeat(60))
    
    const disciplines: Discipline[] = ['mathematics', 'physics', 'chemistry', 'biology', 'cs']
    
    for (const discipline of disciplines) {
      const videos = await getVideosByDiscipline(discipline, 5)
      console.log(`\n${discipline.toUpperCase()}: ${videos.length} videos found`)
      if (videos.length > 0) {
        videos.slice(0, 3).forEach((video, i) => {
          console.log(`  ${i + 1}. ${video.title.substring(0, 60)}...`)
          console.log(`     Channel: ${video.channelName}`)
          console.log(`     Published: ${video.publishedAt.toISOString().split('T')[0]}`)
        })
      }
    }
    
    // Test 2: Recent videos by discipline
    console.log('\n\n📅 Test 2: Recent Videos by Discipline (last 30 days)')
    console.log('-'.repeat(60))
    
    for (const discipline of disciplines) {
      const recent = await getRecentVideosByDiscipline(discipline, 30, 5)
      console.log(`\n${discipline.toUpperCase()}: ${recent.length} recent videos`)
      if (recent.length > 0) {
        recent.slice(0, 2).forEach((video, i) => {
          console.log(`  ${i + 1}. ${video.title.substring(0, 60)}...`)
          console.log(`     Published: ${video.publishedAt.toISOString().split('T')[0]}`)
        })
      }
    }
    
    // Test 3: Search by channel
    console.log('\n\n📺 Test 3: Search by Channel')
    console.log('-'.repeat(60))
    
    const testChannels = [
      'UCYO_jab_esuFRV4b17AJtAw', // 3Blue1Brown
      'UCHnyfMqiRRG1u-2MsSQLbXA', // Veritasium
    ]
    
    for (const channelId of testChannels) {
      const videos = await getVideosByChannel(channelId, 5)
      console.log(`\nChannel ${channelId}: ${videos.length} videos`)
      if (videos.length > 0) {
        console.log(`  Channel Name: ${videos[0].channelName}`)
        videos.slice(0, 3).forEach((video, i) => {
          console.log(`  ${i + 1}. ${video.title.substring(0, 60)}...`)
        })
      }
    }
    
    // Test 4: Transcript search (if we have transcripts)
    console.log('\n\n📝 Test 4: Transcript Search')
    console.log('-'.repeat(60))
    
    try {
      const transcriptResults = await searchTranscriptSegments('mathematics', 5)
      console.log(`Found ${transcriptResults.length} transcript segments matching "mathematics"`)
      if (transcriptResults.length > 0) {
        transcriptResults.slice(0, 3).forEach((seg, i) => {
          console.log(`  ${i + 1}. [${seg.startTime}s - ${seg.endTime}s] ${seg.text.substring(0, 80)}...`)
        })
      } else {
        console.log('  ⚠️  No transcript segments found (transcripts may not be stored yet)')
      }
    } catch (error) {
      console.log(`  ⚠️  Transcript search not available: ${error instanceof Error ? error.message : String(error)}`)
    }
    
    // Test 5: Statistics
    console.log('\n\n📊 Test 5: Database Statistics')
    console.log('-'.repeat(60))
    
    const { query } = await import('@scienceviddb/db')
    
    const totalVideos = await query('SELECT COUNT(*) as count FROM videos')
    const videosByDiscipline = await query(`
      SELECT 
        unnest(disciplines) as discipline,
        COUNT(*) as count
      FROM videos
      GROUP BY discipline
      ORDER BY count DESC
    `)
    const videosWithTranscripts = await query('SELECT COUNT(*) as count FROM videos WHERE transcript_available = true')
    const totalChannels = await query('SELECT COUNT(*) as count FROM channels WHERE is_active = true')
    
    console.log(`\nTotal Videos: ${totalVideos.rows[0].count}`)
    console.log(`Videos with Transcripts: ${videosWithTranscripts.rows[0].count}`)
    console.log(`Active Channels: ${totalChannels.rows[0].count}`)
    console.log('\nVideos by Discipline:')
    videosByDiscipline.rows.forEach((row: { discipline: string; count: string }) => {
      console.log(`  ${row.discipline}: ${row.count} videos`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ All search tests completed!')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n❌ Search test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  } finally {
    await close()
  }
}

testSearch()

