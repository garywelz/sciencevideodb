# Testing Guide

## YouTube API Client Tests

Comprehensive test suite for the YouTube API client.

### Prerequisites

1. **YouTube API Key** - Set one of:
   - Environment variable: `YOUTUBE_API_KEY`
   - Google Secrets Manager: Set `USE_SECRETS_MANAGER=true` and configure GCP credentials

2. **GCP Authentication** (if using Secrets Manager):
   ```bash
   gcloud auth application-default login
   # OR
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   ```

### Running Tests

From the project root:
```bash
npm run test:youtube
```

From the ingestion package:
```bash
cd packages/ingestion
npm run test:youtube
```

### Test Coverage

The test suite covers:

1. ✅ **Channel Info Fetching** - Verifies channel details retrieval
2. ✅ **Channel Videos** - Tests fetching videos from a channel
3. ✅ **Video Metadata** - Validates detailed video information
4. ✅ **Batch Metadata** - Tests efficient batch video fetching
5. ✅ **Caption Detection** - Checks if videos have captions
6. ✅ **Transcript Fetching** - Tests full transcript retrieval
7. ✅ **Transcript with Timestamps** - Validates timestamped segments
8. ✅ **VideoRecord Conversion** - Tests data format conversion
9. ✅ **Rate Limiting** - Verifies request throttling
10. ✅ **Error Handling** - Tests error scenarios

### Environment Variables

```bash
# Required: YouTube API Key (one of these)
YOUTUBE_API_KEY=your_api_key_here

# OR use Google Secrets Manager
USE_SECRETS_MANAGER=true

# Optional: Test channel ID (defaults to Google Developers)
TEST_CHANNEL_ID=UC_x5XG1OV2P6uZZ5FSM9Ttw
```

### Test Output

The test suite provides:
- ✅/❌ Pass/fail status for each test
- ⏱️ Duration for each test
- 📊 Summary statistics
- 🔍 Detailed error messages for failures

### Example Output

```
============================================================
YouTube API Client Test Suite
============================================================

✅ API Key loaded (AIzaSyCxxx...)

🧪 Testing: Fetch Channel Info...
✅ PASSED (245ms)

🧪 Testing: Fetch Channel Videos (limit 5)...
✅ PASSED (512ms)

...

============================================================
Test Summary
============================================================

Total Tests: 10
✅ Passed: 10
❌ Failed: 0
⏱️  Total Duration: 3241ms
📊 Average Duration: 324ms

============================================================
✅ All tests passed!
```

### Troubleshooting

#### API Key Issues

**Error**: `YOUTUBE_API_KEY environment variable not set`

**Solution**: 
- Set `YOUTUBE_API_KEY` environment variable, OR
- Enable `USE_SECRETS_MANAGER=true` and configure GCP credentials

#### Quota Exceeded

**Error**: `YouTube API quota exceeded`

**Solution**:
- Wait for quota to reset (daily limit: 10,000 units)
- Check quota usage in Google Cloud Console
- Reduce test frequency

#### Network Issues

**Error**: `Failed to fetch` or timeout errors

**Solution**:
- Check internet connection
- Verify API endpoints are accessible
- Check firewall/proxy settings

#### Secrets Manager Issues

**Error**: `Failed to fetch secret from Google Secrets Manager`

**Solution**:
1. Verify GCP authentication:
   ```bash
   gcloud auth application-default login
   ```

2. Check service account permissions:
   ```bash
   gcloud projects get-iam-policy regal-scholar-453620-r7
   ```

3. Verify secret exists:
   ```bash
   gcloud secrets list --project=regal-scholar-453620-r7
   ```

### Test Configuration

The test uses Google Developers channel (`UC_x5XG1OV2P6uZZ5FSM9Ttw`) as a reliable test channel. To use a different channel:

```bash
export TEST_CHANNEL_ID=your_channel_id_here
npm run test:youtube
```

### Continuous Integration

For CI/CD pipelines, ensure:
1. API key is available as environment variable or secret
2. Network access to YouTube API endpoints
3. Sufficient API quota for test runs

### Manual Testing

For manual testing of specific features, see:
- `packages/ingestion/src/youtube/example.ts` - Usage examples
- `packages/ingestion/src/youtube/test.ts` - Full test suite

