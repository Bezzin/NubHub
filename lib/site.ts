/**
 * Central site configuration and brand facts.
 *
 * Single source of truth for SEO metadata, structured data, and CTAs so every
 * page stays consistent. Update brand claims here, not in individual pages.
 */

export const SITE_URL = 'https://nubhub.baby';
export const SITE_NAME = 'NubHub';

export const SITE_TAGLINE =
  'AI + expert-reviewed nub theory gender prediction from your 12-week scan';

export const SITE_DESCRIPTION =
  "Know your baby's gender at 12 weeks with AI-powered, expert-reviewed nub theory prediction. Results in 2 hours, with a money-back guarantee if wrong.";

/** Public-facing brand stats. Keep these consistent across the whole site. */
export const BRAND = {
  accuracy: 'up to 94%',
  turnaround: '2 hours',
  reviewer: "obstetric & maternity professional, 20 years' experience",
  guarantee: '100% money-back guarantee',
} as const;

/** Single prediction offer. */
export const PRICE = {
  amount: '9.97',
  currency: 'GBP',
  symbol: '£',
} as const;

/** Real, monitored support inbox. */
export const SUPPORT_EMAIL = 'support@nubpredictor.com';

/**
 * Content attribution. Articles are attributed to the editorial team rather
 * than individual personas to avoid asserting unverified credentials in
 * structured data. The reviewer is a real obstetric & maternity professional
 * shown by first name + photo only, at her request — she works with us
 * independently, so her full registration is withheld to avoid a conflict of
 * interest with her primary role.
 */
export const EDITORIAL = {
  author: {
    name: 'The NubHub Editorial Team',
    url: `${SITE_URL}/about`,
  },
  reviewer: {
    name: 'Ivy',
    role: 'obstetric & maternity professional',
    experience: "20 years' experience",
    image: '/team/ivy.jpg',
    bio: "Ivy is an obstetric and maternity professional with 20 years' experience who reviews every NubHub prediction before it reaches you.",
    url: `${SITE_URL}/about`,
  },
} as const;

/** Organization logo / default social image (lives in /public). */
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/og-image.jpg`;

/** Verified external social profiles for Organization.sameAs. Add real URLs. */
export const SAME_AS: string[] = [];

export const ABSOLUTE = (path = '') =>
  path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
