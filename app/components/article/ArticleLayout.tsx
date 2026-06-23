import Link from 'next/link';
import type { Post } from '@/content/types';
import { getPostBySlug } from '@/content';
import { EDITORIAL, SITE_URL, PRICE, ABSOLUTE } from '@/lib/site';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildBreadcrumbs(post: Post) {
  const crumbs: { name: string; path: string }[] = [{ name: 'Home', path: '/' }];
  if (post.collection === 'blog') crumbs.push({ name: 'Guides', path: '/blog' });
  crumbs.push({ name: post.title, path: post.path });
  return crumbs;
}

export default function ArticleLayout({ post }: { post: Post }) {
  const crumbs = buildBreadcrumbs(post);
  const canonical = `${SITE_URL}${post.path}`;
  const related = post.relatedSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => Boolean(p));

  const schema = [
    articleSchema({
      headline: post.title,
      description: post.description,
      url: canonical,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      authorName: EDITORIAL.author.name,
      authorUrl: EDITORIAL.author.url,
      reviewer: {
        name: EDITORIAL.reviewer.name,
        role: `${EDITORIAL.reviewer.role}, ${EDITORIAL.reviewer.experience}`,
        url: EDITORIAL.reviewer.url,
        image: ABSOLUTE(EDITORIAL.reviewer.image),
      },
    }),
    breadcrumbSchema(
      crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.path}` })),
    ),
    ...(post.faq.length ? [faqSchema(post.faq)] : []),
  ];

  const cta = post.cta ?? {
    heading: "Don't guess — let our AI read your nub",
    body: `Upload your 12-week scan: our AI reads the nub, then an obstetric & maternity professional with 20+ years' experience reviews it before your prediction lands — usually within 2 hours. ${PRICE.symbol}${PRICE.amount}, with a money-back guarantee if we're wrong.`,
  };

  return (
    <div className="article-page">
      <JsonLd data={schema} />
      <SiteHeader />

      <main className="article-shell">
        {/* Breadcrumbs */}
        <nav className="article-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.path} {...(last ? { 'aria-current': 'page' } : {})}>
                  {last ? c.name : <Link href={c.path}>{c.name}</Link>}
                  {!last && <span aria-hidden="true"> ›</span>}
                </li>
              );
            })}
          </ol>
        </nav>

        <article>
          <header>
            <span className="article-eyebrow">
              {post.heroEmoji && <span aria-hidden="true">{post.heroEmoji}</span>}
              {post.category}
            </span>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-lede" dangerouslySetInnerHTML={{ __html: post.intro }} />
            <div className="article-meta">
              <span>
                By <b>{EDITORIAL.author.name}</b>
              </span>
              <span>
                Reviewed by <b>{EDITORIAL.reviewer.name}</b> · {EDITORIAL.reviewer.role} ({EDITORIAL.reviewer.experience})
              </span>
              <span>
                Updated <b>{formatDate(post.dateModified)}</b>
              </span>
              <span>
                <b>{post.readingMinutes} min</b> read
              </span>
            </div>
          </header>

          {/* Key takeaways */}
          {post.keyTakeaways.length > 0 && (
            <aside className="article-takeaways" aria-label="Key takeaways">
              <h2>
                <span aria-hidden="true">✨</span> Key takeaways
              </h2>
              <ul>
                {post.keyTakeaways.map((k, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: k }} />
                ))}
              </ul>
            </aside>
          )}

          {/* Table of contents */}
          {post.sections.length > 2 && (
            <nav className="article-toc" aria-label="On this page">
              <h2>On this page</h2>
              <ol>
                {post.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Body */}
          <div className="article-prose">
            {post.sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}
          </div>

          {/* FAQ */}
          {post.faq.length > 0 && (
            <section className="article-faq" aria-label="Frequently asked questions">
              <h2>Frequently asked questions</h2>
              {post.faq.map((f, i) => (
                <details key={i}>
                  <summary>{f.question}</summary>
                  <p dangerouslySetInnerHTML={{ __html: f.answer }} />
                </details>
              ))}
            </section>
          )}

          {/* CTA */}
          <section className="article-cta">
            <h2>{cta.heading}</h2>
            <p>{cta.body}</p>
            <Link href="/#pricing" className="article-cta__btn">
              Get your prediction · {PRICE.symbol}{PRICE.amount}
            </Link>
            <small>
              Every scan reviewed by an obstetric &amp; maternity professional (20+ years)
              · Results in 2 hours · Money-back guarantee
            </small>
          </section>

          {/* References */}
          {post.citations && post.citations.length > 0 && (
            <section className="article-citations">
              <h2>References</h2>
              <ol>
                {post.citations.map((c, i) => (
                  <li key={i}>
                    <a href={c.url} target="_blank" rel="noopener nofollow">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section className="article-related">
              <h2>Keep reading</h2>
              <div className="article-related__grid">
                {related.map((r) => (
                  <Link key={r.slug} href={r.path} className="article-related__card">
                    <span>{r.category}</span>
                    <h3>{r.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* About the reviewer */}
          <aside className="article-reviewer" aria-label="About the reviewer">
            <img
              className="article-reviewer__photo"
              src={EDITORIAL.reviewer.image}
              alt={`${EDITORIAL.reviewer.name}, ${EDITORIAL.reviewer.role}`}
              width={76}
              height={76}
            />
            <div>
              <span className="article-reviewer__label">Reviewed by</span>
              <h3>{EDITORIAL.reviewer.name}</h3>
              <p className="article-reviewer__role">
                {EDITORIAL.reviewer.role} · {EDITORIAL.reviewer.experience}
              </p>
              <p>{EDITORIAL.reviewer.bio}</p>
            </div>
          </aside>

          {/* YMYL disclaimer */}
          <p className="article-disclaimer">
            <strong>Medical disclaimer:</strong> NubHub provides an early, for-entertainment
            estimate of fetal sex based on nub theory (the genital tubercle angle visible on a
            mid-sagittal ultrasound image, typically from 12–13 weeks). It is not a medical or
            diagnostic test and is not a substitute for professional prenatal care. Accuracy
            depends on image quality, gestational age, and fetal position. For confirmed results,
            speak to your healthcare provider — NIPT (cell-free DNA, from ~10 weeks) and the
            routine 20-week anatomy scan are the medically validated methods.
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
