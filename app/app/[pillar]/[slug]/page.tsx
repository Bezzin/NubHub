import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LibraryArticle from '@/components/article/LibraryArticle';
import { getRoutableLibraryPages, getLibraryPage } from '@/content/library/loader';
import { SITE_URL, OG_IMAGE } from '@/lib/site';

/**
 * Additive markdown-library route: /[pillar]/[slug].
 * Static segments (/about, /blog, /faq, …) take priority, so this only catches
 * two-segment library paths. dynamicParams=false → only generated pages exist;
 * duplicates of TS posts are excluded by getRoutableLibraryPages().
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutableLibraryPages().map((p) => ({ pillar: p.pillar, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}): Promise<Metadata> {
  const { pillar, slug } = await params;
  const page = getLibraryPage(pillar, slug);
  if (!page) return {};

  const url = `${SITE_URL}${page.path}`;
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    // Thin pages stay out of the index until improved (kept crawlable for links).
    robots: page.thin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url,
      type: 'article',
      publishedTime: page.datePublished,
      modifiedTime: page.dateModified,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function LibraryPageRoute({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}) {
  const { pillar, slug } = await params;
  const page = getLibraryPage(pillar, slug);
  if (!page) notFound();
  return <LibraryArticle page={page} />;
}
