# YouTube API Key Types - Important!

## The Issue

The error says: "API keys are not supported by this API. Expected OAuth2 access token"

This means the credential you created is not a standard YouTube Data API v3 API key.

## YouTube Data API v3 Key Format

**Correct API keys** for YouTube Data API v3:
- Start with `AIza...` 
- Example: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
- Format: `AIzaSy` followed by 39 characters

**What you created:**
- Starts with `AQ.`
- This is likely an Application Default Credentials (ADC) key or service account identifier
- Not compatible with YouTube Data API v3

## How to Create the Correct API Key

### Step 1: Go to Credentials Page
1. Open: https://console.cloud.google.com/apis/credentials?project=regal-scholar-453620-r7

### Step 2: Create API Key (Not Service Account Key)
1. Click **"+ CREATE CREDENTIALS"**
2. Select **"API key"** (NOT "Service account key" or "OAuth client ID")
3. Copy the generated key - it should start with `AIza...`

### Step 3: Restrict the Key (Recommended)
1. Click on the newly created API key
2. Under "API restrictions", select **"Restrict key"**
3. Select **"YouTube Data API v3"** from the list
4. Click **"Save"**

### Step 4: Update Secret
Update the secret with the new key:
```bash
echo -n "AIzaSy..." | gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

## Alternative: Use Existing Key

If you want to use the key from `apilist.md` (line 36):
- `GOOGLE_API_KEY=AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
- This format is correct for YouTube Data API v3

