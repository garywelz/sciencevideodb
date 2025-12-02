# Enable YouTube Data API v3

## Issue

The API key works, but YouTube Data API v3 needs to be enabled in the project that owns the key.

## Error Message

```
YouTube Data API v3 has not been used in project 204731194849 before or it is disabled.
Enable it by visiting:
https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=204731194849
```

## Solution

### Option 1: Enable API in the Key's Project (Recommended if key belongs there)

1. Go to: https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=204731194849
2. Click **"Enable"**
3. Wait a few minutes for it to propagate
4. Re-run the test

### Option 2: Create New API Key in Our Project

If you want to use a key from `regal-scholar-453620-r7`:

1. Go to [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/credentials?project=regal-scholar-453620-r7)
2. Enable YouTube Data API v3 first:
   - Go to [API Library](https://console.cloud.google.com/apis/library?project=regal-scholar-453620-r7)
   - Search for "YouTube Data API v3"
   - Click **"Enable"**
3. Create a new API key:
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials?project=regal-scholar-453620-r7)
   - Click **"+ CREATE CREDENTIALS"** → **"API key"**
   - Copy the new key
4. Update the secret:
   ```bash
   echo -n "YOUR_NEW_API_KEY" | gcloud secrets versions add youtube-api-key \
     --project=regal-scholar-453620-r7 \
     --data-file=-
   ```

## Check API Status

To check if YouTube Data API is enabled:

```bash
gcloud services list --enabled --project=204731194849 | grep youtube
```

Or enable it via CLI:

```bash
gcloud services enable youtube.googleapis.com --project=204731194849
```

## Quick Fix Command

Enable YouTube Data API v3 in the project:

```bash
gcloud services enable youtube.googleapis.com --project=204731194849
```

Then wait 1-2 minutes and re-run the test.

