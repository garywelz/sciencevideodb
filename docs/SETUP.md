# Setup Guide

## Prerequisites

1. **Node.js 18+** - Install from [nodejs.org](https://nodejs.org/) or use nvm:
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **PostgreSQL Database** - Choose one:
   - [Supabase](https://supabase.com) (recommended for quick start)
   - [Neon](https://neon.tech) (serverless PostgreSQL)
   - Local PostgreSQL instance

3. **YouTube Data API Key** - Get from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a project
   - Enable YouTube Data API v3
   - Create API key credentials

4. **Vector Database** (choose one):
   - [Pinecone](https://www.pinecone.io) - Easiest managed option
   - [Weaviate Cloud](https://weaviate.io) - Self-hostable
   - [Qdrant Cloud](https://cloud.qdrant.io) - Open-source alternative

5. **Search Index** (choose one):
   - [Meilisearch Cloud](https://www.meilisearch.com) - Fast, easy setup
   - [OpenSearch](https://opensearch.org) - More features, higher complexity
   - Local Meilisearch instance

6. **Embedding Service**:
   - [OpenAI API](https://platform.openai.com) - Recommended (text-embedding-3-large)
   - OR use local model (e.g., sentence-transformers)

## Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd scienceviddb
   npm install
   ```

2. **Set up environment variables**:
   Create `.env` file in the root directory (see `.env.example` for template):
   ```bash
   # Copy example (if available) or create manually
   cp .env.example .env
   ```
   
   Fill in required values:
   - `DATABASE_URL` - PostgreSQL connection string
   - `YOUTUBE_API_KEY` - Your YouTube API key
   - Vector DB credentials (one of Pinecone/Weaviate/Qdrant)
   - Search index credentials (Meilisearch or OpenSearch)
   - `OPENAI_API_KEY` - For embeddings

3. **Set up the database**:
   ```bash
   # Run the schema SQL
   psql $DATABASE_URL -f docs/schema.sql
   
   # OR if using Supabase/Neon, use their SQL editor
   ```

4. **Build shared package**:
   ```bash
   cd packages/shared
   npm run build
   cd ../..
   ```

## Running Locally

### Frontend Development Server

```bash
npm run dev
```

This starts the Next.js dev server at `http://localhost:3000`

### Ingestion Worker

```bash
# Ingest all active channels
npm run ingest -- --all

# Ingest specific channel
npm run ingest -- --channel <channel-id>
```

## Adding Channels

Add channels to the database to start ingesting:

```sql
INSERT INTO channels (
    channel_id,
    channel_name,
    channel_url,
    disciplines,
    priority,
    update_cadence
) VALUES (
    'UC_x5XG1OV2P6uZZ5FSM9Ttw',  -- YouTube channel ID
    'Google Developers',
    'https://www.youtube.com/@GoogleDevelopers',
    ARRAY['cs'],
    8,
    'daily'
);
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel will automatically:
- Deploy Next.js app
- Run serverless API routes
- Execute cron jobs for ingestion

### Manual Deployment

See deployment guides for:
- Database: Supabase/Neon docs
- Vector DB: Provider-specific docs
- Search Index: Meilisearch/OpenSearch docs

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check firewall/network access
- Verify SSL settings if using cloud database

### YouTube API Quota Exceeded

- Check quota in Google Cloud Console
- Reduce ingestion frequency
- Use incremental fetching (only new videos)

### Build Errors

- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Build shared package first: `npm run build --workspace=packages/shared`

## Next Steps

1. Add your first channels to the database
2. Run ingestion manually to test
3. Set up cron jobs for automatic ingestion
4. Customize frontend UI
5. Implement search API integration

