/**
 * Google Cloud Platform utilities for Science Video Database
 * 
 * Integrates with:
 * - Google Secrets Manager (for API keys and credentials)
 * - Google Cloud Storage (for transcript and thumbnail caching)
 * - Vertex AI (for embeddings and ML models)
 */

export * from './secrets'
export * from './storage'
export * from './vertex-ai'

