#!/usr/bin/env node

/**
 * Add multiple curated science channels to the database
 * 
 * This script adds 10-15 high-quality science channels across
 * all disciplines: biology, chemistry, cs, mathematics, physics
 */

import { createChannel, getChannelByChannelId } from '@scienceviddb/db'
import { close } from '@scienceviddb/db'
import type { ChannelRegistry } from '@scienceviddb/shared'

interface ChannelToAdd {
  channelId: string
  channelName: string
  channelUrl: string
  disciplines: Array<'biology' | 'chemistry' | 'cs' | 'mathematics' | 'physics'>
  priority: number
  tags: string[]
  description?: string
}

const channels: ChannelToAdd[] = [
  // Mathematics
  {
    channelId: 'UCoxcjq-8xIDTYp3uz647V5A', // Numberphile
    channelName: 'Numberphile',
    channelUrl: 'https://www.youtube.com/@numberphile',
    disciplines: ['mathematics'],
    priority: 9,
    tags: ['mathematics', 'numbers', 'puzzles', 'proofs'],
    description: 'Videos about numbers and mathematics',
  },
  {
    channelId: 'UCsXVk37bltHxD1rDPwtNM8Q', // Kurzgesagt (has math content)
    channelName: 'Kurzgesagt – In a Nutshell',
    channelUrl: 'https://www.youtube.com/@kurzgesagt',
    disciplines: ['mathematics', 'physics', 'biology'],
    priority: 8,
    tags: ['science', 'explained', 'visualizations', 'education'],
    description: 'Science and math explained with beautiful animations',
  },
  
  // Physics
  {
    channelId: 'UCHnyfMqiRRG1u-2MsSQLbXA', // Veritasium
    channelName: 'Veritasium',
    channelUrl: 'https://www.youtube.com/@veritasium',
    disciplines: ['physics'],
    priority: 10,
    tags: ['physics', 'experiments', 'explanations', 'science'],
    description: 'An element of truth - videos about science, experiments, and physics',
  },
  {
    channelId: 'UCUHW94eEFW7hkUMVaZz4eDg', // minutephysics
    channelName: 'MinutePhysics',
    channelUrl: 'https://www.youtube.com/@minutephysics',
    disciplines: ['physics'],
    priority: 8,
    tags: ['physics', 'quick', 'explanations', 'whiteboard'],
    description: 'Cool physics and other sweet science',
  },
  {
    channelId: 'UC7DdEm33SyaTDtWYGO2CwdA', // Physics Girl
    channelName: 'Physics Girl',
    channelUrl: 'https://www.youtube.com/@physicsgirl',
    disciplines: ['physics'],
    priority: 7,
    tags: ['physics', 'experiments', 'diy', 'science'],
    description: 'Physics experiments and science explanations',
  },
  {
    channelId: 'UCvBqzzvUBLCB8iY2UE6If-Q', // Sixty Symbols
    channelName: 'Sixty Symbols',
    channelUrl: 'https://www.youtube.com/@sixtysymbols',
    disciplines: ['physics'],
    priority: 8,
    tags: ['physics', 'astronomy', 'symbols', 'university'],
    description: 'Videos about physics and astronomy',
  },
  
  // Chemistry
  {
    channelId: 'UCtESv1e7ntJaLJYKIO1FoYw', // Periodic Videos
    channelName: 'Periodic Videos',
    channelUrl: 'https://www.youtube.com/@periodicvideos',
    disciplines: ['chemistry'],
    priority: 9,
    tags: ['chemistry', 'elements', 'periodic table', 'experiments'],
    description: 'The periodic table of videos',
  },
  {
    channelId: 'UCkbmD1dP0h-Uq9Yn2RJty7A', // Tyler DeWitt
    channelName: 'Tyler DeWitt',
    channelUrl: 'https://www.youtube.com/@TylerDeWitt',
    disciplines: ['chemistry'],
    priority: 8,
    tags: ['chemistry', 'education', 'tutorials', 'high school'],
    description: 'Chemistry made easy',
  },
  
  // Biology
  {
    channelId: 'UCX6b17PVsYBQ0ip5gyeme-Q', // Crash Course (all courses)
    channelName: 'Crash Course',
    channelUrl: 'https://www.youtube.com/@crashcourse',
    disciplines: ['biology', 'chemistry', 'physics'],
    priority: 8,
    tags: ['education', 'crash course', 'tutorials', 'biology', 'chemistry', 'physics'],
    description: 'Crash Course educational series',
  },
  {
    channelId: 'UCEik-U3T6u6JA0XiHLbNbOw', // Bozeman Science
    channelName: 'Bozeman Science',
    channelUrl: 'https://www.youtube.com/@bozemanscience',
    disciplines: ['biology', 'chemistry', 'physics'],
    priority: 7,
    tags: ['biology', 'chemistry', 'physics', 'ap', 'education'],
    description: 'AP Biology, Chemistry, and Physics',
  },
  
  // Computer Science
  {
    channelId: 'UC9-y-6cct5sRBh4iHuT7hKQ', // Computerphile
    channelName: 'Computerphile',
    channelUrl: 'https://www.youtube.com/@Computerphile',
    disciplines: ['cs'],
    priority: 9,
    tags: ['computer science', 'programming', 'algorithms', 'computers'],
    description: 'Videos all about computers and computer stuff',
  },
  {
    channelId: 'UCEBb1b_L6zDS3xTUrIALZOw', // MIT OpenCourseWare
    channelName: 'MIT OpenCourseWare',
    channelUrl: 'https://www.youtube.com/@mitocw',
    disciplines: ['cs', 'mathematics', 'physics'],
    priority: 9,
    tags: ['mit', 'computer science', 'mathematics', 'physics', 'lectures'],
    description: 'MIT course materials and lectures',
  },
  
  // Multi-disciplinary
  {
    channelId: 'UCsooa4yRKGN_zEE8iknghZA', // TED-Ed
    channelName: 'TED-Ed',
    channelUrl: 'https://www.youtube.com/@TEDEd',
    disciplines: ['biology', 'chemistry', 'cs', 'mathematics', 'physics'],
    priority: 8,
    tags: ['education', 'science', 'explanations', 'animations'],
    description: 'TED-Ed animated educational videos',
  },
  {
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Khan Academy
    channelName: 'Khan Academy',
    channelUrl: 'https://www.youtube.com/@khanacademy',
    disciplines: ['biology', 'chemistry', 'cs', 'mathematics', 'physics'],
    priority: 9,
    tags: ['education', 'khan academy', 'tutorials', 'lessons'],
    description: 'Khan Academy educational content',
  },
]

async function addChannels() {
  console.log('Adding curated science channels to database...\n')
  console.log(`Total channels to add: ${channels.length}\n`)
  console.log('='.repeat(60))
  
  let added = 0
  let skipped = 0
  let errors = 0
  
  for (const channelData of channels) {
    try {
      // Check if channel already exists
      const existing = await getChannelByChannelId(channelData.channelId)
      if (existing) {
        console.log(`⏭️  Skipped: ${channelData.channelName} (already exists)`)
        skipped++
        continue
      }
      
      const channel: Omit<ChannelRegistry, 'id' | 'createdAt' | 'updatedAt'> = {
        channelId: channelData.channelId,
        channelName: channelData.channelName,
        channelUrl: channelData.channelUrl,
        source: 'youtube',
        disciplines: channelData.disciplines,
        priority: channelData.priority,
        updateCadence: 'daily',
        isActive: true,
        tags: channelData.tags,
        metadata: {
          description: channelData.description || '',
        },
      }
      
      const created = await createChannel(channel)
      console.log(`✅ Added: ${created.channelName}`)
      console.log(`   Disciplines: ${created.disciplines.join(', ')}`)
      console.log(`   Priority: ${created.priority}`)
      added++
    } catch (error) {
      console.error(`❌ Error adding ${channelData.channelName}:`, error)
      errors++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('Summary:')
  console.log(`  ✅ Added: ${added}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Errors: ${errors}`)
  console.log('='.repeat(60))
  
  if (added > 0) {
    console.log(`\n🎉 Successfully added ${added} channels!`)
    console.log('\nYou can now run: npm run ingest:all --workspace=packages/ingestion')
  }
}

addChannels()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    close()
  })

