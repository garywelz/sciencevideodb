# Safe Key Rotation - CopernicusAI Integration

## Situation

- Old key (`AIzaSyD4Zg7...`) was used **91 times in past 30 days**
- Likely used in **CopernicusAI** project
- Already updated **Science Video DB** (youtube-api-key secret)

## Safe Rotation Strategy

### Option 1: Wait and Monitor (Recommended)

1. **Don't delete the old key yet**
2. **Wait 24-48 hours** after updating Secrets Manager
3. **Check old key usage again**:
   - If usage drops to 0 → Safe to delete
   - If usage continues → Still being used somewhere
4. **Find remaining usage** before deleting

### Option 2: Find All Uses First

1. **Check all Secrets Manager secrets**:
   ```bash
   # Check if any secret contains the old key
   gcloud secrets list --project=regal-scholar-453620-r7
   ```

2. **Check CopernicusAI services**:
   - Cloud Run services
   - App Engine services
   - Cloud Functions
   - Environment variables in deployments

3. **Update each location** with new key

4. **Test everything** works

5. **Then delete** old key

## Places the Key Might Be Used

### 1. Secrets Manager
- ✅ `youtube-api-key` - Already updated with new key
- Check other secrets if they exist

### 2. CopernicusAI Services

Check CopernicusAI deployments:

```bash
# List Cloud Run services
gcloud run services list --project=regal-scholar-453620-r7

# Check environment variables for a service
gcloud run services describe SERVICE_NAME \
  --project=regal-scholar-453620-r7 \
  --format="value(spec.template.spec.containers[0].env)"
```

### 3. Direct Configuration

Check if CopernicusAI has:
- Hardcoded API keys in code
- Environment variables in deployment configs
- Separate Secrets Manager secrets
- Kubernetes secrets

## Recommended Action Plan

### Step 1: Update Science Video DB (Done ✅)
- ✅ New key in Secrets Manager
- ✅ Tests passing

### Step 2: Check CopernicusAI
1. Search CopernicusAI codebase for the old key
2. Check CopernicusAI Secrets Manager
3. Check CopernicusAI service configurations
4. Update if found

### Step 3: Monitor Old Key Usage
1. Wait 24-48 hours
2. Check usage count again
3. If usage drops → Safe to delete
4. If usage continues → Find remaining usage

### Step 4: Delete Old Key (Only When Safe)
- ✅ All services updated
- ✅ Usage drops to 0
- ✅ Everything tested and working

## Quick Checks

```bash
# 1. Verify new key is in Secrets Manager
gcloud secrets versions access latest --secret=youtube-api-key \
  --project=regal-scholar-453620-r7

# 2. List all Cloud Run services
gcloud run services list --project=regal-scholar-453620-r7

# 3. Check a specific service's env vars
gcloud run services describe SERVICE_NAME \
  --project=regal-scholar-453620-r7 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

## Safety Recommendation

**Don't delete the old key yet!**

Instead:
1. **Wait 24-48 hours**
2. **Check usage again** - see if it drops
3. **If usage drops to 0** → Safe to delete
4. **If usage continues** → Investigate where it's still being used

This way, CopernicusAI can continue working even if it's still using the old key temporarily, and you can find all uses before deleting.

## Alternative: Check CopernicusAI First

If you want to be proactive:

1. Search CopernicusAI codebase/config for the old key
2. Update CopernicusAI to use new key (or same secret)
3. Test CopernicusAI
4. Wait for old key usage to drop
5. Delete old key

---

**Bottom Line**: The old key can stay for a few days. Monitor usage and delete when it's safe.

