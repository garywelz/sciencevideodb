# Domain Setup for scitv.com

## Current Situation

The domain **scitv.com** currently exists and hosts "Science Television" - a site that aggregates scientific video and audio content.

**Current Site**: https://scitv.com/
- Appears to be an older site
- Aggregates science videos, lectures, and radio content
- Links to various science video sources

## Options for Domain

### Option 1: Acquire the Domain
- Contact the current owner
- Negotiate purchase
- Transfer domain to your registrar
- **Pros**: Clean, professional domain
- **Cons**: May be expensive or unavailable

### Option 2: Use Subdomain
- Use `app.scitv.com` or `videos.scitv.com`
- If you can acquire scitv.com, set up subdomain
- **Pros**: Clear separation, professional
- **Cons**: Requires owning parent domain

### Option 3: Alternative Domain
Consider these alternatives:
- `scitv.fyi` - Available, short, memorable
- `scitv.app` - Modern, app-focused
- `scitv.io` - Tech-focused
- `scitv.tv` - Video-focused
- `sciencevideos.fyi` - Descriptive
- `scivideos.app` - Clear purpose

### Option 4: Wait and Use Development Domain
- Use Vercel's default domain initially: `sciencevideodb.vercel.app`
- Launch with development domain
- Acquire scitv.com when ready
- **Pros**: Can start immediately
- **Cons**: Less professional initially

## Recommended Approach

**Phase 1: Development** (Now)
- Use Vercel default domain: `sciencevideodb.vercel.app`
- Build and test the site
- Get everything working

**Phase 2: Domain Acquisition** (Before Launch)
- Research scitv.com owner
- Contact about acquisition
- If unavailable, choose alternative (scitv.fyi recommended)

**Phase 3: Production** (Launch)
- Configure chosen domain in Vercel
- Set up DNS records
- Launch with proper domain

## Vercel Domain Configuration

Once you have a domain:

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your domain (e.g., `scitv.com`)

2. **Configure DNS**:
   - Add CNAME record: `@` → `cname.vercel-dns.com`
   - Or A record: `@` → Vercel IP addresses
   - Add CNAME for www: `www` → `cname.vercel-dns.com`

3. **SSL Certificate**:
   - Vercel automatically provisions SSL
   - HTTPS enabled automatically

## Next Steps

1. ✅ Continue development with Vercel default domain
2. Research scitv.com ownership
3. Decide on domain strategy
4. Configure domain when ready for production

---

**Note**: For now, focus on building the site. Domain can be configured later without affecting development.

