/**
 * Audit related-article links in the markdown content library.
 *
 * Scans all *.md files, finds internal markdown links matching /pillar/slug,
 * and verifies each resolves to a file on disk.
 *
 * Run: node scripts/audit-related-links.mjs   (from app/)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');

const PILLARS = [
  'nub-theory', 'week-by-week', 'symptoms', 'scans-tests', 'nutrition',
  'mental-health', 'complications', 'lifestyle', 'relationships', 'baby-prep',
];

// Build a set of all slug keys present on disk, using frontmatter slug (like the loader does)
const onDisk = new Set();
for (const pillar of PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    let leaf;
    try {
      const { data } = matter(readFileSync(join(dir, f), 'utf8'));
      const fmSlug = typeof data.slug === 'string' ? data.slug : '';
      leaf = (fmSlug.split('/').filter(Boolean).pop() || f.replace(/\.md$/, '')).toLowerCase();
    } catch {
      leaf = f.replace(/\.md$/, '').toLowerCase();
    }
    onDisk.add(`${pillar}/${leaf}`);
  }
}

// Match markdown links of the form [text](/pillar/slug) or [text](/pillar/slug "title")
const INTERNAL_LINK_RE = /\[([^\]]*)\]\(\/([\w-]+)\/([\w-]+)(?:\s+"[^"]*")?\)/g;

const broken = [];
let checked = 0;

for (const pillar of PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const srcPath = join(dir, file);
    const rel = `${pillar}/${file}`;
    const content = readFileSync(srcPath, 'utf8');

    // Find "Related" sections and check links inside them.
    // Sections may start with a ## heading or bold text like **Related articles:**
    const lines = content.split('\n');
    let inRelated = false;

    for (const line of lines) {
      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        inRelated = /related|further reading|see also/i.test(h2[1]);
        continue;
      }
      // Detect bold related-article marker: **Related articles:** or **Related:**
      if (/^\*\*related/i.test(line.trim())) {
        inRelated = true;
        continue;
      }
      // Reset on next bold section header or empty line after links
      if (inRelated && /^\*\*[A-Z]/.test(line.trim()) && !/related/i.test(line)) {
        inRelated = false;
      }
      if (!inRelated) continue;

      INTERNAL_LINK_RE.lastIndex = 0;
      let m;
      while ((m = INTERNAL_LINK_RE.exec(line)) !== null) {
        const [, text, linkPillar, linkSlug] = m;
        if (!PILLARS.includes(linkPillar)) continue; // skip external/non-library links
        checked++;
        const key = `${linkPillar}/${linkSlug}`;
        if (!onDisk.has(key)) {
          broken.push({ src: rel, link: `/${linkPillar}/${linkSlug}`, text, srcPath });
        }
      }
    }
  }
}

if (broken.length === 0) {
  console.log(`\n✓ All ${checked} related-article links resolve correctly.\n`);
  process.exit(0);
} else {
  console.log(`\n=== Broken related-article links: ${broken.length} / ${checked} checked ===\n`);
  for (const b of broken) {
    console.log(`  SOURCE: ${b.src}`);
    console.log(`  LINK:   ${b.link}  (text: "${b.text}")`);
    console.log('');
  }
  process.exit(1);
}
