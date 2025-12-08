# Vercel Deployment - Step-by-Step Guide

## Current Status

✅ **Code is ready** - All build errors fixed
✅ **Project linked** - Connected to Vercel
⚠️ **Needs configuration** - Root directory and environment variables

## Steps to Complete Deployment

### Step 1: Configure Root Directory (CRITICAL)

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/gary-welzs-projects/scienceviddb/settings/general
   - Or: Dashboard → scienceviddb → Settings → General

2. **Set Root Directory**
   - Find "Root Directory" setting
   - Enter: `apps/web`
   - Click "Save"

3. **Update Build Settings** (if needed)
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `.next` (should auto-detect)
   - Install Command: `cd ../.. && npm install` (installs from repo root for workspaces)

### Step 2: Set Environment Variables

1. **Go to Environment Variables**
   - URL: https://vercel.com/gary-welzs-projects/scienceviddb/settings/environment-variables
   - Or: Settings → Environment Variables

2. **Add DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `postgresql://scienceviddb_user:SciVidDB-Test-2024@34.31.235.165:5432/scienceviddb`
   - **Important**: 
     - Replace `SciVidDB-Test-2024` with actual password if different
     - Check "Production"
     - Check "Preview" 
     - Check "Development"
   - Click "Save"

3. **Add USE_SECRETS_MANAGER** (Optional)
   - Key: `USE_SECRETS_MANAGER`
   - Value: `false`
   - Apply to all environments

### Step 3: Add Domain

1. **Go to Domains**
   - URL: https://vercel.com/gary-welzs-projects/scienceviddb/settings/domains
   - Or: Settings → Domains

2. **Add Domain**
   - Enter: `sciencevideodb.copernicusai.fyi`
   - Click "Add"

3. **Configure DNS**
   - Vercel will show you a CNAME value
   - In your DNS provider (where copernicusai.fyi is managed):
     - Add CNAME record:
       - Name: `sciencevideodb`
       - Value: [Use the value Vercel provides]
       - TTL: 3600

### Step 4: Deploy

**Option A: Redeploy from Dashboard**
1. Go to: https://vercel.com/gary-welzs-projects/scienceviddb
2. Click "Redeploy" on latest deployment
3. Or go to Deployments → Click "..." → Redeploy

**Option B: Push to GitHub** (Auto-deploys)
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 5: Verify

1. **Check Deployment**
   - Go to Deployments tab
   - Wait for build to complete
   - Click on deployment to see logs

2. **Test Site**
   - Visit: `https://scienceviddb-XXXXX.vercel.app` (temporary URL)
   - Or: `https://sciencevideodb.copernicusai.fyi` (after DNS propagates)

3. **Test Routes**
   - Home: `/`
   - Mathematics: `/discipline/mathematics`
   - Physics: `/discipline/physics`
   - API: `/api/videos/mathematics`

## Troubleshooting

### Build Still Fails

1. **Check Build Logs**
   - Go to Deployment → View Function Logs
   - Look for specific error messages

2. **Verify Root Directory**
   - Make sure it's set to `apps/web` exactly
   - No trailing slash

3. **Check Install Command**
   - Should be: `cd ../.. && npm install`
   - This installs from repo root to get workspace dependencies

### Database Connection Fails

1. **Verify DATABASE_URL**
   - Check password is correct
   - Check IP address: `34.31.235.165`
   - Check port: `5432`

2. **Check Cloud SQL Firewall**
   - Go to: Google Cloud Console → SQL → scienceviddb-db → Connections
   - Add Vercel IP ranges (or allow all for testing)

3. **Test Connection**
   - Try connecting from local machine with same connection string

### Domain Not Working

1. **Check DNS Propagation**
   - Use: https://dnschecker.org
   - Enter: `sciencevideodb.copernicusai.fyi`
   - Wait up to 24 hours for full propagation

2. **Verify CNAME Record**
   - Make sure it points to Vercel's provided value
   - No typos in subdomain name

## Quick Reference

**Project URL**: https://vercel.com/gary-welzs-projects/scienceviddb

**Settings**:
- General: https://vercel.com/gary-welzs-projects/scienceviddb/settings/general
- Environment Variables: https://vercel.com/gary-welzs-projects/scienceviddb/settings/environment-variables
- Domains: https://vercel.com/gary-welzs-projects/scienceviddb/settings/domains

**Database Info**:
- IP: `34.31.235.165`
- Port: `5432`
- Database: `scienceviddb`
- User: `scienceviddb_user`
- Password: `SciVidDB-Test-2024` (verify this is correct)

