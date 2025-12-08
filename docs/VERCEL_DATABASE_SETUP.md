# Vercel Database Connection Setup

## Current Situation

The database connection string in Secrets Manager uses `localhost:5433` which is for local development with Cloud SQL Proxy. **This won't work on Vercel.**

## Options for Vercel

### Option 1: Use Public IP (Recommended for Now)

1. **Get Database Password**
   - Check if password is in Secrets Manager
   - Or reset password: `gcloud sql users set-password scienceviddb_user --instance=scienceviddb-db --project=regal-scholar-453620-r7`

2. **Connection String Format**
   ```
   postgresql://scienceviddb_user:PASSWORD@34.31.235.165:5432/scienceviddb
   ```

3. **Set in Vercel**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `DATABASE_URL` = connection string above
   - **Important**: Also add to Preview and Development environments

4. **Security**
   - Restrict IP access in Cloud SQL settings
   - Add Vercel's IP ranges to allowed list
   - Or use Cloud SQL Auth Proxy (Option 2)

### Option 2: Use Vercel's Google Cloud SQL Integration (Better Security)

Vercel supports direct integration with Google Cloud SQL:

1. **Enable Cloud SQL API**
   ```bash
   gcloud services enable sqladmin.googleapis.com --project=regal-scholar-453620-r7
   ```

2. **In Vercel Dashboard**
   - Go to Project Settings → Integrations
   - Add Google Cloud SQL integration
   - Select instance: `scienceviddb-db`
   - Vercel will handle connection automatically

3. **Connection String**
   - Vercel provides connection string automatically
   - Uses Unix socket: `/cloudsql/regal-scholar-453620-r7:us-central1:scienceviddb-db`

### Option 3: Use Connection Pooler (Recommended for Production)

1. **Enable Cloud SQL Proxy**
   - Use PgBouncer or Cloud SQL Proxy
   - More secure and scalable

2. **Connection Pooling Service**
   - Use a service like Supabase, Neon, or Railway
   - They provide connection pooling out of the box

## Current Database Info

- **Instance**: `scienceviddb-db`
- **Public IP**: `34.31.235.165`
- **Database**: `scienceviddb`
- **User**: `scienceviddb_user`
- **Connection Name**: `regal-scholar-453620-r7:us-central1:scienceviddb-db`

## Next Steps

1. **Get/Set Database Password**
2. **Choose connection method** (Public IP for now, Cloud SQL integration later)
3. **Set DATABASE_URL in Vercel**
4. **Test connection**

