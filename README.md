---
title: Science Video Database
emoji: 🔬
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
---

---
title: Science Video Database
emoji: 🔬
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
---

# Science Video Database (scienceviddb)

A curated search experience for technical science enthusiasts, featuring biology, chemistry, CS, mathematics, and physics videos from YouTube and other sources.

## Links

- **GitHub Repository**: [garywelz/sciencevideodb](https://github.com/garywelz/sciencevideodb)
- **HuggingFace Space**: [garywelz/sciencevideodb](https://huggingface.co/spaces/garywelz/sciencevideodb)

## Project Structure

This is a mono-repo containing:

- `apps/web` - Next.js 14 frontend (App Router)
- `packages/ingestion` - Video ingestion worker
- `packages/shared` - Shared TypeScript types and utilities
- `packages/gcp-utils` - Google Cloud Platform utilities (Secrets Manager, GCS, Vertex AI)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Supabase/Neon recommended)
- YouTube Data API key

### Installation

```bash
npm install
```

### Development

Start the Next.js development server:

```bash
npm run dev
```

Run the ingestion worker:

```bash
npm run ingest
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System architecture, data flow, and design decisions
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions and configuration
- [Google Cloud Setup](./docs/GOOGLE_CLOUD_SETUP.md) - Google Cloud Platform integration (Secrets Manager, GCS, Vertex AI)
- [Cloud Run Deployment](./docs/CLOUD_RUN_DEPLOYMENT.md) - Deploying to Google Cloud Run
- [YouTube Client Implementation](./docs/YOUTUBE_CLIENT_IMPLEMENTATION.md) - YouTube API client details
- [Testing Guide](./docs/TESTING.md) - How to run tests
- [Ingestion Pipeline](./docs/INGESTION.md) - How video ingestion works
- [Database Schema](./docs/schema.sql) - PostgreSQL schema definition

## Milestones

### Prototype (Current Phase)
- 10-15 channels, ~2k videos
- Basic ingestion pipeline
- Transcript storage
- Hybrid search UI with filters

### Alpha (Next Phase)
- 50+ channels, 20k videos
- Personalization MVP
- Email digests
- Improved UX polish

### Scaling (Future)
- 200k videos
- Autoscaling workers
- Admin dashboard
- Automated QA

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React Server Components
- **Backend**: Node.js/TypeScript serverless functions
- **Database**: PostgreSQL (Supabase/Neon)
- **Vector DB**: Pinecone/Weaviate/Qdrant
- **Search**: OpenSearch/Elasticsearch or Meilisearch
- **Cloud Platform**: Google Cloud Platform (regal-scholar-453620-r7)
  - Secrets Manager (for API keys)
  - Cloud Storage (for assets)
  - Vertex AI (for embeddings)
  - Cloud Run (for deployment)
- **Deployment**: Vercel (frontend) / Google Cloud Run (ingestion)

## License

MIT
