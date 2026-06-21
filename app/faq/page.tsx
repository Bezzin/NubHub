import type { Metadata } from 'next';
import ArticleLayout from '@/components/article/ArticleLayout';
import { buildArticleMetadata } from '@/content/metadata';
import { faqPage } from '@/content/posts/faq';

export const metadata: Metadata = buildArticleMetadata(faqPage);

export default function FaqPage() {
  return <ArticleLayout post={faqPage} />;
}
