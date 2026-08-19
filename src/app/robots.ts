import type { MetadataRoute } from 'next';

import { profile } from '@/data/profile';

/**
 * No disallow rules for anyone — including AI answer-engine crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — since being excluded
 * there is a direct GEO cost with no offsetting benefit for a portfolio site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
