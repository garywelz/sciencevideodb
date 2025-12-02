# Infrastructure Integration - Science Video DB in CopernicusAI Ecosystem

## Overview

Science Video Database is part of the **CopernicusAI umbrella project** on Google Cloud Platform, running in parallel with:

1. **CopernicusAI Admin Dashboard** (www.copernicusai.fyi/admin-dashboard.html)
2. **GLMP** (Hugging Face Space: garywelz/glmp)
3. **Other CopernicusAI services**

## Architecture Position

```
Google Cloud Project: regal-scholar-453620-r7
│
├── CopernicusAI Services
│   ├── Admin Dashboard (www.copernicusai.fyi)
│   ├── GLMP (Hugging Face)
│   └── Other services...
│
├── Science Video Database (NEW)
│   ├── Database: PostgreSQL (shared or dedicated)
│   ├── Ingestion Worker: Cloud Run
│   ├── Frontend: Next.js (Vercel or Cloud Run)
│   └── Storage: GCS bucket (scienceviddb-assets)
│
└── Shared Infrastructure
    ├── Google Cloud Storage (GCS)
    ├── Firebase (if used)
    ├── Secrets Manager
    └── Vertex AI
```

## Database Strategy

### Option 1: Shared Database (Current Setup)

**Using existing `copernicus-db-url`:**
- ✅ Same Cloud SQL instance
- ✅ Shared infrastructure
- ✅ Lower cost
- ⚠️ Tables mixed with CopernicusAI tables
- ⚠️ Need to ensure table names don't conflict

**Table naming**: Our tables are prefixed clearly:
- `channels` (science video channels)
- `videos` (science videos)
- `transcript_segments` (video transcripts)
- `user_preferences` (future)

These shouldn't conflict with CopernicusAI tables.

### Option 2: Separate Database (Recommended for Production)

**Create new Cloud SQL instance:**
- ✅ Complete isolation
- ✅ Independent scaling
- ✅ Separate backups
- ✅ Clear separation of concerns
- ⚠️ Additional cost (~$10-50/month)

**To create:**
```bash
gcloud sql instances create scienceviddb-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --project=regal-scholar-453620-r7
```

## Google Cloud Storage Integration

### Current GCS Usage

From your setup, I see:
- `GCP_AUDIO_BUCKET=gs://regal-scholar-453620-r7-media` (for CopernicusAI)

### Science Video DB GCS Bucket

We'll use:
- **Bucket**: `scienceviddb-assets` (or `regal-scholar-453620-r7-scienceviddb`)
- **Purpose**: 
  - Cached transcripts (if we want to cache them)
  - Thumbnail caching (optional)
  - Static assets for frontend

**Note**: Since we're storing transcripts in PostgreSQL (text), GCS is optional. We could use it for:
- Backup/archival of transcripts
- Large transcript files (if we store full raw transcripts)
- Thumbnail image caching

## Firebase Integration (If Used)

If you're using Firebase in CopernicusAI:

### Potential Integration Points

1. **Firebase Auth** (Future)
   - User authentication for Science Video DB
   - Share auth with CopernicusAI ecosystem

2. **Firebase Storage** (Alternative to GCS)
   - Could store transcripts/assets
   - But GCS is better for our use case

3. **Firebase Firestore** (Not needed)
   - We're using PostgreSQL for structured data
   - Firestore would be redundant

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Google Cloud Project: regal-scholar-453620-r7 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐         │
│  │  CopernicusAI    │    │  Science Video   │         │
│  │  Admin Dashboard │    │  Database        │         │
│  └──────────────────┘    └──────────────────┘         │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐         │
│  │  GLMP            │    │  Ingestion       │         │
│  │  (Hugging Face)  │    │  Worker          │         │
│  └──────────────────┘    └──────────────────┘         │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │  Shared Infrastructure                      │       │
│  │  - Cloud SQL (shared or separate)           │       │
│  │  - GCS Buckets                              │       │
│  │  - Secrets Manager                          │       │
│  │  - Vertex AI                                │       │
│  │  - Cloud Run (for workers)                  │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Database Decision

**Recommendation**: Start with **shared database** (Option 1) for development, then move to **separate database** (Option 2) for production.

**Why:**
- Development: Lower cost, easier setup
- Production: Better isolation, independent scaling

## Next Steps

1. **For Local Development**: Set up Cloud SQL Proxy or use local PostgreSQL
2. **For Production**: Create separate Cloud SQL instance or use shared one
3. **GCS Bucket**: Create `scienceviddb-assets` bucket
4. **Integration**: Ensure table names don't conflict with CopernicusAI

Would you like to:
- Use the shared database (copernicus-db-url)?
- Create a separate Cloud SQL instance?
- Set up Cloud SQL Proxy for local development?

