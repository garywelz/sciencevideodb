# Cloud Run Deployment for Next.js Web App

## Overview

Deploy the Science Video Database Next.js web app to Google Cloud Run. This avoids all the Vercel build issues and integrates seamlessly with your existing GCP infrastructure.

## Benefits

✅ **No build-time issues** - Runs as container, no static generation problems  
✅ **Direct Secrets Manager access** - No environment variables needed  
✅ **Cloud SQL integration** - Native connection support  
✅ **Link from copernicusai.fyi** - Simple redirect or iframe  
✅ **Cost-effective** - Pay only for requests  
✅ **Auto-scaling** - Handles traffic automatically  

## Prerequisites

1. Google Cloud SDK installed and configured
2. Docker installed locally
3. Service account with Secrets Manager access
4. Cloud SQL instance running

## Deployment Steps

### 1. Build Docker Image

```bash
# Build the web app
docker build -t gcr.io/regal-scholar-453620-r7/scienceviddb-web:latest \
  -f Dockerfile.web .

# Push to Google Container Registry
docker push gcr.io/regal-scholar-453620-r7/scienceviddb-web:latest
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy scienceviddb-web \
  --image gcr.io/regal-scholar-453620-r7/scienceviddb-web:latest \
  --platform managed \
  --region us-central1 \
  --project regal-scholar-453620-r7 \
  --service-account scienceviddb-web@regal-scholar-453620-r7.iam.gserviceaccount.com \
  --set-env-vars="USE_SECRETS_MANAGER=true,GOOGLE_CLOUD_PROJECT=regal-scholar-453620-r7,NODE_ENV=production" \
  --add-cloudsql-instances=regal-scholar-453620-r7:us-central1:scienceviddb-db \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0 \
  --port 3000 \
  --allow-unauthenticated
```

### 3. Get Service URL

After deployment, you'll get a URL like:
```
https://scienceviddb-web-XXXXX-uc.a.run.app
```

### 4. Link from copernicusai.fyi

**Option A: Simple Redirect**
Add to your main website:
```html
<a href="https://scienceviddb-web-XXXXX-uc.a.run.app">Science Video Database</a>
```

**Option B: Custom Domain (Recommended)**
1. Map custom domain in Cloud Run:
```bash
gcloud run domain-mappings create \
  --service scienceviddb-web \
  --domain sciencevideodb.copernicusai.fyi \
  --region us-central1 \
  --project regal-scholar-453620-r7
```

2. Update DNS records as instructed by Cloud Run

**Option C: Subdirectory (via Load Balancer)**
Set up a load balancer to route `/scienceviddb/*` to Cloud Run service.

## Service Account Setup

Create service account if it doesn't exist:

```bash
gcloud iam service-accounts create scienceviddb-web \
  --display-name="Science Video DB Web App" \
  --project=regal-scholar-453620-r7

# Grant Secrets Manager access
gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:scienceviddb-web@regal-scholar-453620-r7.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud SQL access
gcloud projects add-iam-policy-binding regal-scholar-453620-r7 \
  --member="serviceAccount:scienceviddb-web@regal-scholar-453620-r7.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## Environment Variables

Set in Cloud Run (or use Secrets Manager):
- `USE_SECRETS_MANAGER=true` - Use Secrets Manager for credentials
- `GOOGLE_CLOUD_PROJECT=regal-scholar-453620-r7` - GCP project ID
- `NODE_ENV=production` - Production mode

All other secrets (database URL, API keys) are fetched from Secrets Manager automatically.

## Cloud SQL Connection

The service account will automatically connect to Cloud SQL using:
- Unix socket: `/cloudsql/regal-scholar-453620-r7:us-central1:scienceviddb-db`
- No password needed (uses IAM authentication)

## Monitoring

View logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=scienceviddb-web" \
  --project=regal-scholar-453620-r7 \
  --limit 50
```

View in Cloud Console:
- Navigate to Cloud Run → scienceviddb-web → Logs

## Cost Estimate

- **Free tier**: 2 million requests/month
- **After free tier**: ~$0.40 per million requests
- **Memory**: $0.0000025 per GB-second
- **CPU**: $0.00002400 per vCPU-second

For a small site: **~$0-5/month**

## Troubleshooting

### Build Fails
- Check Docker build logs
- Verify all package.json files are correct
- Ensure packages build successfully locally

### Service Won't Start
- Check service account permissions
- Verify Cloud SQL connection name
- Check logs for specific errors

### Database Connection Fails
- Verify Cloud SQL instance is running
- Check service account has `cloudsql.client` role
- Verify connection name format

## Next Steps

1. Deploy to Cloud Run
2. Test the service URL
3. Link from copernicusai.fyi
4. (Optional) Set up custom domain
5. Monitor usage and costs

