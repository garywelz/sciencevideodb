/**
 * Google Cloud Platform configuration for ingestion worker
 * 
 * Loads configuration from environment variables or Google Secrets Manager
 */

import { getSecret, SecretNames } from '@scienceviddb/gcp-utils'

const GOOGLE_CLOUD_PROJECT = 'regal-scholar-453620-r7'

export interface GCPConfig {
  projectId: string
  youtubeApiKey: string
  databaseUrl: string
  useSecretsManager: boolean
}

let configCache: GCPConfig | null = null

/**
 * Get GCP configuration
 * 
 * If USE_SECRETS_MANAGER is true (or in production), fetches secrets from Google Secrets Manager.
 * Otherwise, uses environment variables.
 */
export async function getGCPConfig(): Promise<GCPConfig> {
  if (configCache) {
    return configCache
  }
  
  const useSecretsManager = 
    process.env.USE_SECRETS_MANAGER === 'true' || 
    process.env.NODE_ENV === 'production' ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined
  
  let youtubeApiKey: string
  let databaseUrl: string
  
  if (useSecretsManager) {
    // Fetch from Google Secrets Manager
    youtubeApiKey = await getSecret(SecretNames.YOUTUBE_API_KEY)
    databaseUrl = await getSecret(SecretNames.DATABASE_URL)
  } else {
    // Use environment variables (for local development)
    youtubeApiKey = process.env.YOUTUBE_API_KEY || ''
    databaseUrl = process.env.DATABASE_URL || ''
    
    if (!youtubeApiKey || !databaseUrl) {
      throw new Error(
        'Missing required environment variables. Set YOUTUBE_API_KEY and DATABASE_URL, ' +
        'or enable USE_SECRETS_MANAGER=true to use Google Secrets Manager.'
      )
    }
  }
  
  configCache = {
    projectId: GOOGLE_CLOUD_PROJECT,
    youtubeApiKey,
    databaseUrl,
    useSecretsManager,
  }
  
  return configCache
}

/**
 * Clear configuration cache (useful for testing)
 */
export function clearConfigCache(): void {
  configCache = null
}

