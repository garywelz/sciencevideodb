# YouTube API Client Implementation

## Overview

The YouTube API client has been fully implemented with comprehensive functionality for fetching channel information, videos, metadata, and transcripts from YouTube.

## Features

### 1. Channel Information (`fetchChannelInfo`)
- Fetches channel details including title, description, thumbnail
- Retrieves uploads playlist ID (needed to fetch channel videos)
- Returns structured `YouTubeChannel` object

### 2. Channel Videos (`fetchChannelVideos`)
- Fetches videos from a channel's uploads playlist
- Supports filtering by `publishedAfter` date
- Handles pagination automatically
- Supports `maxResults` limit
- Returns array of `YouTubeVideo` objects

### 3. Video Metadata
- **`fetchVideoMetadata`**: Fetch single video details
- **`fetchVideoMetadataBatch`**: Fetch multiple videos efficiently (up to 50 at a time)
- Includes: title, description, duration, view count, tags, thumbnails
- Automatically parses ISO 8601 duration format to seconds

### 4. Transcripts
- **`fetchTranscript`**: Fetch full transcript as text
- **`fetchTranscriptWithTimestamps`**: Fetch transcript with start times and durations
- Uses `youtube-transcript` package for public videos (no OAuth required)
- Handles language preferences and fallbacks
- Graceful error handling if captions unavailable

### 5. Utility Methods
- **`hasCaptions`**: Check if a video has captions available
- **`convertToVideoRecord`**: Convert YouTube video to internal `VideoRecord` format
- **`getVideoUrl`**: Generate YouTube video URL
- **`getChannelUrl`**: Generate YouTube channel URL

## Error Handling

- **Rate Limiting**: Built-in rate limiting (100ms minimum between requests)
- **API Errors**: Detailed error messages with HTTP status codes
- **Quota Exceeded**: Specific error message for API quota issues
- **Missing Data**: Graceful handling of missing videos, channels, or captions

## Usage Example

```typescript
import { YouTubeClient } from '@scienceviddb/ingestion/youtube/client'
import { getYouTubeApiKey } from '@scienceviddb/gcp-utils'

// Initialize client
const apiKey = await getYouTubeApiKey()
const client = new YouTubeClient(apiKey)

// Fetch channel info
const channel = await client.fetchChannelInfo('UC_x5XG1OV2P6uZZ5FSM9Ttw')

// Fetch recent videos
const videos = await client.fetchChannelVideos(channel.id, undefined, 10)

// Fetch video metadata
const video = await client.fetchVideoMetadata(videos[0].id)

// Fetch transcript
const transcript = await client.fetchTranscript(video.id)
```

## Integration with GCP

The client is designed to work seamlessly with Google Cloud Platform:

1. **API Key**: Fetched from Google Secrets Manager via `@scienceviddb/gcp-utils`
2. **Error Handling**: Proper error messages for quota and authentication issues
3. **Rate Limiting**: Prevents quota exhaustion

## Dependencies

- `youtube-transcript` - For fetching public video transcripts without OAuth

## API Quota Considerations

YouTube Data API v3 has a default quota of 10,000 units per day:

- `channels.list`: 1 unit
- `playlistItems.list`: 1 unit  
- `videos.list`: 1 unit
- `captions.list`: 1 unit

The client includes rate limiting to help manage quota usage. For production:

1. Batch requests where possible (using `fetchVideoMetadataBatch`)
2. Only fetch new videos since last check (use `publishedAfter` parameter)
3. Cache channel information
4. Monitor quota usage in Google Cloud Console

## File Structure

```
packages/ingestion/src/youtube/
├── client.ts        # Main YouTubeClient class
└── example.ts       # Usage examples
```

## Next Steps

The YouTube client is ready to be integrated into the ingestion pipeline:

1. Update `packages/ingestion/src/index.ts` to use the YouTubeClient
2. Connect to database for storing video records
3. Implement transcript storage
4. Add embedding generation
5. Set up search indexing

## Testing

See `packages/ingestion/src/youtube/example.ts` for comprehensive usage examples.

To test:
```bash
cd packages/ingestion
npm run ingest -- --test-youtube
```

