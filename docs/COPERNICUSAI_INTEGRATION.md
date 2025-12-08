# CopernicusAI Integration - Science Video Database

## Overview

Science Video Database is integrated into the **CopernicusAI ecosystem** and will be accessible via a subdomain of `copernicusai.fyi`.

## Domain Options

### Subdomain: `sciencevideodb.copernicusai.fyi` ✅

**Selected subdomain**: `sciencevideodb.copernicusai.fyi`
- Matches the project name exactly
- Clear and descriptive
- Professional and consistent with naming conventions

## DNS Configuration

### For Vercel Deployment

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add subdomain: `sciencevideodb.copernicusai.fyi`

2. **Configure DNS Records**
   
   In your DNS provider (where copernicusai.fyi is managed):
   
   **Add CNAME record:**
   ```
   Type: CNAME
   Name: sciencevideodb
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
   
   **Note**: Vercel will provide the exact CNAME value after you add the domain. Use that value instead of the placeholder above.
   
   **OR** if Vercel provides specific instructions, follow those.

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enabled automatically

## Branding Integration

The site is branded as part of CopernicusAI:

- **Title**: "Science Video Database | CopernicusAI"
- **Footer**: Can include link back to copernicusai.fyi
- **Navigation**: Can include link to main CopernicusAI site

## Architecture

```
copernicusai.fyi
├── / (main site)
├── /admin-dashboard.html (existing)
└── (other CopernicusAI services)

sciencevideodb.copernicusai.fyi (NEW)
├── / (Science Video Database home)
├── /discipline/mathematics
├── /discipline/physics
├── /discipline/chemistry
├── /discipline/biology
├── /discipline/cs
└── /api/videos/[discipline]
```

## Shared Infrastructure

Both sites share:
- **Google Cloud Project**: `regal-scholar-453620-r7`
- **Secrets Manager**: Same project, different secrets
- **Cloud Storage**: Separate buckets but same project
- **Vertex AI**: Shared service
- **Database**: Separate Cloud SQL instances (recommended) or shared

## Deployment Steps

1. **Deploy to Vercel**
   - Follow [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
   - Use default Vercel domain first to test

2. **Configure Subdomain**
   - Add subdomain in Vercel dashboard
   - Configure DNS records
   - Wait for DNS propagation (usually < 1 hour)

3. **Test**
   - Verify HTTPS works
   - Test all routes
   - Check cross-linking between sites

## Cross-Linking

### From CopernicusAI Main Site

Add a link to Science Video Database:
```html
<a href="https://sciencevideodb.copernicusai.fyi">Science Video Database</a>
```

### From Science Video Database

Add footer or header link:
```tsx
<footer>
  <a href="https://copernicusai.fyi">← Back to CopernicusAI</a>
</footer>
```

## Benefits of Subdomain Approach

✅ **Clean Separation**: Independent deployment and scaling
✅ **Easy Management**: Separate Vercel project
✅ **Branding**: Clear it's part of CopernicusAI
✅ **Flexibility**: Can move to separate domain later if needed
✅ **SEO**: Subdomain can have its own SEO strategy

## Alternative: Path-Based (Not Recommended)

If you prefer a path instead of subdomain:
- `copernicusai.fyi/scitv`
- `copernicusai.fyi/videos`

**Challenges:**
- Requires reverse proxy or routing in main site
- More complex deployment
- Harder to scale independently

## Next Steps

1. ✅ Deploy to Vercel
2. ⏳ Choose subdomain name
3. ⏳ Configure DNS records
4. ⏳ Add cross-links between sites
5. ⏳ Test and verify

