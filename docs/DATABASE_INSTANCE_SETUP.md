# Science Video DB Database Instance Setup

## ✅ What's Been Created

Following the same pattern as your other services:

1. **Cloud SQL Instance**: `scienceviddb-db`
   - Version: PostgreSQL 15
   - Region: us-central1-f
   - Tier: db-f1-micro (same as copernicus-db and glmp-db)
   - Public IP: 34.31.235.165

2. **Database**: `scienceviddb` (created inside the instance)

3. **User**: `scienceviddb_user` (created, password needs to be set)

## Architecture Alignment

Your infrastructure now has **three parallel databases**:

```
regal-scholar-453620-r7
├── copernicus-db    → CopernicusAI Admin Dashboard
├── glmp-db          → GLMP (Hugging Face)
└── scienceviddb-db  → Science Video Database (NEW)
```

Each service has its own isolated database instance, following best practices.

## Next Steps

### 1. Set Database User Password

```bash
gcloud sql users set-password scienceviddb_user \
  --instance=scienceviddb-db \
  --password=YOUR_SECURE_PASSWORD \
  --project=regal-scholar-453620-r7
```

### 2. Create Connection String

Once password is set:

```bash
INSTANCE_IP="34.31.235.165"
PASSWORD="YOUR_PASSWORD"
CONNECTION_STRING="postgresql://scienceviddb_user:${PASSWORD}@${INSTANCE_IP}:5432/scienceviddb"

echo -n "$CONNECTION_STRING" | \
  gcloud secrets versions add scienceviddb-database-url \
  --project=regal-scholar-453620-r7 \
  --data-file=-
```

### 3. For Cloud Run (Production)

When deploying to Cloud Run, you can use the Cloud SQL connection name instead:

```
/cloudsql/regal-scholar-453620-r7:us-central1-f:scienceviddb-db
```

This uses the Cloud SQL Proxy and works automatically on Cloud Run.

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Test Connection

```bash
npm run db:test
```

## Integration with Existing Infrastructure

### Google Cloud Storage

- **CopernicusAI**: Uses `regal-scholar-453620-r7-media` bucket
- **Science Video DB**: Will use `scienceviddb-assets` bucket (to be created)

### Secrets Manager

All services share the same Secrets Manager:
- `copernicus-db-url` → CopernicusAI database
- `glmp-db-url` (if exists) → GLMP database  
- `scienceviddb-database-url` → Science Video DB database

### Firebase

If you're using Firebase:
- Science Video DB can share Firebase Auth (future)
- Firebase Storage not needed (using GCS instead)
- Firestore not needed (using PostgreSQL)

## Cost Estimate

- **db-f1-micro**: ~$7-10/month per instance
- **Total for 3 instances**: ~$21-30/month
- Very reasonable for the isolation and organization you get!

## Security

Each database instance is isolated:
- Separate users and passwords
- Independent access controls
- Can be backed up independently
- Can be scaled independently

