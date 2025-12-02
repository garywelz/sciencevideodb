#!/usr/bin/env node

/**
 * Database migration script
 * 
 * Runs the schema.sql file to set up the database
 */

import { readFileSync, existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { query, testConnection } from './client'

async function migrate() {
  console.log('Starting database migration...\n')

  // Test connection first
  console.log('Testing database connection...')
  const connected = await testConnection()
  if (!connected) {
    console.error('❌ Failed to connect to database')
    process.exit(1)
  }
  console.log('✅ Database connection successful\n')

  // Find project root by going up from current file location
  // packages/db/src/migrate.ts -> packages/db -> project root
  let currentDir = __dirname // packages/db/dist/src or packages/db/src
  let projectRoot = currentDir
  
  // Go up directories until we find the root package.json
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(projectRoot, 'package.json'))) {
      const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'))
      if (pkg.name === 'scienceviddb') {
        break // Found the root!
      }
    }
    projectRoot = resolve(projectRoot, '..')
  }
  
  const schemaPath = join(projectRoot, 'docs', 'schema.sql')
  console.log(`Reading schema from: ${schemaPath}`)
  
  let schema: string
  try {
    schema = readFileSync(schemaPath, 'utf-8')
  } catch (error) {
    console.error(`❌ Failed to read schema file: ${error}`)
    process.exit(1)
  }

  // Remove comments and clean up
  let cleanedSchema = schema
    .split('\n')
    .map((line) => {
      // Remove inline comments
      const commentIndex = line.indexOf('--')
      if (commentIndex >= 0) {
        return line.substring(0, commentIndex)
      }
      return line
    })
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed.length > 0 && !trimmed.startsWith('--')
    })
    .join('\n')
  
  // Split by semicolon, but handle dollar-quoted strings
  const statements: string[] = []
  let currentStatement = ''
  let inDollarQuote = false
  let dollarTag = ''
  
  for (let i = 0; i < cleanedSchema.length; i++) {
    const char = cleanedSchema[i]
    const nextChar = cleanedSchema[i + 1] || ''
    
    // Check for dollar-quoted strings ($$ or $tag$)
    if (char === '$' && !inDollarQuote) {
      // Look ahead to find the closing $
      let tagEnd = i + 1
      while (tagEnd < cleanedSchema.length && cleanedSchema[tagEnd] !== '$') {
        tagEnd++
      }
      if (tagEnd < cleanedSchema.length) {
        dollarTag = cleanedSchema.substring(i, tagEnd + 1)
        inDollarQuote = true
        currentStatement += dollarTag
        i = tagEnd
        continue
      }
    } else if (inDollarQuote && cleanedSchema.substring(i).startsWith(dollarTag)) {
      currentStatement += dollarTag
      i += dollarTag.length - 1
      inDollarQuote = false
      dollarTag = ''
      continue
    }
    
    currentStatement += char
    
    // If we hit a semicolon and we're not in a dollar quote, end the statement
    if (char === ';' && !inDollarQuote) {
      const trimmed = currentStatement.trim()
      if (trimmed.length > 0) {
        statements.push(trimmed)
      }
      currentStatement = ''
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim().length > 0) {
    statements.push(currentStatement.trim())
  }
  
  // Filter out empty statements
  const finalStatements = statements.filter((s) => s.length > 0)

  console.log(`Found ${statements.length} SQL statements to execute\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    
    // Skip comments and empty lines
    if (statement.startsWith('--') || statement.length === 0) {
      continue
    }

    try {
      await query(statement)
      successCount++
      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${statements.length} statements...`)
      }
    } catch (error) {
      // Some statements might fail if they already exist (like extensions)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('already exists')) {
        // This is okay for CREATE EXTENSION and similar
        successCount++
      } else {
        console.error(`\n❌ Error executing statement ${i + 1}:`)
        console.error(`   ${statement.substring(0, 100)}...`)
        console.error(`   Error: ${errorMessage}\n`)
        errorCount++
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Migration Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount}`)
  }
  console.log('='.repeat(60) + '\n')

  if (errorCount > 0) {
    console.log('⚠️  Some statements had errors. Check the output above.')
    process.exit(1)
  } else {
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  }
}

migrate().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

