/**
 * IndexNow submission script for Agent-CoreX Docs
 * Submits all URLs from sitemap to IndexNow API
 *
 * Setup:
 *   1. Register at https://www.indexnow.org/
 *   2. Set INDEXNOW_KEY in your environment variables or .env.local
 *   3. The key file will be automatically placed in public/{key}.txt
 *
 * Usage:
 *   npx tsx scripts/indexnow.ts
 *   (can be run during deployment/build process)
 */

import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = 'https://docs.agent-corex.com'
const HOST = new URL(BASE_URL).hostname

interface NavGroup {
  group: string
  pages: string[]
}

interface MintConfig {
  navigation: NavGroup[]
}

async function main() {
  const KEY = process.env.INDEXNOW_KEY_DOCS || process.env.INDEXNOW_KEY

  if (!KEY) {
    console.warn('[IndexNow] INDEXNOW_KEY_DOCS not set in environment — skipping submission.')
    console.warn('[IndexNow] Set INDEXNOW_KEY_DOCS or INDEXNOW_KEY to enable IndexNow submission.')
    process.exit(0)
  }

  try {
    // Read mint.json to extract pages
    const mintPath = path.join(__dirname, '../mint.json')
    const mintConfig: MintConfig = JSON.parse(fs.readFileSync(mintPath, 'utf-8'))

    const urls: string[] = [
      `${BASE_URL}/`,
      `${BASE_URL}/api-reference`,
      `${BASE_URL}/guides`,
      `${BASE_URL}/examples`,
    ]

    // Extract all pages from navigation
    if (mintConfig.navigation && Array.isArray(mintConfig.navigation)) {
      for (const group of mintConfig.navigation) {
        if (group.pages && Array.isArray(group.pages)) {
          for (const page of group.pages) {
            urls.push(`${BASE_URL}/${page}`)
          }
        }
      }
    }

    // Ensure key file exists in public
    const keyFilePath = path.join(__dirname, `../public/${KEY}.txt`)
    if (!fs.existsSync(keyFilePath)) {
      fs.writeFileSync(keyFilePath, KEY, 'utf-8')
      console.log(`[IndexNow] Created key file: ${keyFilePath}`)
    }

    console.log(`[IndexNow] Submitting ${urls.length} URLs to IndexNow API...`)

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${BASE_URL}/${KEY}.txt`,
        urlList: urls,
      }),
    })

    if (res.ok) {
      console.log(`[IndexNow] Success (${res.status}) — ${urls.length} URLs submitted.`)
    } else {
      const body = await res.text()
      console.error(`[IndexNow] Failed (${res.status}): ${body}`)
      process.exit(1)
    }
  } catch (err) {
    console.error('[IndexNow] Error:', err)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('[IndexNow] Fatal error:', err)
  process.exit(1)
})
