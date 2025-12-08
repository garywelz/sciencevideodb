# Vercel Deployment - Current Status

## Issue: Mono-repo Build Configuration

The deployment is failing because Vercel needs proper configuration for the mono-repo structure.

## Current Error

Build command is failing during package building or Next.js build.

## Solution Options

### Option 1: Configure Root Directory in Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Project: `scienceviddb` (or `web`)
   - Settings → General

2. **Set Root Directory**
   - Root Directory: `apps/web`
   - This tells Vercel to treat `apps/web` as the project root

3. **Update Build Settings**
   - Build Command: `npm run build` (runs from apps/web)
   - Output Directory: `.next`
   - Install Command: `cd ../.. && npm install` (installs from repo root)

### Option 2: Use Vercel's Mono-repo Support

Vercel has built-in mono-repo support:

1. **In Vercel Dashboard**
   - Settings → General
   - Root Directory: Leave empty (uses repo root)
   - Framework Preset: Next.js

2. **Update vercel.json**
   ```json
   {
     "buildCommand": "npm run prebuild && npm run build --workspace=apps/web",
     "outputDirectory": "apps/web/.next",
     "installCommand": "npm install"
   }
   ```

### Option 3: Deploy from apps/web Directory

Create a separate Vercel project just for the web app:

1. **In Vercel Dashboard**
   - Create new project
   - Root Directory: `apps/web`
   - This isolates the web app from the mono-repo

## What You Need to Do

**In Vercel Dashboard:**

1. Go to: https://vercel.com/gary-welzs-projects/scienceviddb/settings
2. Settings → General
3. Set **Root Directory** to: `apps/web`
4. Update **Build Command** to: `npm run build`
5. Update **Output Directory** to: `.next`
6. Update **Install Command** to: `cd ../.. && npm install && cd apps/web`

OR

**Alternative (Simpler):**
1. Create a new project in Vercel
2. Connect the same GitHub repo
3. Set Root Directory to: `apps/web`
4. Use default Next.js settings

## Environment Variables Still Needed

After fixing the build:

1. **DATABASE_URL**
   - Go to: Project Settings → Environment Variables
   - Add: `DATABASE_URL`
   - Value: `postgresql://scienceviddb_user:SciVidDB-Test-2024@34.31.235.165:5432/scienceviddb`
   - **Note**: Replace with actual password if different
   - Apply to: Production, Preview, Development

2. **USE_SECRETS_MANAGER** (Optional)
   - Set to: `false` (for now, using direct connection)

## Domain Configuration

After successful deployment:

1. Go to: Project Settings → Domains
2. Add: `sciencevideodb.copernicusai.fyi`
3. Follow DNS instructions provided by Vercel

