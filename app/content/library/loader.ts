/**
 * Markdown content library loader.
 *
 * Reads `app/content/library/<pillar>/*.md` (YAML frontmatter + markdown body),
 * renders to HTML, extracts FAQ Q&A for schema, and applies two gates:
 *  - dedup: pages whose slug/title duplicate an existing TS `Post` are NOT routed
 *    (so we never compete with the hand-authored pages on the same domain).
 *  - quality: pages under the word threshold are flagged `thin` (noindexed + kept
 *    out of the sitemap until improved).
 *
 * Pure build-time filesystem read; the content is first-party (authored by us /
 * our generators), same trust model as the TS `Post` HTML, so it is rendered
 * with dangerouslySetInnerHTML downstream.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { allPosts } from '@/content';
import { PILLARS } from './pillars';

export interface LibraryFaq {
  question: string;
  answer: string;
}

export interface LibraryPage {
  pillar: string;
  slug: string;
  path: string;
  /** Visible H1 (markdown's first `# `, falling back to the frontmatter title). */
  title: string;
  /** <title> tag (frontmatter title, usually brand-suffixed). */
  metaTitle: string;
  description: string;
  keywords: string[];
  tags: string[];
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  bodyHtml: string;
  faq: LibraryFaq[];
  wordCount: number;
  /** Below the quality threshold — noindex + excluded from the sitemap. */
  thin: boolean;
  /** Duplicates an existing TS Post — excluded from routing entirely. */
  duplicate: boolean;
}

const THIN_WORD_THRESHOLD = 400;
const FALLBACK_DATE = '2026-06-22';
const LIBRARY_DIR = join(process.cwd(), 'content', 'library');

marked.setOptions({ gfm: true, breaks: false });

/** Convert `## Heading {#anchor}` to `<h2 id="anchor">Heading</h2>` so in-page TOC links resolve. */
function applyHeadingAnchors(md: string): string {
  return md.replace(
    /^(#{1,6})\s+(.+?)\s*\{#([A-Za-z0-9_-]+)\}\s*$/gm,
    (_full, hashes: string, text: string, id: string) =>
      `<h${hashes.length} id="${id}">${text.trim()}</h${hashes.length}>`,
  );
}

function stripBrand(t: string): string {
  return t.replace(/\s*\|\s*Nub Hub\s*$/i, '').trim();
}

function firstH1(md: string): string | null {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/\s*\{#[\w-]+\}\s*$/, '').trim() : null;
}

function countWords(md: string): number {
  return (md.replace(/```[\s\S]*?```/g, ' ').match(/\b[\w'-]+\b/g) || []).length;
}

function parseReadingMinutes(v: unknown, wordCount: number): number {
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return Math.max(1, Math.round(wordCount / 200));
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}

/** Pull Q&A out of the "Frequently Asked Questions" / "FAQ" section for FAQPage schema. */
function extractFaq(md: string): LibraryFaq[] {
  const lines = md.split('\n');
  const faqs: LibraryFaq[] = [];
  let inFaq = false;
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (question && answer.length) {
      const text = answer
        .join(' ')
        .replace(/[*_`>#[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) faqs.push({ question: question.replace(/\s*\{#[\w-]+\}\s*$/, '').trim(), answer: text });
    }
    question = null;
    answer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      if (/frequently asked|faq/i.test(h2[1])) {
        flush();
        inFaq = true;
      } else if (inFaq) {
        flush();
        inFaq = false;
      }
      continue;
    }
    if (!inFaq) continue;
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flush();
      question = h3[1].trim();
      continue;
    }
    if (question) answer.push(line.trim());
  }
  flush();
  return faqs;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const existingSlugs = new Set(allPosts.map((p) => p.slug.toLowerCase()));
const existingTitles = new Set(allPosts.map((p) => normalize(p.title)));

function isDuplicate(slug: string, title: string): boolean {
  return existingSlugs.has(slug.toLowerCase()) || existingTitles.has(normalize(title));
}

let cache: LibraryPage[] | null = null;

export function getAllLibraryPages(): LibraryPage[] {
  if (cache) return cache;
  const pages: LibraryPage[] = [];

  if (existsSync(LIBRARY_DIR)) {
    for (const pillar of PILLARS) {
      const dir = join(LIBRARY_DIR, pillar.slug);
      if (!existsSync(dir)) continue;

      const files = readdirSync(dir).filter(
        (f) => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('.'),
      );

      for (const file of files) {
        try {
          const { data, content } = matter(readFileSync(join(dir, file), 'utf8'));
          const fmSlug = typeof data.slug === 'string' ? data.slug : '';
          const leaf = (fmSlug.split('/').filter(Boolean).pop() || file.replace(/\.md$/, '')).toLowerCase();
          const metaTitle = typeof data.title === 'string' ? data.title : leaf;
          const title = firstH1(content) || stripBrand(metaTitle);
          const wordCount = countWords(content);
          const lastUpdated = typeof data.last_updated === 'string' && data.last_updated ? data.last_updated : FALLBACK_DATE;

          pages.push({
            pillar: pillar.slug,
            slug: leaf,
            path: `/${pillar.slug}/${leaf}`,
            title,
            metaTitle,
            description: typeof data.description === 'string' ? data.description : '',
            keywords: toStringArray(data.keywords),
            tags: toStringArray(data.tags),
            datePublished: lastUpdated,
            dateModified: lastUpdated,
            readingMinutes: parseReadingMinutes(data.reading_time, wordCount),
            bodyHtml: marked.parse(applyHeadingAnchors(content), { async: false }),
            faq: extractFaq(content),
            wordCount,
            thin: wordCount < THIN_WORD_THRESHOLD,
            duplicate: isDuplicate(leaf, title),
          });
        } catch {
          // Unparseable file — surfaced by scripts/audit-library.mjs, skipped here.
        }
      }
    }
  }

  cache = pages;
  return pages;
}

/** Pages that get a URL: everything except duplicates of existing TS posts. */
export function getRoutableLibraryPages(): LibraryPage[] {
  return getAllLibraryPages().filter((p) => !p.duplicate);
}

/** Pages eligible for the sitemap / indexing: routable, non-thin, with a description. */
export function getIndexableLibraryPages(): LibraryPage[] {
  return getRoutableLibraryPages().filter((p) => !p.thin && Boolean(p.description));
}

export function getLibraryPage(pillar: string, slug: string): LibraryPage | undefined {
  return getRoutableLibraryPages().find((p) => p.pillar === pillar && p.slug === slug);
}
