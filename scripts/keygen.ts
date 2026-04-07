/**
 * IndexNow Key Generator
 * Generates a unique key for IndexNow API authentication
 *
 * Run this once to generate your IndexNow key:
 *   npx tsx scripts/keygen.ts
 *
 * Then:
 *   1. Copy the generated key
 *   2. Register at https://www.indexnow.org/
 *   3. Add INDEXNOW_KEY_DOCS={key} to your environment variables
 *   4. The key file will be auto-created in public/{key}.txt during indexnow.ts
 */

import * as crypto from 'crypto'

function generateIndexNowKey(): string {
  // IndexNow keys are typically 32-character hex strings
  return crypto.randomBytes(16).toString('hex')
}

const key = generateIndexNowKey()

console.log('')
console.log('='.repeat(60))
console.log('IndexNow Key Generated for docs.agent-corex.com')
console.log('='.repeat(60))
console.log('')
console.log(`Key: ${key}`)
console.log('')
console.log('Next steps:')
console.log('  1. Copy the key above')
console.log('  2. Register at https://www.indexnow.org/')
console.log('  3. Verify your site ownership using the key')
console.log('  4. Add to your environment:')
console.log(`     INDEXNOW_KEY_DOCS=${key}`)
console.log('  5. The key file will auto-create in public/{key}.txt')
console.log('')
console.log('='.repeat(60))
console.log('')
