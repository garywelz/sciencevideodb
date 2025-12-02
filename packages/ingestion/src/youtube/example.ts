/**
 * Example usage of YouTubeClient
 * 
 * This file demonstrates how to use the YouTube API client
 * for fetching channel information, videos, and transcripts.
 */

import { YouTubeClient } from './client'
import { getYouTubeApiKey } from '@scienceviddb/gcp-utils'

async function example() {
  // Initialize client with API key
  // Option 1: From Google Secrets Manager
  const apiKey = await getYouTubeApiKey()
  const client = new YouTubeClient(apiKey)

  // Option 2: Direct API key (for local development)
  // const client = new YouTubeClient(process.env.YOUTUBE_API_KEY!)

  try {
    // Example 1: Fetch channel information
    console.log('Fetching channel info...')
    const channel = await client.fetchChannelInfo('UC_x5XG1OV2P6uZZ5FSM9Ttw') // Google Developers
    console.log('Channel:', channel.title)
    console.log('Uploads Playlist ID:', channel.uploadsPlaylistId)

    // Example 2: Fetch videos from a channel
    console.log('\nFetching recent videos...')
    const videos = await client.fetchChannelVideos('UC_x5XG1OV2P6uZZ5FSM9Ttw', undefined, 10)
    console.log(`Found ${videos.length} videos`)

    videos.forEach((video) => {
      console.log(`- ${video.title} (${video.id})`)
      console.log(`  Published: ${video.publishedAt}`)
      console.log(`  Views: ${video.viewCount}`)
    })

    // Example 3: Fetch video metadata
    if (videos.length > 0) {
      console.log('\nFetching detailed metadata...')
      const videoId = videos[0].id
      const video = await client.fetchVideoMetadata(videoId)
      console.log('Video:', video.title)
      console.log('Description:', video.description.substring(0, 100) + '...')
      console.log('Duration:', video.duration, 'seconds')
      console.log('Tags:', video.tags?.join(', '))

      // Example 4: Check if video has captions
      console.log('\nChecking for captions...')
      const hasCaptions = await client.hasCaptions(videoId)
      console.log('Has captions:', hasCaptions)

      // Example 5: Fetch transcript (if available)
      if (hasCaptions) {
        console.log('\nFetching transcript...')
        try {
          const transcript = await client.fetchTranscript(videoId)
          console.log('Transcript length:', transcript.length, 'characters')
          console.log('First 200 chars:', transcript.substring(0, 200) + '...')
        } catch (error) {
          console.error('Failed to fetch transcript:', error)
        }
      }

      // Example 6: Fetch transcript with timestamps
      if (hasCaptions) {
        console.log('\nFetching transcript with timestamps...')
        try {
          const transcriptWithTimestamps = await client.fetchTranscriptWithTimestamps(videoId)
          console.log(`Found ${transcriptWithTimestamps.length} segments`)
          if (transcriptWithTimestamps.length > 0) {
            console.log('First segment:', transcriptWithTimestamps[0])
          }
        } catch (error) {
          console.error('Failed to fetch transcript:', error)
        }
      }

      // Example 7: Convert to VideoRecord format
      console.log('\nConverting to VideoRecord format...')
      const videoRecord = YouTubeClient.convertToVideoRecord(video, channel.id)
      console.log('VideoRecord:', JSON.stringify(videoRecord, null, 2))
    }

    // Example 8: Fetch multiple videos at once
    console.log('\nFetching multiple videos...')
    if (videos.length >= 3) {
      const videoIds = videos.slice(0, 3).map((v) => v.id)
      const batchVideos = await client.fetchVideoMetadataBatch(videoIds)
      console.log(`Fetched ${batchVideos.length} videos in batch`)
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  example()
}

export { example }

