import type { Metadata } from 'next';
import ArticleLayout from '@/components/article/ArticleLayout';
import { buildArticleMetadata } from '@/content/metadata';
import { nubTheory } from '@/content/posts/nub-theory';

export const metadata: Metadata = buildArticleMetadata(nubTheory);

export default function NubTheoryPage() {
  return <ArticleLayout post={nubTheory} />;
}
