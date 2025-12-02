/**
 * YouTube Data API client
 * 
 * Integrates with YouTube Data API v3:
 * - channels.list for channel info
 * - playlistItems.list for video list
 * - videos.list for video metadata
 * - captions.list and captions.download for transcripts
 */

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  duration: number // seconds
  viewCount: number
  thumbnailUrl: string
  channelId: string
  channelTitle: string
  tags?: string[]
}

export interface YouTubeChannel {
  id: string
  title: string
  uploadsPlaylistId: string
  description?: string
  thumbnailUrl?: string
}

export interface YouTubeApiResponse<T> {
  items: T[]
  nextPageToken?: string
  pageInfo?: {
    totalResults: number
    resultsPerPage: number
  }
}

export interface YouTubeApiError {
  error: {
    code: number
    message: string
    errors: Array<{
      message: string
      domain: string
      reason: string
    }>
  }
}

/**
 * YouTube API client with rate limiting and error handling
 */
export class YouTubeClient {
  private apiKey: string
  private baseUrl = 'https://www.googleapis.com/youtube/v3'
  private requestQueue: Promise<void> = Promise.resolve()
  private lastRequestTime: number = 0
  private minRequestInterval: number = 100 // Minimum milliseconds between requests

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('YouTube API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Make a rate-limited API request
   */
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string | number | undefined>
  ): Promise<T> {
    // Remove undefined params
    const cleanParams: Record<string, string> = {}
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        cleanParams[key] = String(value)
      }
    }

    // Add API key
    cleanParams.key = this.apiKey

    // Build URL
    const queryString = new URLSearchParams(cleanParams).toString()
    const url = `${this.baseUrl}/${endpoint}?${queryString}`

    // Rate limiting: wait if needed
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      )
    }
    this.lastRequestTime = Date.now()

    // Make request
    const response = await fetch(url)

    if (!response.ok) {
      const errorData: YouTubeApiError = await response.json().catch(() => ({
        error: {
          code: response.status,
          message: response.statusText,
          errors: [],
        },
      }))

      if (errorData.error.code === 403) {
        throw new Error(
          `YouTube API quota exceeded or access denied: ${errorData.error.message}`
        )
      }

      throw new Error(
        `YouTube API error (${errorData.error.code}): ${errorData.error.message}`
      )
    }

    const data = await response.json()
    return data as T
  }

  /**
   * Fetch channel information including uploads playlist ID
   */
  async fetchChannelInfo(channelId: string): Promise<YouTubeChannel> {
    try {
      const response = await this.makeRequest<YouTubeApiResponse<{
        id: string
        snippet: {
          title: string
          description: string
          thumbnails?: {
            default?: { url: string }
            medium?: { url: string }
            high?: { url: string }
          }
        }
        contentDetails: {
          relatedPlaylists: {
            uploads: string
          }
        }
      }>>('channels', {
        part: 'snippet,contentDetails',
        id: channelId,
        maxResults: 1,
      })

      if (!response.items || response.items.length === 0) {
        throw new Error(`Channel ${channelId} not found`)
      }

      const channel = response.items[0]
      const thumbnailUrl =
        channel.snippet.thumbnails?.high?.url ||
        channel.snippet.thumbnails?.medium?.url ||
        channel.snippet.thumbnails?.default?.url ||
        undefined

      return {
        id: channel.id,
        title: channel.snippet.title,
        uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
        description: channel.snippet.description,
        thumbnailUrl,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to fetch channel info: ${message}`)
    }
  }

  /**
   * Fetch videos from a channel's uploads playlist
   */
  async fetchChannelVideos(
    channelId: string,
    publishedAfter?: Date,
    maxResults: number = 50
  ): Promise<YouTubeVideo[]> {
    try {
      // First, get the channel info to get the uploads playlist ID
      const channel = await this.fetchChannelInfo(channelId)
      const playlistId = channel.uploadsPlaylistId

      // Fetch playlist items
      const videos: YouTubeVideo[] = []
      let nextPageToken: string | undefined

      do {
        const params: Record<string, string | number | undefined> = {
          part: 'snippet,contentDetails',
          playlistId,
          maxResults: Math.min(maxResults - videos.length, 50), // YouTube max is 50
        }

        if (nextPageToken) {
          params.pageToken = nextPageToken
        }

        const response = await this.makeRequest<YouTubeApiResponse<{
          snippet: {
            title: string
            description: string
            publishedAt: string
            thumbnails?: {
              default?: { url: string }
              medium?: { url: string }
              high?: { url: string }
            }
            channelId: string
            channelTitle: string
            resourceId: {
              videoId: string
            }
          }
          contentDetails: {
            videoPublishedAt: string
          }
        }>>('playlistItems', params)

        // Extract video IDs
        const videoIds = response.items
          .map((item) => item.snippet.resourceId.videoId)
          .filter((id) => id)

        if (videoIds.length === 0) {
          break
        }

        // Fetch full video details
        const videoDetails = await this.fetchVideoMetadataBatch(videoIds)

        // Filter by publishedAfter if provided
        const filteredVideos = videoDetails.filter((video) => {
          if (!publishedAfter) return true
          const published = new Date(video.publishedAt)
          return published >= publishedAfter
        })

        videos.push(...filteredVideos)

        // Stop if we've reached maxResults or if publishedAfter filter cuts off results
        if (videos.length >= maxResults) {
          break
        }

        // Check if we should continue based on publishedAfter
        if (publishedAfter && response.items.length > 0) {
          const oldestItemDate = new Date(
            response.items[response.items.length - 1].contentDetails.videoPublishedAt
          )
          if (oldestItemDate < publishedAfter) {
            break // No more videos after this date
          }
        }

        nextPageToken = response.nextPageToken
      } while (nextPageToken && videos.length < maxResults)

      return videos.slice(0, maxResults)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to fetch channel videos: ${message}`)
    }
  }

  /**
   * Fetch video metadata for multiple videos at once
   */
  async fetchVideoMetadataBatch(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) {
      return []
    }

    // YouTube API allows up to 50 video IDs per request
    const batches: string[][] = []
    for (let i = 0; i < videoIds.length; i += 50) {
      batches.push(videoIds.slice(i, i + 50))
    }

    const allVideos: YouTubeVideo[] = []

    for (const batch of batches) {
      const response = await this.makeRequest<YouTubeApiResponse<{
        id: string
        snippet: {
          title: string
          description: string
          publishedAt: string
          thumbnails?: {
            default?: { url: string }
            medium?: { url: string }
            high?: { url: string }
            standard?: { url: string }
            maxres?: { url: string }
          }
          channelId: string
          channelTitle: string
          tags?: string[]
        }
        contentDetails: {
          duration: string // ISO 8601 duration format
        }
        statistics: {
          viewCount: string
        }
      }>>('videos', {
        part: 'snippet,contentDetails,statistics',
        id: batch.join(','),
        maxResults: batch.length,
      })

      const videos = response.items.map((item) => {
        const thumbnailUrl =
          item.snippet.thumbnails?.maxres?.url ||
          item.snippet.thumbnails?.standard?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          ''

        // Parse ISO 8601 duration to seconds
        const duration = this.parseDuration(item.contentDetails.duration)

        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          duration,
          viewCount: parseInt(item.statistics.viewCount || '0', 10),
          thumbnailUrl,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          tags: item.snippet.tags || [],
        }
      })

      allVideos.push(...videos)
    }

    return allVideos
  }

  /**
   * Fetch video metadata for a single video
   */
  async fetchVideoMetadata(videoId: string): Promise<YouTubeVideo> {
    const videos = await this.fetchVideoMetadataBatch([videoId])
    if (videos.length === 0) {
      throw new Error(`Video ${videoId} not found`)
    }
    return videos[0]
  }

  /**
   * Parse ISO 8601 duration format (PT4M13S) to seconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0

    const hours = parseInt(match[1] || '0', 10)
    const minutes = parseInt(match[2] || '0', 10)
    const seconds = parseInt(match[3] || '0', 10)

    return hours * 3600 + minutes * 60 + seconds
  }

  /**
   * Fetch transcript/captions for a video
   * 
   * Uses youtube-transcript package for public videos (simpler, no OAuth required)
   * Falls back to checking captions availability via API if transcript fetch fails
   */
  async fetchTranscript(videoId: string, languageCode: string = 'en'): Promise<string> {
    try {
      // Use youtube-transcript package for public videos
      // This doesn't require OAuth and works well for most public videos
      const { YoutubeTranscript } = await import('youtube-transcript')
      
      try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
          lang: languageCode,
        })

        // Combine all transcript segments into full text
        const fullText = transcriptItems
          .map((item) => item.text)
          .join(' ')
          .trim()

        if (!fullText) {
          throw new Error('Transcript is empty')
        }

        return fullText
      } catch (transcriptError) {
        // If youtube-transcript fails, check if captions exist via API
        const hasCaptions = await this.hasCaptions(videoId)
        
        if (!hasCaptions) {
          throw new Error(`No captions available for video ${videoId}`)
        }

        // Captions exist but couldn't fetch - might be private or region-restricted
        const message =
          transcriptError instanceof Error ? transcriptError.message : String(transcriptError)
        throw new Error(
          `Failed to fetch transcript (captions may be private or restricted): ${message}`
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to fetch transcript: ${message}`)
    }
  }

  /**
   * Fetch transcript with timestamps
   * Returns transcript segments with start/end times
   */
  async fetchTranscriptWithTimestamps(
    videoId: string,
    languageCode: string = 'en'
  ): Promise<Array<{ text: string; start: number; duration: number }>> {
    try {
      const { YoutubeTranscript } = await import('youtube-transcript')
      
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: languageCode,
      })

      return transcriptItems.map((item) => ({
        text: item.text,
        start: item.offset / 1000, // Convert milliseconds to seconds
        duration: item.duration / 1000, // Convert milliseconds to seconds
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to fetch transcript with timestamps: ${message}`)
    }
  }

  /**
   * Check if a video has captions available
   */
  async hasCaptions(videoId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<YouTubeApiResponse<{
        id: string
      }>>('captions', {
        part: 'id',
        videoId,
      })
      return response.items && response.items.length > 0
    } catch (error) {
      // If captions.list fails, assume no captions
      return false
    }
  }

  /**
   * Convert YouTube video to VideoRecord format
   * Helper method for ingestion pipeline
   */
  static convertToVideoRecord(
    video: YouTubeVideo,
    channelUrl?: string
  ): {
    sourceId: string
    source: 'youtube'
    title: string
    description: string | null
    publishedAt: Date
    duration: number
    viewCount: number | null
    channelId: string
    channelName: string
    channelUrl: string | null
    thumbnailUrl: string | null
    videoUrl: string
    tags: string[]
    metadata: Record<string, unknown>
  } {
    return {
      sourceId: video.id,
      source: 'youtube',
      title: video.title,
      description: video.description || null,
      publishedAt: new Date(video.publishedAt),
      duration: video.duration,
      viewCount: video.viewCount || null,
      channelId: video.channelId,
      channelName: video.channelTitle,
      channelUrl: channelUrl || `https://www.youtube.com/channel/${video.channelId}`,
      thumbnailUrl: video.thumbnailUrl || null,
      videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      tags: video.tags || [],
      metadata: {
        youtube: {
          id: video.id,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
        },
      },
    }
  }

  /**
   * Get video URL from video ID
   */
  static getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  /**
   * Get channel URL from channel ID
   */
  static getChannelUrl(channelId: string): string {
    return `https://www.youtube.com/channel/${channelId}`
  }
}

