# YouTube API Authentication Options

## Current Setup: API Key (Recommended for Public Data)

Our YouTube client currently uses **API Key authentication**, which is perfect for:
- ✅ Fetching public channel information
- ✅ Fetching public videos and metadata
- ✅ Getting public transcripts/captions
- ✅ Searching public videos

**What we need:**
- A YouTube Data API v3 key (starts with `AIza...`)
- Store this in Secrets Manager as `youtube-api-key`
- **Never commit API keys to git** - use Secrets Manager only

## OAuth 2.0 Credentials (For Private/User Data)

The OAuth credentials in `apilist.md` (lines 15-18) would be needed for:
- Accessing user's private playlists
- Uploading videos
- Accessing user-specific data
- Managing user's YouTube channel

**OAuth credentials include:**
- `YOUTUBE_CLIENT_ID` - OAuth client ID
- `YOUTUBE_CLIENT_SECRET` - OAuth client secret  
- `YOUTUBE_REFRESH_TOKEN` - For refreshing access tokens

**For our current use case (ingesting public videos), we don't need OAuth.**

## Recommendation

### For Science Video Database Ingestion:
1. **Use API Key** (`GOOGLE_API_KEY`) - Store as `youtube-api-key` in Secrets Manager
   - This is what our current YouTube client expects
   - Sufficient for all public video operations

2. **OAuth credentials** - Can be stored in Secrets Manager for future features:
   - If we want to allow users to import their private playlists
   - If we want to enable user-specific features
   - Not needed for the initial ingestion pipeline

## Updating Secrets Manager

Store the API key we need:

```bash
# Update with your Google API Key (replace YOUR_API_KEY with actual key)
echo -n "YOUR_API_KEY" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

**Important**: 
- Replace `YOUR_API_KEY` with your actual API key
- Never commit real API keys to git
- All keys should be stored in Google Secrets Manager

Optionally store OAuth credentials for future use (if needed):

```bash
# YouTube OAuth Client ID (replace with your actual client ID)
echo -n "YOUR_CLIENT_ID" | \
  gcloud secrets versions add youtube-client-id \
  --project=regal-scholar-453620-r7 \
  --data-file=-

# YouTube OAuth Client Secret (replace with your actual secret)
echo -n "YOUR_CLIENT_SECRET" | \
  gcloud secrets versions add youtube-client-secret \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

