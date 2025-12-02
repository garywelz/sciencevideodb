# Cloud Run Deployment Guide

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed locally
3. Service account created (see [Google Cloud Setup](./GOOGLE_CLOUD_SETUP.md))

## Build and Deploy

### 1. Build the Docker Image

```bash
# Build the ingestion worker
docker build -t gcr.io/regal-scholar-453620-r7/scienceviddb-ingestion:latest \
  -f Dockerfile.ingestion .

# Push to Google Container Registry
docker push gcr.io/regal-scholar-453620-r7/scienceviddb-ingestion:latest
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy scienceviddb-ingestion \
  --image gcr.io/regal-scholar-453620-r7/scienceviddb-ingestion:latest \
  --platform managed \
  --region us-central1 \
  --project regal-scholar-453620-r7 \
  --service-account scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com \
  --set-env-vars="USE_SECRETS_MANAGER=true,GOOGLE_CLOUD_PROJECT=regal-scholar-453620-r7" \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --max-instances 10 \
  --allow-unauthenticated
```

### 3. Set Up Cloud Scheduler (for cron jobs)

```bash
# Create a job to run hourly for high-priority channels
gcloud scheduler jobs create http scienceviddb-ingest-hourly \
  --location=us-central1 \
  --schedule="0 * * * *" \
  --uri="https://scienceviddb-ingestion-XXXXX.run.app/ingest?mode=hourly" \
  --http-method=POST \
  --oidc-service-account-email=scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com \
  --project=regal-scholar-453620-r7

# Create a job to run daily for all channels
gcloud scheduler jobs create http scienceviddb-ingest-daily \
  --location=us-central1 \
  --schedule="0 2 * * *" \
  --uri="https://scienceviddb-ingestion-XXXXX.run.app/ingest?mode=daily" \
  --http-method=POST \
  --oidc-service-account-email=scienceviddb-ingestion@regal-scholar-453620-r7.iam.gserviceaccount.com \
  --project=regal-scholar-453620-r7
```

## Dockerfile

Create `Dockerfile.ingestion`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/gcp-utils/package.json ./packages/gcp-utils/
COPY packages/ingestion/package.json ./packages/ingestion/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/gcp-utils ./packages/gcp-utils
COPY packages/ingestion ./packages/ingestion

# Build packages
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/gcp-utils
RUN npm run build --workspace=packages/ingestion

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/gcp-utils/package.json ./packages/gcp-utils/
COPY packages/ingestion/package.json ./packages/ingestion/

RUN npm ci --production

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/gcp-utils/dist ./packages/gcp-utils/dist
COPY --from=builder /app/packages/ingestion/dist ./packages/ingestion/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/gcp-utils/package.json ./packages/gcp-utils/
COPY --from=builder /app/packages/ingestion/package.json ./packages/ingestion/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the service
CMD ["node", "packages/ingestion/dist/index.js"]
```

## Health Check Endpoint

The ingestion worker should expose a health check endpoint at `/health` for Cloud Run's health checks.

## Environment Variables

Set in Cloud Run:
- `USE_SECRETS_MANAGER=true`
- `GOOGLE_CLOUD_PROJECT=regal-scholar-453620-r7`
- `NODE_ENV=production`

All other secrets are fetched from Google Secrets Manager automatically.

## Monitoring

View logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=scienceviddb-ingestion" \
  --project=regal-scholar-453620-r7 \
  --limit 50
```

View metrics in Cloud Console:
- Navigate to Cloud Run → scienceviddb-ingestion → Metrics

