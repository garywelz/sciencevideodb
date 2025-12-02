# Quick Start: Testing YouTube Client

## Prerequisites

1. **YouTube API Key** - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Create API key credentials

2. **Set environment variable**:
   ```bash
   export YOUTUBE_API_KEY=your_api_key_here
   ```

   OR use Google Secrets Manager:
   ```bash
   export USE_SECRETS_MANAGER=true
   # Make sure you're authenticated: gcloud auth application-default login
   ```

## Run Tests

From project root (automatically builds packages first):
```bash
npm run test:youtube
```

This will:
1. Build the required packages (shared, gcp-utils)
2. Run the YouTube API client tests

Or manually build first:
```bash
npm run build:packages
npm run test:youtube --workspace=packages/ingestion
```

## What Gets Tested

The test suite runs 10 comprehensive tests:
1. ✅ Channel info fetching
2. ✅ Video fetching from channel
3. ✅ Video metadata retrieval
4. ✅ Batch video fetching
5. ✅ Caption detection
6. ✅ Transcript fetching
7. ✅ Transcript with timestamps
8. ✅ Data format conversion
9. ✅ Rate limiting
10. ✅ Error handling

## Expected Output

```
============================================================
YouTube API Client Test Suite
============================================================

✅ API Key loaded (AIzaSyCxxx...)

🧪 Testing: Fetch Channel Info...
✅ PASSED (245ms)

...

============================================================
Test Summary
============================================================

Total Tests: 10
✅ Passed: 10
⏱️  Total Duration: 3241ms

✅ All tests passed!
```

## Troubleshooting

**API Key not found?**
- Set `YOUTUBE_API_KEY` environment variable
- OR enable `USE_SECRETS_MANAGER=true`

**Quota exceeded?**
- Check quota in Google Cloud Console
- Wait for daily reset (10,000 units/day)

**Need help?**
See [full testing documentation](./docs/TESTING.md) for detailed troubleshooting.

