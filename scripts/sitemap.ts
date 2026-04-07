/**
 * Sitemap Generator for Agent-CoreX Docs (Mintlify)
 * Generates sitemap.xml from mint.json navigation structure
 *
 * Usage:
 *   npx tsx scripts/sitemap.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const DOMAIN = 'https://docs.agent-corex.com'

interface NavGroup {
  group: string
  pages: string[]
}

interface MintConfig {
  navigation: NavGroup[]
}

function generateSitemap() {
  try {
    // Read mint.json
    const mintPath = path.join(__dirname, '../mint.json')
    const mintConfig: MintConfig = JSON.parse(fs.readFileSync(mintPath, 'utf-8'))

    const urls: string[] = [
      `${DOMAIN}/`,
      `${DOMAIN}/api-reference`,
      `${DOMAIN}/guides`,
      `${DOMAIN}/examples`,
    ]

    // Extract all pages from navigation
    if (mintConfig.navigation && Array.isArray(mintConfig.navigation)) {
      for (const group of mintConfig.navigation) {
        if (group.pages && Array.isArray(group.pages)) {
          for (const page of group.pages) {
            // Handle nested pages (group/page format)
            urls.push(`${DOMAIN}/${page}`)
          }
        }
      }
    }

    // Generate sitemap XML
    const lastMod = new Date().toISOString().split('T')[0]
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === DOMAIN ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    // Write to public/sitemap.xml
    const outputPath = path.join(__dirname, '../public/sitemap.xml')
    fs.writeFileSync(outputPath, sitemapContent, 'utf-8')

    console.log(`[Sitemap] Generated ${urls.length} URLs`)
    console.log(`[Sitemap] Written to ${outputPath}`)
  } catch (err) {
    console.error('[Sitemap] Error:', err)
    process.exit(1)
  }
}

generateSitemap()
