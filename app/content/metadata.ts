import type { Metadata } from 'next';
import type { Post } from './types';
import { SITE_URL, OG_IMAGE } from '@/lib/site';

/** Build Next.js page metadata from a post (canonical, OG, Twitter). */
export function buildArticleMetadata(post: Post): Metadata {
  const url = `${SITE_URL}${post.path}`;
  return {
    title: post.metaTitle,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.description,
      images: [OG_IMAGE],
    },
  };
}
