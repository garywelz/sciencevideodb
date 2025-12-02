# YouTube API Authentication Options

## Current Setup: API Key (Recommended for Public Data)

Our YouTube client currently uses **API Key authentication**, which is perfect for:
- ✅ Fetching public channel information
- ✅ Fetching public videos and metadata
- ✅ Getting public transcripts/captions
- ✅ Searching public videos

**What we need:**
- `GOOGLE_API_KEY` from `apilist.md` line 36: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
- Store this in Secrets Manager as `youtube-api-key`

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
# Update with the Google API Key (which works for YouTube Data API)
echo -n "AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

Optionally store OAuth credentials for future use:

```bash
# YouTube OAuth Client ID
echo -n "53253319594-aeplkfls4gsglrhrabtg4i9nl0161061.apps.googleusercontent.com" | \
  gcloud secrets versions add youtube-client-id \
  --project=regal-scholar-453620-r7 \
  --data-file=-

# YouTube OAuth Client Secret
echo -n "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" | \
  gcloud secrets versions add youtube-client-secret \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

