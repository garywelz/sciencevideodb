# How to Update YouTube API Key in Google Secrets Manager

## Option 1: Update Existing Secret

If the secret already exists (which it does), update it with your real API key:

```bash
# Set your project
gcloud config set project regal-scholar-453620-r7

# Update the secret with your real API key
echo -n "YOUR_ACTUAL_YOUTUBE_API_KEY_HERE" | gcloud secrets versions add youtube-api-key \
  --data-file=-
```

Replace `YOUR_ACTUAL_YOUTUBE_API_KEY_HERE` with your real YouTube API key from Google Cloud Console.

## Option 2: Use Environment Variable for Testing

For quick testing, you can bypass Secrets Manager and use an environment variable:

```bash
# Unset USE_SECRETS_MANAGER to use environment variables
unset USE_SECRETS_MANAGER

# Set your YouTube API key directly
export YOUTUBE_API_KEY=your_actual_api_key_here

# Run tests
npm run test:youtube
```

## Getting Your YouTube API Key

If you don't have a YouTube API key yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `regal-scholar-453620-r7`
3. Navigate to: **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **API key**
5. Copy the API key
6. Enable YouTube Data API v3:
   - Go to **APIs & Services** → **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**

## Verify Secret Update

After updating, you can verify the secret (without showing the value):

```bash
gcloud secrets versions list youtube-api-key --project=regal-scholar-453620-r7
```

Or test by running the tests again:

```bash
npm run test:youtube
```

