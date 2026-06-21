import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { allPosts } from '@/content';

/**
 * Dynamic sitemap. Core static routes + every registered content page, so new
 * posts appear automatically. Private surfaces (/admin, /api, /result) are
 * excluded (and disallowed in robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString().split('T')[0];

  const staticRoutes = ['', '/about', '/contact', '/blog', '/privacy', '/terms', '/refund', '/upload'];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: p.dateModified,
    changeFrequency: 'monthly',
    priority: p.collection === 'pillar' ? 0.9 : 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
