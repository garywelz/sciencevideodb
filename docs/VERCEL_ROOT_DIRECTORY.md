# Vercel Root Directory Configuration

## Location

The "Root Directory" setting is located in **Build and Deployment** settings, NOT General settings.

## Steps

1. **Go to Build and Deployment Settings**
   - URL: https://vercel.com/gary-welzs-projects/scienceviddb/settings/build-and-deployment
   - Or: Click "Build and Deployment" in the left sidebar

2. **Find Root Directory Section**
   - Scroll down to find "Root Directory" setting
   - It may be under "Build Settings" or "Framework Settings"

3. **Set Root Directory**
   - Enter: `apps/web`
   - Click "Save"

4. **Update Build Settings** (if visible)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `cd ../.. && npm install` (for mono-repo workspaces)
   - **Framework Preset**: Next.js (should auto-detect)

## Alternative: If Root Directory is Not Visible

If you don't see "Root Directory" option:

1. **Check Framework Detection**
   - Vercel should auto-detect Next.js
   - If not, you may need to set it manually

2. **Use vercel.json** (Already created)
   - The `vercel.json` file in the repo root should work
   - But Root Directory needs to be set in dashboard for mono-repo

3. **Contact Vercel Support**
   - If Root Directory option is missing, it might be a plan limitation
   - Or the setting might be in a different location

## What to Look For

In "Build and Deployment" settings, you should see:
- Framework Preset
- Build Command
- Output Directory
- Install Command
- **Root Directory** ← This is what we need!

## If You Still Can't Find It

Try this:
1. Go to: Project Settings → General
2. Look for "Framework" or "Override" section
3. Or check if there's an "Advanced" section
4. Root Directory might be under "Override" settings

