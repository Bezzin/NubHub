import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * NubHub wants maximum visibility AND citation in AI answer engines, so we allow
 * the standard search crawlers plus the AI search/citation bots, and only block
 * private app surfaces. (Allowing AI search bots is what makes the site eligible
 * to be cited in ChatGPT Search, Perplexity, and Claude answers.)
 */
const disallow = ['/admin/', '/api/', '/result/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      {
        userAgent: [
          'Googlebot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'Perplexity-User',
          'Claude-SearchBot',
          'Claude-User',
          'ClaudeBot',
          'Google-Extended',
        ],
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
