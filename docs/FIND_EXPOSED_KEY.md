# Finding the Exposed Key

## The Key You Need to Find

The exposed key that GitGuardian found is:
```
AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs
```

**This key is currently ACTIVE in Secrets Manager!**

## Keys You're Seeing

You've mentioned seeing these keys:
1. `AIzaSyBmjUsjHI4t-K8IXZG6e0sVTX_hpxmXsoo` ❌ Not the exposed one
2. `AIzaSyC7JzPQIqWR2qGXqA4IcoljxEjIdGraTJo` ❌ Not the exposed one

## How to Find the Exposed Key

In your Google Cloud Console API Keys list:

1. **Look for a key that starts with**: `AIzaSyD4Zg7...`
2. **The full key should be**: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
3. **Click "Show key"** to see the full key string

## What to Do Once You Find It

### Step 1: Create a NEW Key First
1. Click "+ CREATE CREDENTIALS" → "API key"
2. Copy the new key (it will start with `AIza...`)
3. **Don't delete the old one yet!**

### Step 2: Update Secrets Manager
```bash
# Replace NEW_KEY with your actual new key
echo -n "NEW_KEY" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### Step 3: Test the New Key
```bash
npm run test:youtube
```

### Step 4: Delete the Old (Exposed) Key
1. Go back to API Keys list
2. Find the key: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
3. Click on it → Click "Delete"
4. Confirm deletion

## If You Can't Find It

If you don't see `AIzaSyD4Zg7...` in your list:
- It might have been deleted already
- Check "Restore deleted credentials" to see if it's there
- If it's deleted → ✅ You're good! Just make sure Secrets Manager has a valid key

## Summary

**Find**: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
**Action**: Create new key → Update Secrets Manager → Test → Delete old key

The other keys you're seeing are different and can be left alone (unless you want to clean them up).

