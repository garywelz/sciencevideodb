# Ingestion Pipeline Documentation

## Overview

The ingestion pipeline is responsible for:
1. Fetching videos from approved channels
2. Extracting and storing transcripts
3. Generating embeddings for semantic search
4. Indexing videos in the search engine
5. Storing metadata in PostgreSQL

## Channel Registry

Channels are registered in the `channels` table with:
- Platform-specific channel ID
- Priority (1-10, higher = more important)
- Update cadence (hourly, daily, weekly)
- Disciplines it belongs to
- Active status

## Ingestion Flow

### 1. Channel Selection

The worker queries the channel registry:
- Filters for active channels
- Checks last_checked_at against update_cadence
- Orders by priority

### 2. Video Discovery

For each channel:
- Fetch channel's uploads playlist ID
- Use YouTube Data API `playlistItems.list` to get videos
- Filter by `publishedAfter` = `last_video_at` or `last_checked_at`
- Limit to last 50 videos per run (adjustable)

### 3. Metadata Extraction

For each video:
- Fetch full metadata via `videos.list` API
- Extract: title, description, published date, duration, view count, thumbnail
- Determine disciplines (via tags, channel, or classification model)
- Store or update in `videos` table

### 4. Transcript Extraction

- Check if video has captions via `captions.list`
- Download transcript (prefer manual, fallback to auto-generated)
- Parse into time-stamped segments
- Store in `transcript_segments` table
- Update video record: `transcript_available = true`

### 5. Embedding Generation

- Concatenate: title + description + transcript (first 8000 chars)
- Generate embedding via OpenAI API or local model
- Store embedding in vector DB (Pinecone/Weaviate/Qdrant)
- Store `embedding_id` in video record

### 6. Search Indexing

- Index structured fields in Meilisearch/OpenSearch:
  - Title, description (full-text search)
  - Disciplines, tags, channel (facets)
  - Published date, duration (filters)
- Store `search_index_id` in video record

### 7. Registry Update

- Update channel `last_checked_at`
- Update `last_video_at` if new videos found
- Log ingestion status

## Error Handling

- **API Quota Exceeded**: Pause ingestion, log error, retry after delay
- **Video Not Found**: Skip, log warning
- **Transcript Unavailable**: Continue without transcript, mark `transcript_available = false`
- **Embedding Failure**: Retry with exponential backoff, skip if persistent
- **Database Error**: Rollback transaction, log error, continue with next video

## Rate Limiting

YouTube Data API quotas:
- Default: 10,000 units per day
- `channels.list`: 1 unit
- `playlistItems.list`: 1 unit
- `videos.list`: 1 unit
- `captions.list`: 1 unit
- `captions.download`: 50 units

Strategy:
- Batch API calls where possible
- Cache channel metadata
- Only fetch new videos (incremental)
- Distribute load across day

## Scheduling

### Vercel Cron Jobs

```json
{
  "crons": [
    {
      "path": "/api/cron/ingest-hourly",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/ingest-daily",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### External Worker (Alternative)

Use Temporal, Airflow, or similar for:
- More complex scheduling
- Better error handling and retries
- Monitoring and observability

## Monitoring

Track:
- Videos processed per run
- Videos new vs. updated
- API quota usage
- Processing time per channel
- Error rates
- Transcript availability rate

## Future Enhancements

- **Batch Processing**: Process multiple channels in parallel
- **Incremental Transcript Updates**: Re-extract if video updated
- **Quality Scoring**: Score video quality/relevance, filter low-quality
- **Duplicate Detection**: Detect and merge duplicate videos across channels
- **Multi-language**: Support transcripts in multiple languages
- **Thumbnail Extraction**: Extract and store keyframe thumbnails

