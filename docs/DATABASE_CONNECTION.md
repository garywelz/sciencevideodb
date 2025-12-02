# Database Connection Setup

## Current Issue

The `copernicus-db-url` secret contains a Cloud SQL connection string that uses a Unix socket:
```
/cloudsql/regal-scholar-453620-r7:us-central1:copernicus-db
```

This **only works when running on Google Cloud** (Cloud Run, GCE, etc.). For local development, you need a TCP/IP connection.

## Solutions

### Option 1: Use Local PostgreSQL (Recommended for Development)

Set up a local PostgreSQL database:

```bash
# Install PostgreSQL (if not already installed)
sudo apt-get install postgresql

# Create database
createdb scienceviddb

# Set local database URL
export DATABASE_URL="postgresql://your_username@localhost:5432/scienceviddb"
export USE_SECRETS_MANAGER=false

# Test connection
npm run db:test
```

### Option 2: Use Cloud SQL Public IP

If your Cloud SQL instance has a public IP:

1. Get the public IP from Google Cloud Console
2. Update the connection string:
   ```bash
   export DATABASE_URL="postgresql://user:password@PUBLIC_IP:5432/database_name"
   export USE_SECRETS_MANAGER=false
   ```

### Option 3: Use Cloud SQL Proxy (For Local Development)

Install and use Cloud SQL Proxy to connect locally:

```bash
# Download Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Run proxy in background
./cloud-sql-proxy regal-scholar-453620-r7:us-central1:copernicus-db &

# Use localhost connection
export DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
export USE_SECRETS_MANAGER=false
```

### Option 4: Create New Database (Supabase/Neon)

For a clean start, create a new database:

1. **Supabase**: https://supabase.com
   - Free tier available
   - Get connection string from dashboard
   
2. **Neon**: https://neon.tech
   - Serverless PostgreSQL
   - Free tier available

Then update the secret:
```bash
echo -n "postgresql://user:password@host:5432/scienceviddb" | \
  gcloud secrets versions add scienceviddb-database-url \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

## Quick Test (Once Connected)

```bash
# Test connection
npm run db:test

# Run migrations
npm run db:migrate

# Test again to see tables
npm run db:test
```

## What Gets Stored (Reminder)

✅ **Text Only:**
- Video metadata (titles, descriptions, tags)
- Transcript segments (text with timestamps)
- Channel information
- URLs (to videos, thumbnails)

❌ **No Binary Files:**
- No video files
- No audio files
- No images (only URLs)

