# Finding All Uses of the Old API Key

## Old Key to Replace

```
AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs
```

This key was used 91 times in the past 30 days, so it's actively being used somewhere!

## Places to Check

### 1. Google Secrets Manager

Check all secrets in your Google Cloud project:

```bash
# List all secrets
gcloud secrets list --project=regal-scholar-453620-r7

# Check each secret that might contain the key:
gcloud secrets versions access latest --secret=youtube-api-key --project=regal-scholar-453620-r7
gcloud secrets versions access latest --secret=copernicus-youtube-api-key --project=regal-scholar-453620-r7
gcloud secrets versions access latest --secret=google-api-key --project=regal-scholar-453620-r7
```

### 2. CopernicusAI Project

Since you mentioned it's used in CopernicusAI:

1. **Check CopernicusAI Secrets Manager**:
   - Look for `youtube-api-key` or similar
   - Check for any secret containing YouTube/Google API keys

2. **Check CopernicusAI Code**:
   - Search for the key in their codebase
   - Check environment variables
   - Check configuration files

3. **Check CopernicusAI Deployment**:
   - Cloud Run services
   - App Engine services
   - Cloud Functions
   - Look for environment variables with API keys

### 3. Other Projects in Same GCP Project

Check other services that might use YouTube API:
- Check all Cloud Run services
- Check all App Engine services
- Check all Cloud Functions
- Look for environment variables

### 4. Environment Variables in Code

Search for the key in all repositories:
```bash
# Search for the key in git repos
grep -r "AIzaSyD4Zg7" /path/to/copernicusai/
grep -r "AIzaSyD4Zg7" /path/to/other/projects/
```

### 5. Google Cloud Services

Check where the key is configured:
- Cloud Run environment variables
- App Engine configuration
- Cloud Functions environment variables
- Kubernetes secrets
- Cloud Build configuration

## Step-by-Step Replacement

### Step 1: Find All Uses

1. List all Secrets Manager secrets
2. Check each one for the old key
3. Check CopernicusAI codebase/config
4. Check all deployed services

### Step 2: Update Each Location

For each place you find the old key:

1. **Secrets Manager**:
   ```bash
   echo -n "NEW_KEY" | \
     gcloud secrets versions add SECRET_NAME \
     --project=regal-scholar-453620-r7 \
     --data-file=-
   ```

2. **Environment Variables**: Update in service configuration
3. **Code**: Replace in code/config files

### Step 3: Test Each Service

After updating each location:
- Test that CopernicusAI still works
- Test that Science Video DB still works
- Check logs for errors

### Step 4: Delete Old Key

Only delete after:
- ✅ All locations updated
- ✅ All services tested
- ✅ Confirmed nothing is using old key

## Safe Approach

**Option 1: Keep Both Keys Temporarily**
- Leave old key for a few days
- Monitor usage - if old key usage drops to 0, it's safe to delete
- Then delete old key

**Option 2: Check Usage Before Deleting**
- Wait a day or two after updating everything
- Check if old key usage drops
- If usage is 0 → Safe to delete
- If usage continues → Find the remaining usage

## Quick Check Commands

```bash
# List all secrets
gcloud secrets list --project=regal-scholar-453620-r7

# Check if any secret contains the old key
for secret in $(gcloud secrets list --project=regal-scholar-453620-r7 --format="value(name)"); do
  echo "Checking $secret..."
  gcloud secrets versions access latest --secret=$secret --project=regal-scholar-453620-r7 2>/dev/null | grep -q "AIzaSyD4Zg7" && echo "  ⚠️  Found old key in $secret"
done

# List Cloud Run services (check their env vars)
gcloud run services list --project=regal-scholar-453620-r7

# Check a specific service's env vars
gcloud run services describe SERVICE_NAME --project=regal-scholar-453620-r7 --format="value(spec.template.spec.containers[0].env)"
```

