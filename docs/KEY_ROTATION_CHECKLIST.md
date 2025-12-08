# API Key Rotation Checklist

## What GitGuardian's Fix Did

GitGuardian's fix likely:
- ✅ Alerted you to the exposed key
- ✅ Provided instructions to remove it from current files
- ✅ Recommended rotating the key

**However**: The key is still in git history, even if removed from current files.

## Do You Need to Rotate the Key?

### ✅ YES - Rotate if:
- The exposed key is **still active** in Google Cloud Console
- The key has **not been revoked** yet
- You want to **prevent unauthorized use**

### ❌ NO - Don't need to rotate if:
- The key was **already rotated/revoked** before GitGuardian's alert
- The key is **already invalid** in Google Cloud Console
- You've **already created a new key** and updated Secrets Manager

## How to Check if Key Needs Rotation

1. **Check Google Cloud Console**:
   - Go to: https://console.cloud.google.com/apis/credentials?project=regal-scholar-453620-r7
   - Look for the key that starts with `AIzaSyD4Zg7...`
   - If it exists and is active → **Rotate it**
   - If it doesn't exist or is already deleted → **Already fixed**

2. **Check Secrets Manager**:
   ```bash
   gcloud secrets versions access latest --secret=youtube-api-key \
     --project=regal-scholar-453620-r7
   ```
   - If it matches the exposed key → **Rotate it**
   - If it's different → **Already fixed**

## Steps to Rotate (If Needed)

### Step 1: Revoke Old Key
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find the exposed key (`AIzaSyD4Zg7...`)
3. Click on it → Click "Delete" or "Regenerate"
4. Confirm deletion

### Step 2: Create New Key
1. In same page, click "+ CREATE CREDENTIALS"
2. Select "API key"
3. Copy the new key (starts with `AIza...`)

### Step 3: Update Secrets Manager
```bash
# Replace NEW_API_KEY with your actual new key
echo -n "NEW_API_KEY" | \
  gcloud secrets versions add youtube-api-key \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### Step 4: Verify
```bash
# Test that new key works
npm run test:youtube
```

## Removing Key from Git History (Optional)

If you want to completely remove the key from git history:

**Warning**: This rewrites git history. Only do this if:
- You're the only one working on the repo
- Or you coordinate with your team first

```bash
# Option 1: Use git filter-branch (complex)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch docs/API_KEY_TYPE_EXPLANATION.md docs/YOUTUBE_AUTH_OPTIONS.md scripts/update-youtube-api-key.sh" \
  --prune-empty --tag-name-filter cat -- --all

# Option 2: Use BFG Repo-Cleaner (easier, but requires Java)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
bfg --replace-text passwords.txt

# After either method, force push:
git push origin --force --all
```

**Note**: Removing from history doesn't prevent someone who already cloned the repo from seeing it. The key should still be rotated.

## Current Status

✅ **Files Fixed**:
- Removed keys from current documentation
- Removed keys from current scripts
- All keys now use placeholders

⚠️ **Still in Git History**:
- Old commits still contain the key
- Anyone with access to the repo can see old commits
- **Solution**: Rotate the key (makes old key useless)

## Recommendation

**If you haven't rotated the key yet**: 
1. ✅ Rotate it now in Google Cloud Console
2. ✅ Update Secrets Manager with new key
3. ✅ Test that everything still works

**If you already rotated it**:
- ✅ You're all set! The old key is useless even if it's in git history

---

**Bottom Line**: Rotating the key is the most important step. Removing from git history is optional and less critical if the key is already invalid.

