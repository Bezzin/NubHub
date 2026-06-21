import type { Metadata } from 'next';
import ArticleLayout from '@/components/article/ArticleLayout';
import { buildArticleMetadata } from '@/content/metadata';
import { howOurAiWorks } from '@/content/posts/how-our-ai-works';

export const metadata: Metadata = buildArticleMetadata(howOurAiWorks);

export default function HowOurAiWorksPage() {
  return <ArticleLayout post={howOurAiWorks} />;
}
