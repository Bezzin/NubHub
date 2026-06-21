/**
 * JSON-LD structured-data builders.
 *
 * Schema choices reflect 2026 reality (verified against Google's Search Gallery):
 * - Organization, WebSite, Article, BreadcrumbList, Product → still produce rich
 *   results and/or feed entity recognition. Implemented.
 * - FAQPage → no longer produces a Google rich result, but is still parsed by
 *   Google and is a primary Q&A extraction source for answer engines (ChatGPT,
 *   Perplexity, Gemini). Kept for AI citation value.
 * - HowTo, Speakable, SearchAction/Sitelinks-Searchbox → deprecated/removed. Skipped.
 *
 * We deliberately omit AggregateRating/Review until real, verifiable review data
 * is wired in — inventing ratings violates Google's policies and erodes trust.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  LOGO_URL,
  SAME_AS,
  PRICE,
  SUPPORT_EMAIL,
  OG_IMAGE,
} from './site';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 1200,
      height: 630,
    },
    image: OG_IMAGE,
    email: SUPPORT_EMAIL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SUPPORT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    image: opts.image ?? OG_IMAGE,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: opts.url,
    offers: {
      '@type': 'Offer',
      price: PRICE.amount,
      priceCurrency: PRICE.currency,
      availability: 'https://schema.org/InStock',
      url: opts.url,
      seller: { '@id': ORG_ID },
    },
    // NOTE: add aggregateRating/review here ONLY when backed by real, verifiable
    // review data (e.g. from the Telegram review pipeline).
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName: string;
  authorUrl?: string;
  reviewerName?: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: opts.image ?? OG_IMAGE,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Organization',
      name: opts.authorName,
      url: opts.authorUrl ?? SITE_URL,
    },
    ...(opts.reviewerName
      ? { reviewedBy: { '@type': 'Organization', name: opts.reviewerName } }
      : {}),
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    inLanguage: 'en',
  };
}
