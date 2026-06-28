/**
 * Add NHS / authority outbound citations to YMYL library pages.
 *
 * Rules:
 *  - Only adds links if the file has no existing nhs.uk / tommys.org / rcog.org.uk link.
 *  - Picks a verifiable, section-level URL based on topic keywords.
 *    NEVER fabricates deep paths — falls back to the pillar-level NHS URL when unsure.
 *  - Inserts a "Further reading" block directly before the --- disclaimer divider.
 *    If no divider exists, appends before the Related-articles block.
 *
 * Run: node scripts/add-ymyl-citations.mjs   (from app/)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'content', 'library');

const YMYL_PILLARS = ['complications', 'symptoms', 'scans-tests', 'mental-health'];

// Known-safe NHS condition paths (well-established, stable URLs)
const NHS_CONDITIONS = {
  miscarriage: 'https://www.nhs.uk/conditions/miscarriage/',
  'ectopic': 'https://www.nhs.uk/conditions/ectopic-pregnancy/',
  'gestational diabetes': 'https://www.nhs.uk/conditions/gestational-diabetes/',
  'pre-eclampsia': 'https://www.nhs.uk/conditions/pre-eclampsia/',
  'hyperemesis': 'https://www.nhs.uk/conditions/vomiting-and-morning-sickness/',
  'morning sickness': 'https://www.nhs.uk/conditions/vomiting-and-morning-sickness/',
  'placenta praevia': 'https://www.nhs.uk/conditions/placenta-praevia/',
  'placental abruption': 'https://www.nhs.uk/conditions/placental-abruption/',
  'obstetric cholestasis': 'https://www.nhs.uk/conditions/intrahepatic-cholestasis-of-pregnancy/',
  'intrahepatic cholestasis': 'https://www.nhs.uk/conditions/intrahepatic-cholestasis-of-pregnancy/',
  'group b strep': 'https://www.nhs.uk/conditions/group-b-streptococcus/',
  'group b streptococcus': 'https://www.nhs.uk/conditions/group-b-streptococcus/',
  'appendicitis': 'https://www.nhs.uk/conditions/appendicitis/',
  'blood clot': 'https://www.nhs.uk/conditions/blood-clots/',
  'dvt': 'https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/',
  'deep vein thrombosis': 'https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/',
  'anaemia': 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/',
  'anemia': 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/',
  'depression': 'https://www.nhs.uk/mental-health/conditions/depression/',
  'anxiety': 'https://www.nhs.uk/mental-health/conditions/anxiety/',
  'tokophobia': 'https://www.nhs.uk/mental-health/',
  'perinatal': 'https://www.nhs.uk/mental-health/',
  'postnatal': 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/postnatal-depression-and-perinatal-mental-health/',
};

// Pillar-level fallback URLs
const PILLAR_FALLBACK = {
  'complications': 'https://www.nhs.uk/pregnancy/related-conditions/',
  'symptoms': 'https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/',
  'scans-tests': 'https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/',
  'mental-health': 'https://www.nhs.uk/mental-health/',
};

// Secondary authority links by pillar
const SECONDARY_LINKS = {
  'complications': { url: 'https://www.tommys.org/', label: "Tommy's — pregnancy complications support and research" },
  'mental-health': { url: 'https://www.tommys.org/', label: "Tommy's — mental health in pregnancy" },
  'scans-tests': null,
  'symptoms': null,
};

function findNhsUrl(pillar, text) {
  const lower = text.toLowerCase();
  for (const [keyword, url] of Object.entries(NHS_CONDITIONS)) {
    if (lower.includes(keyword)) return url;
  }
  return PILLAR_FALLBACK[pillar];
}

function alreadyHasCitation(content) {
  return (
    content.includes('nhs.uk') ||
    content.includes('tommys.org') ||
    content.includes('rcog.org.uk')
  );
}

function buildFurtherReading(pillar, nhsUrl, nhsLabel, secondary) {
  const lines = ['\n**Further reading:**'];
  lines.push(`- [${nhsLabel}](${nhsUrl})`);
  if (secondary) lines.push(`- [${secondary.label}](${secondary.url})`);
  return lines.join('\n') + '\n';
}

function getLinkLabel(nhsUrl) {
  if (nhsUrl.includes('/conditions/miscarriage')) return 'NHS — Miscarriage';
  if (nhsUrl.includes('/conditions/ectopic')) return 'NHS — Ectopic pregnancy';
  if (nhsUrl.includes('/conditions/gestational-diabetes')) return 'NHS — Gestational diabetes';
  if (nhsUrl.includes('/conditions/pre-eclampsia')) return 'NHS — Pre-eclampsia';
  if (nhsUrl.includes('/conditions/vomiting')) return 'NHS — Vomiting and morning sickness in pregnancy';
  if (nhsUrl.includes('/conditions/placenta-praevia')) return 'NHS — Placenta praevia';
  if (nhsUrl.includes('/conditions/placental-abruption')) return 'NHS — Placental abruption';
  if (nhsUrl.includes('/conditions/intrahepatic-cholestasis')) return 'NHS — Intrahepatic cholestasis of pregnancy';
  if (nhsUrl.includes('/conditions/group-b-strep')) return 'NHS — Group B streptococcus';
  if (nhsUrl.includes('/conditions/appendicitis')) return 'NHS — Appendicitis';
  if (nhsUrl.includes('/conditions/blood-clots')) return 'NHS — Blood clots';
  if (nhsUrl.includes('/conditions/deep-vein')) return 'NHS — Deep vein thrombosis (DVT)';
  if (nhsUrl.includes('/conditions/iron-deficiency')) return 'NHS — Iron deficiency anaemia';
  if (nhsUrl.includes('/mental-health/conditions/depression')) return 'NHS — Depression';
  if (nhsUrl.includes('/mental-health/conditions/anxiety')) return 'NHS — Anxiety';
  if (nhsUrl.includes('/mental-health/feelings') || nhsUrl.includes('/mental-health/')) return 'NHS — Mental health in pregnancy';
  if (nhsUrl.includes('/pregnancy/related-conditions/common-symptoms')) return 'NHS — Common pregnancy symptoms';
  if (nhsUrl.includes('/pregnancy/related-conditions')) return 'NHS — Pregnancy complications and conditions';
  if (nhsUrl.includes('/pregnancy/your-pregnancy-care')) return 'NHS — Antenatal care and screening';
  return 'NHS — Pregnancy guidance';
}

function findBodyStart(content) {
  // Skip past the frontmatter block (--- ... ---).
  // The file starts with ---, find the closing ---.
  if (!content.startsWith('---')) return 0;
  const afterOpen = content.indexOf('\n', 3); // end of opening --- line
  if (afterOpen === -1) return 0;
  const closeIdx = content.indexOf('\n---', afterOpen);
  if (closeIdx === -1) return 0;
  return closeIdx + 4; // position after closing ---\n
}

function insertCitation(content, citation) {
  const bodyStart = findBodyStart(content);
  const body = content.slice(bodyStart);

  // Insert before the --- disclaimer divider in the body
  const dividerIdx = body.lastIndexOf('\n---\n');
  if (dividerIdx !== -1) {
    const insertPos = bodyStart + dividerIdx;
    return content.slice(0, insertPos) + '\n' + citation + content.slice(insertPos);
  }
  // Fallback: insert before **Related articles:** block
  const relatedIdx = body.lastIndexOf('\n**Related articles:**');
  if (relatedIdx !== -1) {
    const insertPos = bodyStart + relatedIdx;
    return content.slice(0, insertPos) + '\n' + citation + content.slice(insertPos);
  }
  // Last resort: append at end
  return content.trimEnd() + '\n\n' + citation + '\n';
}

let added = 0;
let skipped = 0;

for (const pillar of YMYL_PILLARS) {
  const dir = join(LIB, pillar);
  if (!existsSync(dir)) continue;

  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));

  for (const file of files) {
    const srcPath = join(dir, file);
    const content = readFileSync(srcPath, 'utf8');

    if (alreadyHasCitation(content)) {
      skipped++;
      continue;
    }

    // Extract title + description for keyword matching
    const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    const descMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    const searchText = [titleMatch?.[1] || '', descMatch?.[1] || ''].join(' ');

    const nhsUrl = findNhsUrl(pillar, searchText);
    const nhsLabel = getLinkLabel(nhsUrl);
    const secondary = SECONDARY_LINKS[pillar] || null;

    const citation = buildFurtherReading(pillar, nhsUrl, nhsLabel, secondary);
    const updated = insertCitation(content, citation);

    writeFileSync(srcPath, updated, 'utf8');
    added++;
  }
}

console.log(`\n✓ Citations added to ${added} files. ${skipped} already had authority links.\n`);
