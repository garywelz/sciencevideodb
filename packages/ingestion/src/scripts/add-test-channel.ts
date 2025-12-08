#!/usr/bin/env node

/**
 * Add a test channel to the database for ingestion testing
 */

import { createChannel } from '@scienceviddb/db'
import { close } from '@scienceviddb/db'
import type { ChannelRegistry } from '@scienceviddb/shared'

async function addTestChannel() {
  try {
    console.log('Adding test channel to database...\n')

    // 3Blue1Brown - Popular mathematics/CS channel
    const channel: Omit<ChannelRegistry, 'id' | 'createdAt' | 'updatedAt'> = {
      channelId: 'UCYO_jab_esuFRV4b17AJtAw', // 3Blue1Brown
      channelName: '3Blue1Brown',
      channelUrl: 'https://www.youtube.com/@3blue1brown',
      source: 'youtube',
      disciplines: ['mathematics', 'cs'],
      priority: 8,
      updateCadence: 'daily',
      isActive: true,
      tags: ['mathematics', 'computer science', 'visualizations', 'explanations'],
      metadata: {
        description: '3Blue1Brown is a channel about animating math',
        subscriberCount: '5.5M+',
      },
    }

    const created = await createChannel(channel)
    console.log('✅ Channel added successfully!')
    console.log(`   ID: ${created.id}`)
    console.log(`   Name: ${created.channelName}`)
    console.log(`   Channel ID: ${created.channelId}`)
    console.log(`   Disciplines: ${created.disciplines.join(', ')}`)
    console.log('\nYou can now run: npm run ingest -- --channel', created.channelId)
  } catch (error) {
    console.error('❌ Failed to add channel:', error)
    process.exit(1)
  } finally {
    await close()
  }
}

addTestChannel()

