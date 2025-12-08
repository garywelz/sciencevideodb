# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Code should be pushed to GitHub
3. **Database Access** - PostgreSQL database accessible from Vercel

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository: `garywelz/sciencevideodb`
   - Select the repository

2. **Configure Project**
   - **Root Directory**: Set to `apps/web`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

3. **Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/scienceviddb
   USE_SECRETS_MANAGER=false
   ```

   **OR** for Google Cloud Secrets Manager:

   ```
   USE_SECRETS_MANAGER=true
   GOOGLE_APPLICATION_CREDENTIALS_JSON=<service-account-json>
   ```

   **Note**: For Google Cloud, you'll need to:
   - Create a service account with Secrets Manager access
   - Download the JSON key
   - Paste the entire JSON as the environment variable value

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd apps/web
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add USE_SECRETS_MANAGER
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - For Cloud SQL: Use connection string from Google Cloud

### Optional

- `USE_SECRETS_MANAGER` - Set to `true` to use Google Secrets Manager
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Service account JSON (if using Secrets Manager)
- `GOOGLE_CLOUD_PROJECT_ID` - GCP project ID (defaults to `regal-scholar-453620-r7`)

## Database Connection

### For Cloud SQL (Recommended)

1. **Use Cloud SQL Proxy** (if database has public IP disabled)
   - Set up Cloud SQL Proxy in Vercel
   - Or use public IP with firewall rules

2. **Connection String Format**
   ```
   postgresql://scienceviddb_user:password@34.31.235.165:5432/scienceviddb
   ```

3. **Security**
   - Use strong passwords
   - Restrict IP access in Cloud SQL settings
   - Consider using Vercel's IP allowlist

## Custom Domain Setup

### Option 1: Subdomain of copernicusai.fyi (Recommended)

1. **Add Subdomain in Vercel**
   - Go to Project Settings → Domains
   - Add subdomain: `sciencevideodb.copernicusai.fyi`

2. **Configure DNS**
   - In your DNS provider (where copernicusai.fyi is managed)
   - Add CNAME record:
     ```
     Type: CNAME
     Name: sciencevideodb
     Value: [Vercel will provide this after adding domain]
     TTL: 3600
     ```
   - **Note**: Vercel will show you the exact CNAME value to use after you add the domain in their dashboard

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enabled automatically

### Option 2: Standalone Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `scitv.com`)

2. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Or use A record with Vercel's IP

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enabled automatically

See [CopernicusAI Integration Guide](./COPERNICUSAI_INTEGRATION.md) for more details.

## Build Configuration

The project is configured as a mono-repo:

- **Root**: `apps/web`
- **Packages**: Built automatically via `prebuild` script
- **Output**: `.next` directory

## Troubleshooting

### Build Fails

1. **Check Node Version**
   - Vercel uses Node 18+ by default
   - Can be configured in `package.json` engines

2. **Check Build Logs**
   - Look for TypeScript errors
   - Check for missing dependencies

3. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check firewall rules for Cloud SQL
   - Ensure database is accessible from Vercel's IPs

### Runtime Errors

1. **Check Function Logs**
   - Vercel Dashboard → Functions → Logs

2. **Database Connection**
   - Verify environment variables are set
   - Check database is running and accessible

3. **Package Issues**
   - Ensure all packages are in `package.json`
   - Check `transpilePackages` in `next.config.js`

## Post-Deployment

1. **Test All Routes**
   - Home page: `/`
   - Discipline feeds: `/discipline/mathematics`, etc.
   - API routes: `/api/videos/mathematics`

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor database query performance

3. **Set Up Auto-Deploy**
   - Vercel auto-deploys on git push
   - Configure branch protection if needed

## Next Steps

- [ ] Deploy to Vercel
- [ ] Configure custom domain (scitv.com)
- [ ] Set up monitoring
- [ ] Configure auto-scaling
- [ ] Set up CI/CD pipeline

