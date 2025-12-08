# TODO - Science Video Database

## 🔐 Security (Pending)

- [ ] **Complete API Key Rotation** (See `docs/PENDING_KEY_ROTATION.md`)
  - Check old key usage in Google Cloud Console
  - Verify usage dropped to 0
  - Delete old exposed key: `AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs`
  - Status: Waiting 1-2 days to verify no active usage

## 🧪 Testing

- [ ] Test HuggingFace Space after rebuild
- [ ] Verify Gradio app works correctly

## 🗄️ Database Integration

- [ ] Integrate database with ingestion worker
- [ ] Add initial channel registry (10-15 channels)
- [ ] Run first ingestion batch
- [ ] Test search functionality

## 📈 Scaling

- [ ] Expand to 50+ channels
- [ ] Scale to 20k+ videos
- [ ] Set up automated ingestion

## 🌐 Vercel Website (scitv.com)

- [ ] Build Next.js feed pages
- [ ] Implement auto-updating feeds
- [ ] Configure domain (scitv.com)
- [ ] Deploy to production

---

**Note**: Check `docs/PENDING_KEY_ROTATION.md` for details on the API key rotation that needs to be completed.

