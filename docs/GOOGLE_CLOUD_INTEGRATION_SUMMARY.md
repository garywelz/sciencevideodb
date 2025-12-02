# Google Cloud Integration Summary

## Project Configuration

**Project ID**: `regal-scholar-453620-r7`

This project is integrated with Google Cloud Platform as part of the CopernicusAI umbrella.

## What's Been Set Up

### 1. GCP Utils Package (`packages/gcp-utils/`)

A dedicated package for Google Cloud Platform integration:

- **Secrets Manager** (`src/secrets.ts`):
  - Fetch secrets from Google Secrets Manager
  - Caching for performance
  - Pre-configured secret names for common credentials
  - Helper functions for YouTube API key, database URL, etc.

- **Cloud Storage** (`src/storage.ts`):
  - Upload/download files to/from GCS
  - File existence checks
  - Public URL generation
  - Bucket: `scienceviddb-assets`

- **Vertex AI** (`src/vertex-ai.ts`):
  - Generate embeddings using Vertex AI models
  - Default model: `textembedding-gecko@003`
  - Batch and single embedding generation

### 2. Configuration (`packages/ingestion/src/config/gcp.ts`)

Centralized GCP configuration that:
- Automatically uses Secrets Manager in production
- Falls back to environment variables for local development
- Caches configuration for performance

### 3. Documentation

- `docs/GOOGLE_CLOUD_SETUP.md` - Complete setup guide
- `docs/CLOUD_RUN_DEPLOYMENT.md` - Deployment instructions
- `.env.local.example` - Local development environment template

### 4. Deployment Configuration

- `cloud-run.yaml` - Cloud Run service configuration
- Dockerfile instructions for Cloud Run deployment

## Required Secrets in Secrets Manager

These secrets need to be created in Google Secrets Manager:

1. `youtube-api-key` - YouTube Data API v3 key
2. `scienceviddb-database-url` - PostgreSQL connection string
3. `openai-api-key` - (Optional) OpenAI API key for embeddings
4. `vector-db-api-key` - (Optional) Vector database API key
5. `search-index-api-key` - (Optional) Search index API key

## Required GCP Resources

1. **GCS Bucket**: `scienceviddb-assets` (for transcripts, thumbnails)
2. **Service Account**: `scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com`
3. **Cloud Run Service**: `scienceviddb-ingestion` (for ingestion worker)
4. **Cloud Scheduler Jobs**: For automated ingestion (hourly/daily)

## Next Steps

1. **Create secrets in Secrets Manager** (see `docs/GOOGLE_CLOUD_SETUP.md`)
2. **Create GCS bucket** for assets
3. **Create service account** with appropriate permissions
4. **Install dependencies**: `npm install`
5. **Test locally** with `USE_SECRETS_MANAGER=true` or environment variables
6. **Implement YouTube API client** (TODO in `packages/ingestion/src/youtube/client.ts`)

## Usage Examples

### Fetching a Secret

```typescript
import { getYouTubeApiKey } from '@scienceviddb/gcp-utils'

const apiKey = await getYouTubeApiKey()
```

### Uploading to Cloud Storage

```typescript
import { uploadFile } from '@scienceviddb/gcp-utils'

const url = await uploadFile(
  'transcripts/video-123.txt',
  transcriptContent,
  'text/plain'
)
```

### Generating Embeddings with Vertex AI

```typescript
import { generateEmbedding } from '@scienceviddb/gcp-utils'

const embedding = await generateEmbedding('Video title and description...')
```

## Environment Variables

For local development, either:

1. Set `USE_SECRETS_MANAGER=false` and provide env vars directly
2. Set `USE_SECRETS_MANAGER=true` and authenticate with GCP

See `.env.local.example` for reference.

