import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';
import { getRoutableLibraryPages } from '@/content/library/loader';
import { PILLARS, pillarLabel } from '@/content/library/pillars';

const HUB_PILLARS = PILLARS.filter((p) => p.slug !== 'nub-theory');

export const dynamicParams = false;

export function generateStaticParams() {
  return HUB_PILLARS.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar } = await params;
  const label = pillarLabel(pillar);
  const url = `${SITE_URL}/${pillar}`;
  return {
    title: `${label} | NubHub`,
    description: `Browse all NubHub pregnancy guides on ${label.toLowerCase()} — expert-reviewed articles to help you through every stage.`,
    alternates: { canonical: url },
  };
}

export default async function PillarHubPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar } = await params;
  if (!HUB_PILLARS.some((p) => p.slug === pillar)) notFound();

  const label = pillarLabel(pillar);
  const pages = getRoutableLibraryPages().filter((p) => p.pillar === pillar);
  const canonical = `${SITE_URL}/${pillar}`;

  const schema = breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: label, url: canonical },
  ]);

  return (
    <div className="article-page">
      <JsonLd data={[schema]} />
      <SiteHeader />

      <main className="article-shell pillar-hub">
        <nav className="article-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
              <span aria-hidden="true"> ›</span>
            </li>
            <li aria-current="page">{label}</li>
          </ol>
        </nav>

        <h1 className="article-title">{label}</h1>
        <p className="article-lede">
          Expert-reviewed guides on {label.toLowerCase()} during pregnancy — clear, UK-focused answers for every stage.
        </p>

        <div className="pillar-hub__grid">
          {pages.map((page) => (
            <Link key={page.slug} href={page.path} className="pillar-hub__card">
              <h2 className="pillar-hub__card-title">{page.title}</h2>
              {page.description && (
                <p className="pillar-hub__card-desc">{page.description}</p>
              )}
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
