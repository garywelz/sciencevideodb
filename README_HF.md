---
title: Science Video Database
emoji: 🔬
colorFrom: blue
colorTo: purple
sdk: docker
sdk_version: "latest"
app_port: 3000
pinned: false
license: mit
---

# Science Video Database

A curated search experience for technical science enthusiasts, featuring biology, chemistry, CS, mathematics, and physics videos from YouTube and other sources.

## 🔍 What is this?

This is a comprehensive video search platform that:
- Ingests videos from curated YouTube channels
- Extracts and indexes video transcripts
- Provides hybrid search (keyword + semantic)
- Supports filtering by discipline, channel, and more

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Node.js/TypeScript
- **Database**: PostgreSQL (Cloud SQL)
- **Vector DB**: Ready for Pinecone/Weaviate/Qdrant
- **Search**: Meilisearch/OpenSearch
- **Cloud**: Google Cloud Platform

## 📚 Documentation

- [GitHub Repository](https://github.com/garywelz/sciencevideodb)
- [Architecture Docs](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/SETUP.md)

## 🚀 Status

**Current Phase**: Prototype
- ✅ YouTube API client (10/10 tests passing)
- ✅ Database schema and migrations
- ✅ Google Cloud integration
- 🔄 Frontend development in progress
- 🔄 Ingestion pipeline in progress

## 🎯 Goals

- **Prototype**: 10-15 channels, ~2k videos
- **Alpha**: 50+ channels, 20k videos
- **Production**: 200k+ videos with autoscaling

---

**Note**: This Space is synced with the GitHub repository. For the full application, see the [GitHub repo](https://github.com/garywelz/sciencevideodb).

