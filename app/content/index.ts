import type { Post } from './types';
import { nubTheory } from './posts/nub-theory';
import { nubTheoryAccuracy } from './posts/nub-theory-accuracy';
import { nubTheoryBoyVsGirl } from './posts/nub-theory-boy-vs-girl';
import { howToRead12WeekScan } from './posts/how-to-read-12-week-scan';
import { nubTheoryVsRamziVsSkull } from './posts/nub-theory-vs-ramzi-vs-skull';
import { canYouTellGenderAt12Weeks } from './posts/can-you-tell-gender-at-12-weeks';
import { howOurAiWorks } from './posts/how-our-ai-works';
import { faqPage } from './posts/faq';

/**
 * Central content registry. Add a post's import here and it automatically flows
 * into routing, the blog index, the sitemap, and related-post resolution.
 */
export const allPosts: Post[] = [
  nubTheory,
  nubTheoryAccuracy,
  nubTheoryBoyVsGirl,
  howToRead12WeekScan,
  nubTheoryVsRamziVsSkull,
  canYouTellGenderAt12Weeks,
  howOurAiWorks,
  faqPage,
];

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/** Posts that live under /blog/[slug]. */
export function getBlogPosts(): Post[] {
  return allPosts
    .filter((p) => p.collection === 'blog')
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.collection === 'blog' && p.slug === slug);
}
