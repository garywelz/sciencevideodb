# SciTV.com Roadmap

## Vision

Build **scitv.com** - A curated science video feed website that automatically displays the most recent videos in each subject area (biology, chemistry, CS, mathematics, physics).

## Current Status

✅ **Foundation Complete**
- YouTube API client (10/10 tests passing)
- PostgreSQL database with schema
- Google Cloud integration
- HuggingFace Space demo (rebuilding)

## Phase 1: Testing & Initial Data (Current)

### 1.1 Test HuggingFace Space
- [ ] Verify Gradio app loads correctly after rebuild
- [ ] Test search interface functionality
- [ ] Verify all components render properly

### 1.2 Database Integration
- [ ] Connect ingestion worker to PostgreSQL
- [ ] Test video insertion and queries
- [ ] Verify transcript storage

### 1.3 Initial Channel Registry
- [ ] Research and curate 10-15 high-quality science channels
- [ ] Add channels to database with disciplines
- [ ] Set priorities and update cadences

**Target Channels:**
- **Biology**: Khan Academy Biology, Crash Course Biology, Bozeman Science
- **Chemistry**: Periodic Videos, Crash Course Chemistry, Tyler DeWitt
- **CS**: Computerphile, 3Blue1Brown (CS content), MIT OpenCourseWare
- **Mathematics**: 3Blue1Brown, Khan Academy Math, Numberphile
- **Physics**: Veritasium, MinutePhysics, Physics Girl, Sixty Symbols

### 1.4 First Ingestion Run
- [ ] Run ingestion worker for all channels
- [ ] Fetch video metadata and transcripts
- [ ] Store in database
- [ ] Verify data quality

**Target**: ~2,000 videos across all disciplines

## Phase 2: Scaling (Next)

### 2.1 Expand Channel Registry
- [ ] Add 50+ channels total
- [ ] Cover all sub-disciplines
- [ ] Maintain quality standards

### 2.2 Automated Ingestion
- [ ] Set up Cloud Run scheduled jobs
- [ ] Implement incremental updates (only new videos)
- [ ] Add error handling and retries

### 2.3 Search & Discovery
- [ ] Implement hybrid search (keyword + semantic)
- [ ] Add vector database (Pinecone/Weaviate)
- [ ] Test search performance

**Target**: 20,000+ videos

## Phase 3: Vercel Website (scitv.com)

### 3.1 Domain Setup
- [ ] Acquire/configure scitv.com domain
- [ ] Set up DNS records
- [ ] Configure in Vercel

**Note**: scitv.com currently exists (Science Television site). Options:
- Acquire the domain
- Use subdomain: `app.scitv.com` or `videos.scitv.com`
- Use different domain: `scitv.fyi`, `scitv.app`, etc.

### 3.2 Next.js Site Structure

```
scitv.com/
├── /                    # Homepage with discipline cards
├── /feed                # All recent videos (chronological)
├── /biology             # Biology feed
├── /chemistry           # Chemistry feed
├── /cs                  # Computer Science feed
├── /mathematics         # Mathematics feed
├── /physics             # Physics feed
├── /search              # Global search
└── /video/[id]          # Video detail page
```

### 3.3 Feed Pages

Each discipline page (`/biology`, `/chemistry`, etc.) will:
- Display most recent videos (last 30 days)
- Auto-update via API routes
- Show video cards with:
  - Thumbnail
  - Title
  - Channel name
  - Published date
  - Duration
  - Link to video detail page

### 3.4 Auto-Updating Feeds

**Option 1: API Routes with Revalidation**
```typescript
// app/biology/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function BiologyFeed() {
  const videos = await getRecentVideos('biology', 30) // Last 30 days
  return <VideoGrid videos={videos} />
}
```

**Option 2: Cron Jobs**
- Vercel Cron Jobs (if on Pro plan)
- Or external cron service (cron-job.org, EasyCron)
- Updates database, triggers revalidation

**Option 3: On-Demand Revalidation**
- Webhook from ingestion worker
- Calls Vercel API to revalidate pages

### 3.5 Video Detail Pages
- Full video metadata
- Transcript with search
- Related videos
- Channel information
- Share functionality

## Phase 4: Production Launch

### 4.1 Performance Optimization
- [ ] Image optimization (thumbnails)
- [ ] Caching strategy
- [ ] Database query optimization
- [ ] CDN setup

### 4.2 Monitoring & Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Analytics (Vercel Analytics or Google Analytics)
- [ ] Uptime monitoring

### 4.3 SEO & Discovery
- [ ] Meta tags for each page
- [ ] Sitemap generation
- [ ] RSS feeds per discipline
- [ ] Open Graph tags

## Technical Stack

### Frontend (Vercel)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS or CSS Modules
- **Components**: React Server Components
- **Deployment**: Vercel (automatic from GitHub)

### Backend
- **Database**: PostgreSQL (Cloud SQL - scienceviddb-db)
- **Ingestion**: Cloud Run scheduled jobs
- **API**: Next.js API routes
- **Search**: Meilisearch/OpenSearch + Vector DB

### Infrastructure
- **Domain**: scitv.com (to be configured)
- **Hosting**: Vercel
- **Database**: Google Cloud SQL
- **Storage**: Google Cloud Storage (thumbnails, cached data)
- **Secrets**: Google Secrets Manager

## Timeline Estimate

- **Phase 1** (Testing & Initial Data): 1-2 weeks
- **Phase 2** (Scaling): 2-3 weeks
- **Phase 3** (Vercel Site): 2-3 weeks
- **Phase 4** (Production): 1 week

**Total**: ~6-9 weeks to full production launch

## Next Immediate Steps

1. ✅ Wait for HuggingFace Space rebuild
2. Test the Gradio interface
3. Integrate database with ingestion worker
4. Add first batch of channels
5. Run initial ingestion
6. Start building Vercel site structure

---

**Domain Note**: Since scitv.com currently exists, we may need to:
- Contact current owner to acquire
- Use alternative domain initially
- Use subdomain approach

Let's start with testing and data collection, then address domain when ready for production.

