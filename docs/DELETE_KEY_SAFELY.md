# How to Safely Delete an API Key

## Current Situation

You found a key: `AIzaSyBmjUsjHI4t-K8IXZG6e0sVTX_hpxmXsoo`

This is **different** from the exposed key: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`

## Before Deleting - Check This First!

### Step 1: Check if This Key is Currently in Use

Check what key is in Secrets Manager:
```bash
gcloud secrets versions access latest --secret=youtube-api-key \
  --project=regal-scholar-453620-r7
```

### Step 2: Decide What to Do

#### If This Key IS in Secrets Manager (Currently Active)

**DON'T just delete it!** You need to:

1. **Create a NEW key first**:
   - In Google Cloud Console, click "+ CREATE CREDENTIALS" → "API key"
   - Copy the new key

2. **Update Secrets Manager**:
   ```bash
   echo -n "YOUR_NEW_KEY" | \
     gcloud secrets versions add youtube-api-key \
     --project=regal-scholar-453620-r7 \
     --data-file=-
   ```

3. **Test that it works**:
   ```bash
   npm run test:youtube
   ```

4. **Then delete the old key** in Google Cloud Console

#### If This Key is NOT in Secrets Manager (Not Active)

✅ **Safe to delete** - It's not being used, so deleting it won't break anything.

## What About the Exposed Key?

The exposed key was: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`

- If you **don't see this key** in your list → ✅ Already deleted/rotated
- If you **do see this key** → Delete it (it's the exposed one)

## Recommended Action

1. **Check Secrets Manager** to see which key is active
2. **If `AIzaSyBmjUsjHI4t...` is active**:
   - Create new key
   - Update Secrets Manager
   - Test
   - Delete old key
3. **If `AIzaSyBmjUsjHI4t...` is NOT active**:
   - Safe to delete
4. **Look for `AIzaSyD4Zg7...` key**:
   - If found → Delete it (it's the exposed one)
   - If not found → Already fixed ✅

## Summary

**Don't just delete** - make sure you have a replacement if it's currently in use!

