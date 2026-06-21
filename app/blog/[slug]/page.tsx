import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/article/ArticleLayout';
import { buildArticleMetadata } from '@/content/metadata';
import { getBlogPosts, getBlogPostBySlug } from '@/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return post ? buildArticleMetadata(post) : {};
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  return <ArticleLayout post={post} />;
}
