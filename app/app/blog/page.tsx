import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import JsonLd from '@/components/seo/JsonLd';
import { getPostBySlug } from '@/content';
import type { Post } from '@/content/types';
import { breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Nub Theory Guides & Early Gender Prediction Blog | NubHub',
  description:
    'Study-backed guides to nub theory, accuracy by week, boy vs girl nubs, and AI gender prediction — everything you need to read your 12-week scan with confidence.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

// Curated display order for the hub.
const order = [
  'nub-theory',
  'nub-theory-accuracy',
  'nub-theory-boy-vs-girl',
  'how-to-read-12-week-scan',
  'can-you-tell-gender-at-12-weeks',
  'nub-theory-vs-ramzi-vs-skull',
  'how-our-ai-works',
  'faq',
];

export default function BlogIndexPage() {
  const posts = order
    .map(getPostBySlug)
    .filter((p): p is Post => p !== undefined);

  return (
    <div className="article-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Guides', url: `${SITE_URL}/blog` },
        ])}
      />
      <SiteHeader />
      <main className="article-shell" style={{ maxWidth: '64rem' }}>
        <div className="bloglist-hero">
          <span className="article-eyebrow">
            <span aria-hidden="true">📚</span> Guides &amp; resources
          </span>
          <h1>Nub theory, explained properly</h1>
          <p>
            Honest, study-backed guides to early gender prediction — how nub theory works, how
            accurate it really is, and how to read your own 12-week scan.
          </p>
        </div>

        <div className="bloglist-grid">
          {posts.map((post) => (
            <Link key={post.slug} href={post.path} className="bloglist-card">
              <span className="bloglist-card__emoji" aria-hidden="true">
                {post.heroEmoji ?? '📝'}
              </span>
              <span className="bloglist-card__cat">{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="bloglist-card__more">Read more →</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
