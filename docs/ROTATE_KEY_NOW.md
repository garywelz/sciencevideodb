# Rotate the Exposed Key - Step by Step

## ⚠️ Found the Exposed Key!

You found: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`

This is the key that was exposed in git. Let's rotate it safely.

## Step-by-Step Rotation

### Step 1: Create a NEW Key (Don't Delete Old One Yet!)

1. In Google Cloud Console, click **"+ CREATE CREDENTIALS"**
2. Select **"API key"**
3. Copy the **NEW key** (it will start with `AIza...`)
4. **Save it somewhere temporarily** - you'll need it in Step 2

### Step 2: Update Secrets Manager with New Key

Run this command (replace `YOUR_NEW_KEY` with the key you just created):

```bash
echo -n "YOUR_NEW_KEY" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### Step 3: Test the New Key Works

```bash
npm run test:youtube
```

If tests pass → ✅ New key works!

### Step 4: Delete the Old (Exposed) Key

1. Go back to API Keys list
2. Find: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
3. Click on it
4. Click **"Delete"**
5. Confirm deletion

## Why This Order?

- ✅ Create new key first → System keeps working
- ✅ Update Secrets Manager → System uses new key
- ✅ Test → Make sure everything works
- ✅ Delete old key → Remove the exposed key

If you delete the old key first, your system will break until you create a new one!

## Quick Command Reference

```bash
# 1. After creating new key, update Secrets Manager:
echo -n "YOUR_NEW_KEY" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-

# 2. Test it:
npm run test:youtube

# 3. Then delete the old key in Google Cloud Console
```

---

**Ready?** Start with Step 1 - create a new key!

