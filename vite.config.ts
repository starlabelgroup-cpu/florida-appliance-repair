import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** The site's canonical origin — the sitemap lists exactly this one URL. */
export const SITE_URL = 'https://floridappliancerepair.com'

/**
 * Emits dist/sitemap.xml (the single canonical URL — this is a
 * one-page site) and dist/robots.txt at build time, so the SEO files
 * can never drift from the real canonical domain.
 */
function seoFiles(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-files',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `  <url><loc>${SITE_URL}/</loc></url>\n` +
        `</urlset>\n`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
      writeFileSync(
        resolve(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFiles()],
})
