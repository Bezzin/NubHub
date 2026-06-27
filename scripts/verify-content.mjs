/**
 * Content integrity linter for app/content/posts.
 *
 * Catches the classes of problem that silently break SEO:
 *  - orphaned post files (on disk but never imported into index.ts → 404-invisible)
 *  - duplicate slugs, slug↔path mismatches
 *  - meta title / description outside SEO length budgets
 *  - relatedSlugs and in-body internal links that point at nonexistent pages
 *
 * Pure text analysis (no compile step). Run: `node scripts/verify-content.mjs`
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '..', 'content', 'posts');
const indexFile = join(__dirname, '..', 'content', 'index.ts');

/** Public, linkable non-post routes (from app/app/**\/page.tsx). */
const STATIC_ROUTES = new Set([
  '/', '/about', '/contact', '/privacy', '/terms', '/refund',
  '/upload', '/blog', '/checkout',
]);

/** Extract a single quoted string field, honoring \\-escapes. */
function field(src, name) {
  const m = src.match(new RegExp(`\\b${name}:\\s*`));
  if (!m) return null;
  let i = m.index + m[0].length;
  const q = src[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  i++;
  let out = '';
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { out += src[i + 1]; i += 2; continue; }
    if (c === q) break;
    out += c; i++;
  }
  return out;
}

function arrayField(src, name) {
  const m = src.match(new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.ts'));
const indexSrc = readFileSync(indexFile, 'utf8');

const posts = files.map((f) => {
  const src = readFileSync(join(postsDir, f), 'utf8');
  const ex = src.match(/export const (\w+)\s*:\s*Post/);
  return {
    file: f,
    exportName: ex ? ex[1] : null,
    slug: field(src, 'slug'),
    path: field(src, 'path'),
    collection: field(src, 'collection'),
    metaTitle: field(src, 'metaTitle'),
    description: field(src, 'description'),
    relatedSlugs: arrayField(src, 'relatedSlugs'),
    hrefs: [...src.matchAll(/href=["']([^"']+)["']/g)].map((x) => x[1]),
  };
});

const slugSet = new Set(posts.map((p) => p.slug));
const pathSet = new Set(posts.map((p) => p.path));
const validInternal = new Set([...STATIC_ROUTES, ...pathSet]);

const issues = [];
const add = (sev, file, msg) => issues.push({ sev, file, msg });
const isRegistered = (p) =>
  p.exportName && new RegExp(`\\b${p.exportName}\\b`).test(indexSrc);

for (const p of posts) {
  if (!p.exportName) { add('ERROR', p.file, 'no `export const X: Post` found'); continue; }
  if (!isRegistered(p)) add('ERROR', p.file, `export "${p.exportName}" is NOT registered in index.ts (orphaned page)`);
}

const seen = {};
for (const p of posts) {
  if (!p.slug) { add('ERROR', p.file, 'missing slug'); continue; }
  if (seen[p.slug]) add('ERROR', p.file, `duplicate slug "${p.slug}" (also in ${seen[p.slug]})`);
  seen[p.slug] = p.file;
}

for (const p of posts) {
  if (!p.path || !p.slug) continue;
  const expected = p.collection === 'blog' ? `/blog/${p.slug}` : `/${p.slug}`;
  if (p.path !== expected) add('WARN', p.file, `path "${p.path}" != expected "${expected}" (collection ${p.collection})`);
}

for (const p of posts) {
  if (p.metaTitle && p.metaTitle.length > 60) add('WARN', p.file, `metaTitle ${p.metaTitle.length} chars >60: "${p.metaTitle}"`);
  if (!p.description) { add('ERROR', p.file, 'missing description'); continue; }
  const n = p.description.length;
  if (n < 120 || n > 165) add('WARN', p.file, `description ${n} chars (ideal 150-160)`);
}

for (const p of posts) {
  for (const rs of p.relatedSlugs) {
    if (!slugSet.has(rs)) add('WARN', p.file, `relatedSlug "${rs}" resolves to nothing`);
  }
  for (const h of p.hrefs) {
    if (/^(https?:|mailto:)/i.test(h) || h.startsWith('#')) continue;
    const clean = h.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (!validInternal.has(clean)) add('WARN', p.file, `internal link "${h}" -> "${clean}" is not a known page`);
  }
}

const errors = issues.filter((i) => i.sev === 'ERROR');
const warns = issues.filter((i) => i.sev === 'WARN');
console.log(`\n=== Content verification: ${posts.length} files, ${slugSet.size} unique slugs ===`);
console.log(`Registered in index.ts: ${posts.filter(isRegistered).length}/${posts.length}`);
console.log(`Blog: ${posts.filter((p) => p.collection === 'blog').length} | pillar: ${posts.filter((p) => p.collection === 'pillar').length} | page: ${posts.filter((p) => p.collection === 'page').length}`);
console.log(`\nERRORS: ${errors.length}`);
for (const e of errors) console.log(`  [${e.file}] ${e.msg}`);
console.log(`\nWARNINGS: ${warns.length}`);
for (const w of warns) console.log(`  [${w.file}] ${w.msg}`);
console.log('');
process.exit(errors.length ? 1 : 0);
