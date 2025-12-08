# Vercel Settings Update Instructions

## Current Status

✅ Root Directory: `apps/web` (Already set!)

## Settings to Update

Since Root Directory is set to `apps/web`, all paths are relative to that directory.

### 1. Install Command

**Current**: `npm install`

**Change to**: `cd ../.. && npm install`

**Why**: Since Root Directory is `apps/web`, Vercel runs commands from that directory. We need to go up to the repo root to install workspace dependencies.

### 2. Build Command

**Current**: `npm run build:packages && cd apps/web && npm run build`

**Change to**: `cd ../.. && npm run build:packages && cd apps/web && npm run build`

**Why**: Need to start from repo root to build packages, then build the web app.

### 3. Output Directory

**Current**: `apps/web/.next`

**Change to**: `.next`

**Why**: Since Root Directory is `apps/web`, the output path is relative to that directory, so `.next` is correct (not `apps/web/.next`).

## Steps to Update

1. **Go to Build and Deployment Settings**
   - URL: https://vercel.com/gary-welzs-projects/scienceviddb/settings/build-and-deployment

2. **Update Install Command**
   - Find "Install Command" field
   - Change to: `cd ../.. && npm install`
   - Click outside the field to save

3. **Update Build Command** (if needed)
   - Find "Build Command" field
   - Change to: `cd ../.. && npm run build:packages && cd apps/web && npm run build`
   - Click outside the field to save

4. **Update Output Directory**
   - Find "Output Directory" field
   - Change to: `.next`
   - Click outside the field to save

5. **Save All Changes**
   - Scroll to bottom
   - Click "Save" button

6. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push to GitHub to trigger auto-deploy

## After Deployment

Once deployment succeeds:

1. **Set Environment Variables** (if not done)
   - Go to: Environment Variables settings
   - Add: `DATABASE_URL`

2. **Add Domain**
   - Go to: Domains settings
   - Add: `sciencevideodb.copernicusai.fyi`

