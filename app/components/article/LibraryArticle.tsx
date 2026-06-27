import Link from 'next/link';
import type { LibraryPage } from '@/content/library/loader';
import { pillarLabel } from '@/content/library/pillars';
import { SITE_URL, EDITORIAL, ABSOLUTE } from '@/lib/site';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

/**
 * Renders a markdown-library page using the same clay chrome + JSON-LD builders
 * as the hand-authored ArticleLayout. The markdown body (including its own H1,
 * FAQ, related links and disclaimer) is rendered as trusted first-party HTML.
 * E-E-A-T is unified by attributing the schema to the canonical EDITORIAL
 * author + reviewer rather than the generic frontmatter string.
 */
export default function LibraryArticle({ page }: { page: LibraryPage }) {
  const canonical = `${SITE_URL}${page.path}`;

  const schema = [
    articleSchema({
      headline: page.title,
      description: page.description,
      url: canonical,
      datePublished: page.datePublished,
      dateModified: page.dateModified,
      authorName: EDITORIAL.author.name,
      authorUrl: EDITORIAL.author.url,
      reviewer: {
        name: EDITORIAL.reviewer.name,
        role: `${EDITORIAL.reviewer.role}, ${EDITORIAL.reviewer.experience}`,
        url: EDITORIAL.reviewer.url,
        image: ABSOLUTE(EDITORIAL.reviewer.image),
      },
    }),
    breadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: page.title, url: canonical },
    ]),
    ...(page.faq.length ? [faqSchema(page.faq)] : []),
  ];

  return (
    <div className="article-page library-article">
      <JsonLd data={schema} />
      <SiteHeader />

      <main className="article-shell">
        <nav className="article-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
              <span aria-hidden="true"> ›</span>
            </li>
            <li>
              <span>{pillarLabel(page.pillar)}</span>
              <span aria-hidden="true"> ›</span>
            </li>
            <li aria-current="page">{page.title}</li>
          </ol>
        </nav>

        <article
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
