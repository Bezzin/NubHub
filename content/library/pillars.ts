/**
 * Pillar definitions for the additive markdown content library.
 *
 * The library lives at `app/content/library/<pillar>/*.md` and is rendered by the
 * `/[pillar]/[slug]` route — completely separate from the hand-authored TS `Post`
 * engine in `app/content`. Drop a pillar folder of markdown files here and it
 * flows into routing + the sitemap automatically (after the dedup/quality gate).
 */

export interface Pillar {
  slug: string;
  label: string;
}

export const PILLARS: readonly Pillar[] = [
  { slug: 'nub-theory', label: 'Nub Theory' },
  { slug: 'week-by-week', label: 'Week by Week' },
  { slug: 'symptoms', label: 'Symptoms & Body Changes' },
  { slug: 'scans-tests', label: 'Scans & Tests' },
  { slug: 'nutrition', label: 'Nutrition & Diet' },
  { slug: 'mental-health', label: 'Mental Health' },
  { slug: 'complications', label: 'Complications & Warning Signs' },
  { slug: 'lifestyle', label: 'Lifestyle & Work' },
  { slug: 'relationships', label: 'Relationships' },
  { slug: 'baby-prep', label: 'Baby Preparation' },
] as const;

export const PILLAR_SLUGS: ReadonlySet<string> = new Set(PILLARS.map((p) => p.slug));

export function pillarLabel(slug: string): string {
  return PILLARS.find((p) => p.slug === slug)?.label ?? slug;
}
