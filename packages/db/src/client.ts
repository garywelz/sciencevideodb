/**
 * PostgreSQL database client
 * 
 * Handles connection pooling and database operations
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
import { getDatabaseUrl } from '@scienceviddb/gcp-utils'

let pool: Pool | null = null

/**
 * Get or create database connection pool
 */
export async function getPool(): Promise<Pool> {
  if (pool) {
    return pool
  }

  let databaseUrl = await getDatabaseUrl()
  
  // Handle Cloud SQL connection name (for Cloud Run or Cloud SQL Proxy)
  // Format: "project:region:instance" or "/cloudsql/project:region:instance"
  if (databaseUrl.includes('regal-scholar') && !databaseUrl.startsWith('postgresql://')) {
    const connectionName = databaseUrl.replace('/cloudsql/', '')
    // Use Unix socket connection (works on Cloud Run and with Cloud SQL Proxy)
    databaseUrl = `postgresql://scienceviddb_user@localhost/scienceviddb?host=/cloudsql/${connectionName}`
  }
  
  pool = new Pool({
    connectionString: databaseUrl,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
  })

  return pool
}

/**
 * Execute a query
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const db = await getPool()
  return db.query<T>(text, params)
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const db = await getPool()
  return db.connect()
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Close all database connections
 */
export async function close(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as now')
    return result.rows.length > 0
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

