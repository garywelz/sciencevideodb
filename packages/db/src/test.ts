#!/usr/bin/env node

/**
 * Database connection test
 */

import { testConnection, query, close } from './client'
import { getActiveChannels } from './queries'

async function test() {
  console.log('='.repeat(60))
  console.log('Database Connection Test')
  console.log('='.repeat(60))
  console.log('')

  try {
    // Test 1: Connection
    console.log('🧪 Testing database connection...')
    const connected = await testConnection()
    if (!connected) {
      console.log('❌ Connection failed')
      process.exit(1)
    }
    console.log('✅ Connection successful\n')

    // Test 2: Query tables
    console.log('🧪 Testing table queries...')
    const tablesResult = await query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    )
    console.log(`✅ Found ${tablesResult.rows.length} tables:`)
    tablesResult.rows.forEach((row) => {
      const tableRow = row as { table_name: string }
      console.log(`   - ${tableRow.table_name}`)
    })
    console.log('')

    // Test 3: Query channels
    console.log('🧪 Testing channel queries...')
    const channels = await getActiveChannels()
    console.log(`✅ Found ${channels.length} active channels`)
    if (channels.length > 0) {
      console.log('   Sample channels:')
      channels.slice(0, 3).forEach((channel) => {
        console.log(`   - ${channel.channelName} (${channel.channelId})`)
      })
    }
    console.log('')

    console.log('='.repeat(60))
    console.log('✅ All database tests passed!')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('\n❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await close()
  }
}

test()

