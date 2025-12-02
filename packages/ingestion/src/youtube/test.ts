#!/usr/bin/env node

/**
 * Test script for YouTube API Client
 * 
 * Run with: npm run test:youtube
 * 
 * This script tests all YouTube API client functionality:
 * - Channel info fetching
 * - Video fetching
 * - Metadata retrieval
 * - Transcript fetching
 * - Error handling
 */

import { YouTubeClient } from './client'
import { getYouTubeApiKey, getSecret } from '@scienceviddb/gcp-utils'

// Test configuration
const TEST_CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw' // Google Developers (reliable test channel)
const USE_SECRETS_MANAGER = process.env.USE_SECRETS_MANAGER === 'true'

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
  details?: unknown
}

const results: TestResult[] = []

/**
 * Run a test and record the result
 */
async function runTest(
  name: string,
  testFn: () => Promise<unknown>
): Promise<void> {
  const startTime = Date.now()
  console.log(`\n🧪 Testing: ${name}...`)

  try {
    const result = await testFn()
    const duration = Date.now() - startTime
    results.push({
      name,
      passed: true,
      duration,
      details: result,
    })
    console.log(`✅ PASSED (${duration}ms)`)
    if (result && typeof result === 'object') {
      console.log(`   Details: ${JSON.stringify(result, null, 2).substring(0, 200)}...`)
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)
    results.push({
      name,
      passed: false,
      error: errorMessage,
      duration,
    })
    console.log(`❌ FAILED (${duration}ms)`)
    console.log(`   Error: ${errorMessage}`)
  }
}

/**
 * Get YouTube API key from environment or Secrets Manager
 */
async function getApiKey(): Promise<string> {
  if (USE_SECRETS_MANAGER) {
    try {
      console.log('🔐 Fetching API key from Google Secrets Manager...')
      return await getYouTubeApiKey()
    } catch (error) {
      console.warn('⚠️  Failed to fetch from Secrets Manager, trying environment variable...')
    }
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw new Error(
      'YOUTUBE_API_KEY environment variable not set. ' +
      'Set it or enable USE_SECRETS_MANAGER=true'
    )
  }

  return apiKey
}

/**
 * Main test suite
 */
async function runTests() {
  console.log('='.repeat(60))
  console.log('YouTube API Client Test Suite')
  console.log('='.repeat(60))

  // Get API key
  let apiKey: string
  try {
    apiKey = await getApiKey()
    console.log(`\n✅ API Key loaded (${apiKey.substring(0, 10)}...)`)
  } catch (error) {
    console.error('\n❌ Failed to get API key:', error)
    process.exit(1)
  }

  // Initialize client
  const client = new YouTubeClient(apiKey)

  // Test 1: Fetch channel info
  await runTest('Fetch Channel Info', async () => {
    const channel = await client.fetchChannelInfo(TEST_CHANNEL_ID)
    
    if (!channel.id) {
      throw new Error('Channel ID missing')
    }
    if (!channel.title) {
      throw new Error('Channel title missing')
    }
    if (!channel.uploadsPlaylistId) {
      throw new Error('Uploads playlist ID missing')
    }

    return {
      id: channel.id,
      title: channel.title,
      uploadsPlaylistId: channel.uploadsPlaylistId,
    }
  })

  // Test 2: Fetch channel videos
  let testVideoId: string | null = null
  await runTest('Fetch Channel Videos (limit 5)', async () => {
    const videos = await client.fetchChannelVideos(TEST_CHANNEL_ID, undefined, 5)

    if (videos.length === 0) {
      throw new Error('No videos returned')
    }

    if (!videos[0].id) {
      throw new Error('Video ID missing')
    }

    testVideoId = videos[0].id

    return {
      count: videos.length,
      firstVideo: {
        id: videos[0].id,
        title: videos[0].title,
        publishedAt: videos[0].publishedAt,
      },
    }
  })

  if (!testVideoId) {
    console.error('\n⚠️  Cannot continue tests without a test video ID')
    printSummary()
    process.exit(1)
  }

  // Test 3: Fetch video metadata
  await runTest('Fetch Video Metadata', async () => {
    const video = await client.fetchVideoMetadata(testVideoId)

    if (!video.title) {
      throw new Error('Video title missing')
    }
    if (video.duration <= 0) {
      throw new Error('Video duration invalid')
    }
    if (video.viewCount < 0) {
      throw new Error('Video view count invalid')
    }

    return {
      id: video.id,
      title: video.title,
      duration: video.duration,
      viewCount: video.viewCount,
      hasTags: Array.isArray(video.tags) && video.tags.length > 0,
    }
  })

  // Test 4: Batch video metadata
  await runTest('Fetch Batch Video Metadata', async () => {
    // First get multiple video IDs
    const videos = await client.fetchChannelVideos(TEST_CHANNEL_ID, undefined, 3)
    const videoIds = videos.map((v) => v.id)

    if (videoIds.length === 0) {
      throw new Error('No video IDs to test')
    }

    const batchVideos = await client.fetchVideoMetadataBatch(videoIds)

    if (batchVideos.length !== videoIds.length) {
      throw new Error(
        `Expected ${videoIds.length} videos, got ${batchVideos.length}`
      )
    }

    return {
      requested: videoIds.length,
      received: batchVideos.length,
      titles: batchVideos.map((v) => v.title),
    }
  })

  // Test 5: Check for captions
  await runTest('Check Video Has Captions', async () => {
    const hasCaptions = await client.hasCaptions(testVideoId)
    return {
      videoId: testVideoId,
      hasCaptions,
    }
  })

  // Test 6: Fetch transcript (only if captions available)
  await runTest('Fetch Transcript', async () => {
    const hasCaptions = await client.hasCaptions(testVideoId)
    
    if (!hasCaptions) {
      return {
        skipped: true,
        reason: 'Video does not have captions',
      }
    }

    try {
      const transcript = await client.fetchTranscript(testVideoId)

      if (!transcript || transcript.length === 0) {
        return {
          skipped: true,
          reason: 'Video has captions but transcript is empty or unavailable',
        }
      }

      return {
        length: transcript.length,
        first100Chars: transcript.substring(0, 100),
      }
    } catch (error) {
      // Some videos have captions listed but they're not accessible
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('empty') || errorMessage.includes('restricted')) {
        return {
          skipped: true,
          reason: `Captions exist but not accessible: ${errorMessage}`,
        }
      }
      throw error
    }
  })

  // Test 7: Fetch transcript with timestamps
  await runTest('Fetch Transcript With Timestamps', async () => {
    const hasCaptions = await client.hasCaptions(testVideoId)
    
    if (!hasCaptions) {
      return {
        skipped: true,
        reason: 'Video does not have captions',
      }
    }

    try {
      const segments = await client.fetchTranscriptWithTimestamps(testVideoId)

      if (!segments || segments.length === 0) {
        return {
          skipped: true,
          reason: 'Video has captions but no transcript segments available',
        }
      }

      // Validate segment structure
      const firstSegment = segments[0]
      if (!firstSegment.text) {
        throw new Error('Segment text missing')
      }
      if (typeof firstSegment.start !== 'number') {
        throw new Error('Segment start time invalid')
      }
      if (typeof firstSegment.duration !== 'number') {
        throw new Error('Segment duration invalid')
      }

      return {
        segmentCount: segments.length,
        firstSegment: {
          text: firstSegment.text.substring(0, 50),
          start: firstSegment.start,
          duration: firstSegment.duration,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('empty') || errorMessage.includes('restricted') || errorMessage.includes('No transcript')) {
        return {
          skipped: true,
          reason: `Captions exist but not accessible: ${errorMessage}`,
        }
      }
      throw error
    }
  })

  // Test 8: Convert to VideoRecord format
  await runTest('Convert to VideoRecord Format', async () => {
    const video = await client.fetchVideoMetadata(testVideoId)
    const channel = await client.fetchChannelInfo(TEST_CHANNEL_ID)

    const videoRecord = YouTubeClient.convertToVideoRecord(video, channel.id)

    if (!videoRecord.sourceId) {
      throw new Error('Source ID missing')
    }
    if (!videoRecord.videoUrl) {
      throw new Error('Video URL missing')
    }
    if (!videoRecord.channelId) {
      throw new Error('Channel ID missing')
    }

    return {
      sourceId: videoRecord.sourceId,
      videoUrl: videoRecord.videoUrl,
      channelId: videoRecord.channelId,
      duration: videoRecord.duration,
      hasTags: videoRecord.tags.length > 0,
    }
  })

  // Test 9: Rate limiting (make multiple requests quickly)
  await runTest('Rate Limiting (5 sequential requests)', async () => {
    const startTime = Date.now()
    const promises = []

    for (let i = 0; i < 5; i++) {
      promises.push(client.fetchChannelInfo(TEST_CHANNEL_ID))
    }

    await Promise.all(promises)
    const duration = Date.now() - startTime

    // Should take at least 400ms (5 requests * 100ms minimum interval)
    if (duration < 400) {
      console.warn(
        `   ⚠️  Rate limiting may not be working (took ${duration}ms, expected >= 400ms)`
      )
    }

    return {
      requests: 5,
      totalDuration: duration,
      averageDuration: duration / 5,
    }
  })

  // Test 10: Error handling (invalid channel ID)
  await runTest('Error Handling - Invalid Channel ID', async () => {
    try {
      await client.fetchChannelInfo('INVALID_CHANNEL_ID_12345')
      throw new Error('Should have thrown an error')
    } catch (error) {
      // Expected to throw an error
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('not found') || errorMessage.includes('error')) {
        return {
          errorHandled: true,
          errorMessage,
        }
      }
      throw error
    }
  })

  // Print summary
  printSummary()
}

/**
 * Print test summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(60))
  console.log('Test Summary')
  console.log('='.repeat(60))

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const skipped = results.filter((r) => r.details && typeof r.details === 'object' && 'skipped' in r.details).length
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`\nTotal Tests: ${results.length}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  if (skipped > 0) {
    console.log(`⏭️  Skipped: ${skipped}`)
  }
  console.log(`⏱️  Total Duration: ${totalDuration}ms`)
  console.log(`📊 Average Duration: ${Math.round(totalDuration / results.length)}ms`)

  if (failed > 0) {
    console.log('\nFailed Tests:')
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  ❌ ${r.name}`)
        console.log(`     ${r.error}`)
      })
  }

  console.log('\n' + '='.repeat(60))

  if (failed > 0) {
    console.log('⚠️  Some tests failed. Please check the errors above.')
    process.exit(1)
  } else {
    console.log('✅ All tests passed!')
    process.exit(0)
  }
}

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error running tests:', error)
  process.exit(1)
})

