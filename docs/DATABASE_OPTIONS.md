# Database Options for Science Video DB

## Current Situation

There's a `copernicus-db-url` secret in Secrets Manager. You have two options:

### Option 1: Use Existing Copernicus Database (Shared)

**Pros:**
- Already set up and working
- No additional setup needed
- Shared infrastructure

**Cons:**
- Shared with CopernicusAI project
- May want separate database for isolation

**To use:**
```bash
# Update the secret name in code, or create an alias
echo -n "$(gcloud secrets versions access latest --secret=copernicus-db-url --project=regal-scholar-453620-r7)" | \
  gcloud secrets versions add scienceviddb-database-url \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### Option 2: Create New Database (Recommended for Production)

**Pros:**
- Clean separation from CopernicusAI
- Independent scaling
- Better organization

**Cons:**
- Need to set up new database
- Additional cost

**Options for new database:**
1. **Supabase** - Easy setup, free tier available
2. **Neon** - Serverless PostgreSQL, good for scaling
3. **Google Cloud SQL** - Managed PostgreSQL in GCP
4. **Local PostgreSQL** - For development

## Recommendation

For **development/testing**: Use the existing `copernicus-db-url` (Option 1)

For **production**: Create a separate database (Option 2) for better isolation

## What Gets Stored (Text Only)

✅ **Stored in Database:**
- Video metadata (title, description, tags, etc.) - **TEXT**
- Transcript segments with timestamps - **TEXT**
- Channel registry information - **TEXT**
- URLs to videos/thumbnails - **TEXT**
- Embedding IDs and search index IDs - **TEXT**

❌ **NOT Stored:**
- Video files (stay on YouTube)
- Audio files
- Thumbnail images (only URLs)
- Any binary/large files

The database is **lightweight and text-based** - perfect for metadata and transcripts!

