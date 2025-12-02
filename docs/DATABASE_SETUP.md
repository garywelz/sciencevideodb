# Database Setup Guide

## Overview

The database package (`packages/db`) provides PostgreSQL integration for the Science Video Database.

## Features

- ✅ Connection pooling with `pg` library
- ✅ Transaction support
- ✅ Type-safe queries with TypeScript
- ✅ Model conversion (DB rows → TypeScript types)
- ✅ CRUD operations for channels, videos, and transcripts
- ✅ Migration system

## Setup

### 1. Create Database Secret

Add the database URL to Google Secrets Manager:

```bash
gcloud config set project regal-scholar-453620-r7

echo -n "postgresql://user:password@host:5432/scienceviddb" | \
  gcloud secrets versions add scienceviddb-database-url \
  --data-file=-
```

Or for local development, set environment variable:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/scienceviddb"
export USE_SECRETS_MANAGER=false
```

### 2. Run Migrations

Set up the database schema:

```bash
npm run db:migrate
```

This will:
- Create all tables (channels, videos, transcript_segments, user_preferences)
- Set up indexes
- Create triggers for `updated_at` timestamps
- Enable required PostgreSQL extensions

### 3. Test Connection

Test the database connection:

```bash
npm run db:test
```

## Usage

### Basic Connection

```typescript
import { query, testConnection } from '@scienceviddb/db'

// Test connection
const connected = await testConnection()

// Execute a query
const result = await query('SELECT * FROM channels LIMIT 10')
```

### Channel Operations

```typescript
import { getActiveChannels, createChannel, updateChannelLastChecked } from '@scienceviddb/db'

// Get all active channels
const channels = await getActiveChannels()

// Create a new channel
const channel = await createChannel({
  channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  channelName: 'Google Developers',
  channelUrl: 'https://www.youtube.com/@GoogleDevelopers',
  source: 'youtube',
  disciplines: ['cs'],
  priority: 8,
  updateCadence: 'daily',
  isActive: true,
  tags: [],
  metadata: {},
})

// Update last checked time
await updateChannelLastChecked(channel.id, new Date())
```

### Video Operations

```typescript
import { upsertVideo, getVideoBySourceId, getVideosByChannel } from '@scienceviddb/db'

// Create or update a video
const video = await upsertVideo({
  sourceId: 'V8COJv2dG2g',
  source: 'youtube',
  title: 'Video Title',
  description: 'Video description...',
  publishedAt: new Date(),
  duration: 300,
  viewCount: 1000,
  channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Platform channel ID
  thumbnailUrl: 'https://...',
  videoUrl: 'https://www.youtube.com/watch?v=...',
  disciplines: ['cs'],
  tags: ['programming'],
  transcriptAvailable: true,
  embeddingId: null,
  searchIndexId: null,
  metadata: {},
})

// Get video by source ID
const video = await getVideoBySourceId('V8COJv2dG2g', 'youtube')

// Get videos by channel
const videos = await getVideosByChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw', 50, 0)
```

### Transcript Operations

```typescript
import { 
  insertTranscriptSegments, 
  getTranscriptSegments,
  searchTranscriptSegments 
} from '@scienceviddb/db'

// Insert transcript segments
await insertTranscriptSegments(videoId, [
  { text: 'Hello world', startTime: 0, endTime: 2, confidence: 0.95 },
  { text: 'This is a test', startTime: 2, endTime: 5, confidence: 0.92 },
])

// Get transcript segments
const segments = await getTranscriptSegments(videoId)

// Search transcripts
const results = await searchTranscriptSegments('machine learning', 10)
```

### Transactions

```typescript
import { transaction } from '@scienceviddb/db'

await transaction(async (client) => {
  // Multiple operations in a transaction
  await client.query('INSERT INTO videos ...')
  await client.query('INSERT INTO transcript_segments ...')
  // Automatically commits or rolls back
})
```

## Database Schema

See `docs/schema.sql` for the complete schema definition.

### Tables

- **channels** - Channel registry for ingestion
- **videos** - Canonical video records
- **transcript_segments** - Time-stamped transcript chunks
- **user_preferences** - User personalization (future)

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `USE_SECRETS_MANAGER` - Use Google Secrets Manager (default: true in production)

## Troubleshooting

### Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check firewall/network access
- Verify SSL settings if using cloud database

### Migration Errors

- Some statements may fail if they already exist (extensions, triggers) - this is normal
- Check PostgreSQL logs for detailed error messages
- Ensure you have CREATE privileges on the database

### Query Errors

- Verify tables exist (run migrations)
- Check foreign key constraints (channels must exist before videos)
- Ensure data types match schema

