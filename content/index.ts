import type { Post } from './types';

// Pillar
import { nubTheory } from './posts/nub-theory';

// Standalone pages
import { howOurAiWorks } from './posts/how-our-ai-works';
import { faqPage } from './posts/faq';

// Blog — nub theory core
import { nubTheoryAccuracy } from './posts/nub-theory-accuracy';
import { nubTheoryBoyVsGirl } from './posts/nub-theory-boy-vs-girl';
import { nubTheoryStackingSign } from './posts/nub-theory-stacking-sign-explained';
import { nubTheoryAt11Weeks } from './posts/nub-theory-at-11-weeks';
import { nubTheoryAt13Weeks } from './posts/nub-theory-at-13-weeks';
import { bestWeekForNubTheory } from './posts/best-week-for-nub-theory';
import { nubTheoryMistakes } from './posts/nub-theory-mistakes';
import { nubTheoryMythsDebunked } from './posts/nub-theory-myths-debunked';
import { nubTheoryTwins } from './posts/nub-theory-twins';
import { howToRead12WeekScan } from './posts/how-to-read-12-week-scan';
import { canYouTellGenderAt12Weeks } from './posts/can-you-tell-gender-at-12-weeks';

// Blog — competing methods & comparisons
import { nubTheoryVsRamziVsSkull } from './posts/nub-theory-vs-ramzi-vs-skull';
import { ramziTheoryExplained } from './posts/ramzi-theory-explained';
import { skullTheoryExplained } from './posts/skull-theory-explained';
import { niptVsNubTheory } from './posts/nipt-vs-nub-theory';
import { niptBloodTestGender } from './posts/nipt-blood-test-gender';
import { sneakpeekBloodTest } from './posts/sneakpeek-blood-test';
import { chineseGenderPredictor } from './posts/chinese-gender-predictor';
import { oldWivesTalesGender } from './posts/old-wives-tales-gender';
import { genderPredictionHeartRate } from './posts/gender-prediction-heart-rate';
import { morningSicknessAndGender } from './posts/morning-sickness-and-gender';
import { whenCanYouFindOutBabySex } from './posts/when-can-you-find-out-baby-sex';

// Blog — experience & planning
import { genderRevealIdeas } from './posts/gender-reveal-ideas-after-your-prediction';
import { genderDisappointment } from './posts/gender-disappointment';
import { teamGreenNotFindingOut } from './posts/team-green-not-finding-out';

/**
 * Central content registry. Add a post's import here and it automatically flows
 * into routing, the blog index, the sitemap, and related-post resolution.
 */
export const allPosts: Post[] = [
  // Pillar
  nubTheory,

  // Pages
  howOurAiWorks,
  faqPage,

  // Blog — nub theory core
  nubTheoryAccuracy,
  nubTheoryBoyVsGirl,
  nubTheoryStackingSign,
  nubTheoryAt11Weeks,
  nubTheoryAt13Weeks,
  bestWeekForNubTheory,
  nubTheoryMistakes,
  nubTheoryMythsDebunked,
  nubTheoryTwins,
  howToRead12WeekScan,
  canYouTellGenderAt12Weeks,

  // Blog — competing methods & comparisons
  nubTheoryVsRamziVsSkull,
  ramziTheoryExplained,
  skullTheoryExplained,
  niptVsNubTheory,
  niptBloodTestGender,
  sneakpeekBloodTest,
  chineseGenderPredictor,
  oldWivesTalesGender,
  genderPredictionHeartRate,
  morningSicknessAndGender,
  whenCanYouFindOutBabySex,

  // Blog — experience & planning
  genderRevealIdeas,
  genderDisappointment,
  teamGreenNotFindingOut,
];

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/** Posts that live under /blog/[slug]. */
export function getBlogPosts(): Post[] {
  return allPosts
    .filter((p) => p.collection === 'blog')
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.collection === 'blog' && p.slug === slug);
}
