# Science Video Database - Web App

Next.js 14 frontend for the Science Video Database.

## Features

- **Home Page** - Browse disciplines with video counts
- **Discipline Feeds** - Recent videos for each discipline (biology, chemistry, cs, mathematics, physics)
- **Auto-updating** - Pages revalidate every hour to show fresh content
- **Responsive Design** - Works on desktop and mobile

## Routes

- `/` - Home page with discipline cards
- `/discipline/[discipline]` - Feed page for each discipline
- `/api/videos/[discipline]` - API endpoint for fetching videos

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

The app uses the database package which requires:

- `DATABASE_URL` - PostgreSQL connection string
- `USE_SECRETS_MANAGER=true` - Use Google Secrets Manager (recommended for production)

See the main README for database setup instructions.

## Deployment

Ready for Vercel deployment:

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy!

The app uses Next.js App Router with Server Components for optimal performance.

