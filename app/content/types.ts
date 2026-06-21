/**
 * Content model for NubHub's editorial pages (pillar guides, blog posts, and
 * content-style pages like the FAQ and AI explainer).
 *
 * Design goals:
 * - Answer-engine friendly: an answer-first `intro`, question-style section
 *   headings, a `keyTakeaways` summary box, and a structured `faq` list that
 *   powers both on-page Q&A and FAQPage JSON-LD.
 * - Centralized rendering: prose lives in trusted HTML strings (authored by us,
 *   never user input) so a single renderer controls design + schema.
 */

export interface FaqItem {
  question: string;
  /** Plain text or light inline HTML. Used for both on-page and FAQPage schema. */
  answer: string;
}

export interface ArticleSection {
  /** Anchor id for the table of contents (kebab-case). */
  id: string;
  /** Question-style H2 heading. */
  heading: string;
  /** Trusted HTML body: <p>, <ul>/<ol>, <table>, <blockquote>, etc. */
  html: string;
}

export interface Citation {
  label: string;
  url: string;
}

export type Collection = 'pillar' | 'blog' | 'page';

export interface Post {
  /** URL slug, e.g. 'nub-theory-accuracy'. */
  slug: string;
  /** Canonical path, e.g. '/nub-theory' or '/blog/nub-theory-accuracy'. */
  path: string;
  collection: Collection;

  /** Visible H1. */
  title: string;
  /** <title> tag (<= ~60 chars ideal). */
  metaTitle: string;
  /** Meta description (~150-160 chars). */
  description: string;
  /** Short summary for cards/listings. */
  excerpt: string;

  category: string;
  keywords: string[];

  /** ISO date strings (YYYY-MM-DD). */
  datePublished: string;
  dateModified: string;
  readingMinutes: number;

  /** Decorative emoji used in the hero/cards. */
  heroEmoji?: string;

  /** AEO summary box — 3-6 scannable, self-contained takeaways. */
  keyTakeaways: string[];

  /** Answer-first opening (HTML). Lead with a direct 40-60 word answer. */
  intro: string;

  sections: ArticleSection[];
  faq: FaqItem[];

  /** Outbound references (peer-reviewed studies, authorities) for E-E-A-T. */
  citations?: Citation[];

  /** Slugs of related posts for internal linking. */
  relatedSlugs: string[];

  /** Optional CTA override. */
  cta?: { heading: string; body: string };
}
