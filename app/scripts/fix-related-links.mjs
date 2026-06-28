/**
 * Fix broken related-article links in the markdown library.
 * Run: node scripts/fix-related-links.mjs   (from app/)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');

const PILLARS = [
  'nub-theory', 'week-by-week', 'symptoms', 'scans-tests', 'nutrition',
  'mental-health', 'complications', 'lifestyle', 'relationships', 'baby-prep',
];

// Map broken slug → real slug (or null = remove the entire list item)
const REPLACEMENTS = {
  '/week-by-week/first-trimester-guide': null,
  '/nutrition/pregnancy-vitamins-supplements': '/nutrition/best-pregnancy-vitamins-uk-2025',
  '/lifestyle/medicines-in-pregnancy': null,
  '/symptoms/best-pregnancy-snacks-guide': '/nutrition/best-pregnancy-snacks-guide',
  '/nub-theory/nub-theory-explained': '/nub-theory/what-is-nub-theory',
  '/scans-tests/combined-screening-test': '/scans-tests/combined-screening-test-guide',
  '/nutrition/vegetarian-pregnancy-diet': '/nutrition/vegetarian-pregnancy-diet-complete-guide',
  '/nub-theory/old-wives-tales-gender': '/nub-theory/old-wives-tales-gender-complete-list',
  '/mental-health/early-pregnancy-loss-support': null,
  '/lifestyle/skin-changes-in-pregnancy': '/symptoms/skin-changes-early-pregnancy',
  '/lifestyle/exercise-during-pregnancy': '/lifestyle/exercise-pregnancy',
  '/symptoms/morning-sickness-hacks': '/symptoms/morning-sickness-complete-guide',
  '/symptoms/heartburn-early-pregnancy': null,
  '/symptoms/all-day-sickness': '/symptoms/morning-sickness-complete-guide',
  '/nutrition/vegan-pregnancy-diet': '/nutrition/vegan-pregnancy-diet-complete-guide',
  '/nutrition/salmonella-pregnancy': '/nutrition/salmonella-pregnancy-guide',
  '/nutrition/pregnancy-superfoods': null,
  '/nutrition/pregnancy-safe-herbal-teas': null,
  '/nutrition/listeria-pregnancy': '/nutrition/listeria-pregnancy-symptoms-prevention',
  '/nub-theory/nub-theory-girl-examples': '/nub-theory/nub-theory-photo-gallery-girl',
  '/complications/bleeding-in-early-pregnancy': '/complications/bleeding-at-12-weeks-pregnant',
  '/lifestyle/safe-food-pregnancy': null,
  '/nub-theory/gender-reveal-ideas': null,
  '/nub-theory/nub-theory-forked-vs-stacked': '/nub-theory/nub-theory-forked-vs-stacked-detailed',
  '/nub-theory/pregnancy-mental-health': null,
  '/nub-theory/ramzi-theory': '/nub-theory/ramzi-theory-explained',
  '/nub-theory/skin-changes-pregnancy': '/symptoms/skin-changes-early-pregnancy',
  '/nub-theory/what-is-angle-of-30-degrees': '/nub-theory/nub-theory-angle-explained',
  '/nub-theory/when-is-dating-scan-uk': null,
  '/nutrition/can-i-eat-prawns-pregnant': '/nutrition/can-i-eat-prawns-when-pregnant',
  '/nutrition/can-i-eat-sushi-pregnant': '/nutrition/can-i-eat-sushi-when-pregnant',
  '/nutrition/dairy-free-pregnancy-diet': '/nutrition/dairy-free-pregnancy-diet-guide',
};

// Regex to match any internal link with a broken slug
const LINK_RE = /\[([^\]]*)\]\((\/[\w-]+\/[\w-]+)\)/g;

let filesFixed = 0;
let replacements = 0;
let removals = 0;

for (const pillar of PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const srcPath = join(dir, file);
    const original = readFileSync(srcPath, 'utf8');
    const lines = original.split('\n');
    let changed = false;

    const fixed = lines
      .map((line) => {
        // Find any link in this line pointing to a broken target
        let hasBreaking = false;
        LINK_RE.lastIndex = 0;
        let m;
        while ((m = LINK_RE.exec(line)) !== null) {
          if (m[2] in REPLACEMENTS) {
            hasBreaking = true;
            break;
          }
        }
        if (!hasBreaking) return line;

        // Apply replacements and removals
        let newLine = line;
        for (const [broken, replacement] of Object.entries(REPLACEMENTS)) {
          if (!newLine.includes(broken)) continue;
          if (replacement === null) {
            // Remove the entire list-item line
            changed = true;
            removals++;
            return null; // will be filtered out
          } else {
            // Replace the URL
            newLine = newLine.replaceAll(broken, replacement);
            changed = true;
            replacements++;
          }
        }
        return newLine;
      })
      .filter((l) => l !== null);

    if (changed) {
      writeFileSync(srcPath, fixed.join('\n'), 'utf8');
      filesFixed++;
    }
  }
}

console.log(`\n✓ Fixed ${filesFixed} files: ${replacements} replacements, ${removals} line removals.\n`);
