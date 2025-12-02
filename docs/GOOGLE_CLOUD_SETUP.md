# Google Cloud Setup for Science Video Database

## Project Configuration

This project is integrated with Google Cloud Platform under the **CopernicusAI** umbrella:

- **Project ID**: `regal-scholar-453620-r7`
- **Services Used**:
  - Google Secrets Manager (for API keys and credentials)
  - Google Cloud Storage (for transcript and thumbnail caching)
  - Vertex AI (for embeddings and ML models)
  - Cloud Run (for deployment)

## Authentication

### Local Development

For local development, you need to authenticate with Google Cloud:

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# OR set the service account key file
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/regal-scholar-453620-r7-8d7d422d95fa.json"
```

### Production/Cloud Run

When deployed to Cloud Run, authentication is handled automatically via the service account attached to the Cloud Run service.

## Required Secrets in Google Secrets Manager

The following secrets must be created in Google Secrets Manager (project: `regal-scholar-453620-r7`):

### Create Secrets

```bash
# Set your project
gcloud config set project regal-scholar-453620-r7

# Create YouTube API key secret
echo -n "YOUR_YOUTUBE_API_KEY" | gcloud secrets create youtube-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Create database URL secret
echo -n "postgresql://user:password@host:5432/scienceviddb" | gcloud secrets create scienceviddb-database-url \
  --data-file=- \
  --replication-policy="automatic"

# Create OpenAI API key secret (optional, if using OpenAI for embeddings)
echo -n "YOUR_OPENAI_API_KEY" | gcloud secrets create openai-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Create vector DB API key secret (if using Pinecone or similar)
echo -n "YOUR_VECTOR_DB_API_KEY" | gcloud secrets create vector-db-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Create search index API key secret (if using Meilisearch or similar)
echo -n "YOUR_SEARCH_INDEX_API_KEY" | gcloud secrets create search-index-api-key \
  --data-file=- \
  --replication-policy="automatic"
```

### Grant Access to Secrets

Grant access to the Cloud Run service account:

```bash
# Get the Cloud Run service account email
SERVICE_ACCOUNT="scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com"

# Grant access to secrets
gcloud secrets add-iam-policy-binding youtube-api-key \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding scienceviddb-database-url \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

## Google Cloud Storage Bucket

Create a bucket for storing transcripts, thumbnails, and other assets:

```bash
# Create bucket
gsutil mb -p regal-scholar-453620-r7 -l us-central1 gs://scienceviddb-assets

# Make it publicly readable (for thumbnails)
gsutil iam ch allUsers:objectViewer gs://scienceviddb-assets
```

## Vertex AI Setup

Vertex AI is used for generating embeddings. Enable the Vertex AI API:

```bash
gcloud services enable aiplatform.googleapis.com \
  --project=regal-scholar-453620-r7
```

### Embedding Model

The default embedding model is `textembedding-gecko@003`. Ensure your service account has permissions:

```bash
gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user"
```

## Environment Variables

### Local Development

For local development, you can either:

1. **Use environment variables** (easiest):
   ```bash
   export YOUTUBE_API_KEY="your-key"
   export DATABASE_URL="postgresql://..."
   export USE_SECRETS_MANAGER=false
   ```

2. **Use Google Secrets Manager**:
   ```bash
   export USE_SECRETS_MANAGER=true
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   ```

### Cloud Run

Set environment variables in Cloud Run:

```bash
gcloud run services update scienceviddb-ingestion \
  --set-env-vars="USE_SECRETS_MANAGER=true,GOOGLE_CLOUD_PROJECT=regal-scholar-453620-r7" \
  --project=regal-scholar-453620-r7
```

## Service Account

Create a service account for the ingestion worker:

```bash
# Create service account
gcloud iam service-accounts create scienceviddb-ingestion \
  --display-name="Science Video DB Ingestion Worker" \
  --project=regal-scholar-453620-r7

# Grant necessary permissions
SERVICE_ACCOUNT="scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user"
```

## Deployment

See [Cloud Run Deployment](./CLOUD_RUN_DEPLOYMENT.md) for deployment instructions.

## Verification

Test the setup:

```bash
# Test secrets access
npm run ingest -- --test-secrets

# Test YouTube API connection
npm run ingest -- --test-youtube
```

