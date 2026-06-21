import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const page = readFileSync(resolve(root, 'app/page.tsx'), 'utf8');
const css = readFileSync(resolve(root, 'app/globals.css'), 'utf8');

const requirements = [
  {
    name: 'hero uses the new editorial pregnancy headline',
    pass: page.includes('Know sooner. Prepare beautifully.'),
  },
  {
    name: 'hero includes the pastel sonogram art direction hooks',
    pass: page.includes('sonogram-hero') && css.includes('.sonogram-hero'),
  },
  {
    name: 'process rail includes the four expected product steps',
    pass:
      page.includes('Upload scan') &&
      page.includes('AI reads the nub angle') &&
      page.includes('Expert review') &&
      page.includes('Private result'),
  },
  {
    name: 'homepage includes the pastel pregnancy visual token set',
    pass:
      css.includes('--pastel-blush') &&
      css.includes('--pastel-lavender') &&
      css.includes('--pastel-mint') &&
      css.includes('--pastel-plum'),
  },
  {
    name: 'accuracy section includes a bespoke scan-grid proof artifact',
    pass: page.includes('accuracy-board') && css.includes('.accuracy-board'),
  },
  {
    name: 'hero no longer uses the old centered template headline',
    pass: !page.includes('Discover Your Baby&apos;s Gender'),
  },
];

const failures = requirements.filter((requirement) => !requirement.pass);

if (failures.length > 0) {
  console.error('Landing design smoke check failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log('Landing design smoke check passed.');
