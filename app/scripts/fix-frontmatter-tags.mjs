/**
 * Fix slug-like tags and keywords in frontmatter.
 * Replaces title-as-slug entries with 2-4 clean human-readable topic labels.
 * Run: node scripts/fix-frontmatter-tags.mjs   (from app/)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');

const FIXES = [
  {
    file: 'scans-tests/12-week-scan-guide.md',
    tags: ['12 week scan', 'dating scan', 'pregnancy scans', 'nub theory'],
    keywords: ['12 week scan', 'dating scan', 'what to expect at 12 week scan', 'nub theory scan tips'],
  },
  {
    file: 'scans-tests/booking-appointment-guide.md',
    tags: ['booking appointment', 'first midwife visit', 'antenatal care'],
    keywords: ['booking appointment pregnancy', 'first midwife appointment', 'antenatal appointment 8 weeks'],
  },
  {
    file: 'scans-tests/nipt-blood-test-guide.md',
    tags: ['NIPT blood test', 'prenatal testing', 'non-invasive screening'],
    keywords: ['NIPT test UK', 'non-invasive prenatal testing', 'prenatal screening accuracy'],
  },
  {
    file: 'scans-tests/nt-scan-explained.md',
    tags: ['NT scan', 'nuchal translucency', '12 week screening'],
    keywords: ['NT scan normal range', 'nuchal translucency measurement', '12 week screening test'],
  },
  {
    file: 'scans-tests/what-to-do-when-you-find-out-pregnant.md',
    tags: ['early pregnancy', 'first steps pregnant', 'pregnancy checklist'],
    keywords: ['what to do when pregnant', 'first steps in pregnancy', 'early pregnancy checklist'],
  },
  {
    file: 'scans-tests/12-week-scan-children-allowed.md',
    keywords: ['12 week scan children policy', 'siblings at ultrasound', 'NHS scan visitor rules', 'private scan children'],
  },
  {
    file: 'complications/ectopic-pregnancy.md',
    tags: ['ectopic pregnancy', 'complications', 'pregnancy emergency'],
    keywords: ['ectopic pregnancy symptoms', 'ectopic pregnancy treatment', 'early pregnancy emergency'],
  },
  {
    file: 'complications/miscarriage-complete-guide.md',
    tags: ['miscarriage', 'early pregnancy loss', 'pregnancy complications'],
    keywords: ['miscarriage symptoms', 'miscarriage causes', 'miscarriage support UK'],
  },
  {
    file: 'complications/when-to-call-111-pregnancy.md',
    tags: ['pregnancy warning signs', 'call 111 pregnancy', 'pregnancy emergencies'],
    keywords: ['pregnancy red flags', 'when to call 111 pregnant', 'pregnancy emergency symptoms'],
  },
  {
    file: 'lifestyle/exercise-pregnancy.md',
    tags: ['exercise in pregnancy', 'pregnancy fitness', 'first trimester exercise'],
    keywords: ['safe exercise pregnancy', 'pregnancy workout', 'NHS exercise guidelines pregnancy'],
  },
  {
    file: 'lifestyle/maternity-pay-uk.md',
    tags: ['maternity pay', 'statutory maternity pay', 'maternity allowance'],
    keywords: ['maternity pay UK', 'SMP calculator', 'maternity allowance how to claim'],
  },
  {
    file: 'lifestyle/pregnancy-rights-work-uk.md',
    tags: ['pregnancy rights', 'maternity rights', 'employment rights pregnancy'],
    keywords: ['pregnancy rights at work UK', 'maternity discrimination', 'pregnant employee rights'],
  },
];

function yamlArray(arr) {
  return `[${arr.map((v) => `"${v}"`).join(', ')}]`;
}

let fixed = 0;

for (const fix of FIXES) {
  const path = join(LIB, fix.file);
  let content;
  try {
    content = readFileSync(path, 'utf8');
  } catch {
    console.warn(`  SKIP (not found): ${fix.file}`);
    continue;
  }

  let updated = content;

  if (fix.tags) {
    // Replace the entire tags line (handles both single-quoted and double-quoted YAML arrays)
    updated = updated.replace(/^tags:.*$/m, `tags: ${yamlArray(fix.tags)}`);
  }

  if (fix.keywords) {
    // For 12-week-scan-children-allowed, keywords is a plain string; replace that too
    updated = updated.replace(/^keywords:.*$/m, `keywords: ${yamlArray(fix.keywords)}`);
  }

  if (updated !== content) {
    writeFileSync(path, updated, 'utf8');
    fixed++;
    console.log(`  ✓ ${fix.file}`);
  } else {
    console.warn(`  NO CHANGE: ${fix.file}`);
  }
}

console.log(`\n✓ Fixed ${fixed} files.\n`);
