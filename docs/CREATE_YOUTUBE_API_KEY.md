# Create YouTube API Key for regal-scholar-453620-r7

## Why Create a Dedicated Key?

Creating a YouTube API key specifically for the `regal-scholar-453620-r7` project is recommended because:

1. **Project Isolation** - Each project should have its own credentials
2. **Better Organization** - Clear separation between CopernicusAI components
3. **Usage Tracking** - Easier to monitor quota/usage per project
4. **Security** - Keys scoped to specific projects
5. **Best Practices** - Follows Google Cloud resource management guidelines

## Steps to Create New API Key

### 1. Enable YouTube Data API v3

Already done via CLI, or do it manually:
- Go to: https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=regal-scholar-453620-r7
- Click **"Enable"**

### 2. Create API Key

**Option A: Via Google Cloud Console (Recommended)**

1. Go to: https://console.cloud.google.com/apis/credentials?project=regal-scholar-453620-r7
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the generated API key
4. (Optional) Click **"RESTRICT KEY"** to:
   - Restrict to YouTube Data API v3 only
   - Restrict by IP address if needed
   - Add application restrictions

**Option B: Via gcloud CLI**

```bash
gcloud alpha services api-keys create \
  --api-target=service=youtube.googleapis.com \
  --project=regal-scholar-453620-r7 \
  --display-name="Science Video DB YouTube API Key"
```

Note: The CLI method may require additional setup. The Console method is simpler.

### 3. Update Secret in Secrets Manager

Once you have the new API key:

```bash
echo -n "YOUR_NEW_API_KEY_HERE" | gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### 4. Test the New Key

```bash
npm run test:youtube
```

## Current Setup

- **Current API Key**: Belongs to project `204731194849`
- **Target Project**: `regal-scholar-453620-r7`
- **Recommended**: Create dedicated key for better organization

## Key Restrictions (Recommended)

When creating the key, consider restricting it:

1. **API Restrictions**: Restrict to "YouTube Data API v3" only
2. **Application Restrictions**: None (or HTTP referrers if needed)
3. **Usage Quotas**: Set daily quotas to prevent unexpected costs

## Quota Management

YouTube Data API v3 default quota: **10,000 units per day**

- `channels.list`: 1 unit
- `playlistItems.list`: 1 unit
- `videos.list`: 1 unit
- `captions.list`: 1 unit

Monitor usage at:
https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas?project=regal-scholar-453620-r7

