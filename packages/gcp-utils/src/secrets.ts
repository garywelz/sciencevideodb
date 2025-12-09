/**
 * Google Secrets Manager integration
 * 
 * Fetches secrets from Google Secrets Manager for secure credential management.
 * Works with CopernicusAI project: regal-scholar-453620-r7
 */

import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const PROJECT_ID = 'regal-scholar-453620-r7'
const client = new SecretManagerServiceClient()

/**
 * Cache for secrets to avoid repeated API calls
 */
const secretCache = new Map<string, string>()

/**
 * Get a secret value from Google Secrets Manager
 * 
 * @param secretName - Name of the secret (e.g., 'youtube-api-key')
 * @param version - Secret version (default: 'latest')
 * @param useCache - Whether to use cached value if available (default: true)
 * @returns Secret value as string
 */
export async function getSecret(
  secretName: string,
  version: string = 'latest',
  useCache: boolean = true
): Promise<string> {
  const cacheKey = `${secretName}:${version}`
  
  // Return cached value if available and caching is enabled
  if (useCache && secretCache.has(cacheKey)) {
    return secretCache.get(cacheKey)!
  }
  
  try {
    const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/${version}`
    const [response] = await client.accessSecretVersion({ name })
    
    if (!response.payload || !response.payload.data) {
      throw new Error(`Secret ${secretName} not found or empty`)
    }
    
    const secretValue = response.payload.data.toString()
    
    // Cache the secret
    if (useCache) {
      secretCache.set(cacheKey, secretValue)
    }
    
    return secretValue
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch secret ${secretName}: ${errorMessage}`)
  }
}

/**
 * Clear the secret cache (useful for testing or after secret rotation)
 */
export function clearSecretCache(): void {
  secretCache.clear()
}

/**
 * Pre-configured secret names used in Science Video DB
 * These should match the secret names in Google Secrets Manager
 */
export const SecretNames = {
  YOUTUBE_API_KEY: 'youtube-api-key',
  DATABASE_URL: 'scienceviddb-database-url',
  OPENAI_API_KEY: 'openai-api-key',
  VECTOR_DB_API_KEY: 'vector-db-api-key',
  SEARCH_INDEX_API_KEY: 'search-index-api-key',
} as const

/**
 * Get YouTube API key from Secrets Manager
 */
export async function getYouTubeApiKey(): Promise<string> {
  return getSecret(SecretNames.YOUTUBE_API_KEY)
}

/**
 * Get database URL from Secrets Manager or environment variable
 * 
 * Checks USE_SECRETS_MANAGER environment variable:
 * - If false, 'false', not set, or empty: uses DATABASE_URL environment variable
 * - If explicitly 'true': fetches from Google Secrets Manager
 */
export async function getDatabaseUrl(): Promise<string> {
  // Check DATABASE_URL first - if it exists and USE_SECRETS_MANAGER is not explicitly 'true', use it
  const databaseUrl = process.env.DATABASE_URL
  const useSecretsManager = process.env.USE_SECRETS_MANAGER === 'true'
  
  // Prefer DATABASE_URL if available and not explicitly using Secrets Manager
  if (databaseUrl && !useSecretsManager) {
    return databaseUrl
  }
  
  // If DATABASE_URL is not set and not using Secrets Manager, throw error
  if (!databaseUrl && !useSecretsManager) {
    throw new Error('DATABASE_URL environment variable not set. Set DATABASE_URL or enable USE_SECRETS_MANAGER=true')
  }
  
  // Only fetch from Secrets Manager if explicitly enabled
  if (useSecretsManager) {
    return getSecret(SecretNames.DATABASE_URL)
  }
  
  // Fallback (shouldn't reach here, but TypeScript needs it)
  throw new Error('DATABASE_URL environment variable not set')
}

