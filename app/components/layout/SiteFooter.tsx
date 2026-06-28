import Link from 'next/link';
import { HeartMascot } from '@/components/marketing/ClayArt';
import { SUPPORT_EMAIL } from '@/lib/site';

/**
 * Shared clay-styled footer. Server component — provides sitewide internal
 * linking (crawl depth + topical authority) and the YMYL disclaimer.
 */
const columns = [
  {
    title: 'Pregnancy topics',
    links: [
      { href: '/week-by-week', label: 'Week by week' },
      { href: '/symptoms', label: 'Symptoms' },
      { href: '/scans-tests', label: 'Scans & tests' },
      { href: '/nutrition', label: 'Nutrition' },
      { href: '/mental-health', label: 'Mental health' },
      { href: '/complications', label: 'Complications' },
      { href: '/lifestyle', label: 'Lifestyle' },
      { href: '/relationships', label: 'Relationships' },
      { href: '/baby-prep', label: 'Baby prep' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/nub-theory', label: 'What is nub theory?' },
      { href: '/blog/nub-theory-accuracy', label: 'Nub theory accuracy' },
      { href: '/blog/nub-theory-boy-vs-girl', label: 'Boy vs girl nub' },
      { href: '/blog/how-to-read-12-week-scan', label: 'Read your 12-week scan' },
      { href: '/blog/nub-theory-vs-ramzi-vs-skull', label: 'Methods compared' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/blog', label: 'Blog' },
      { href: '/how-our-ai-works', label: 'How our AI works' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
      { href: '/refund', label: 'Refund policy' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="site-header__logo" aria-label="NubHub home" style={{ color: '#fff' }}>
            <HeartMascot />
            <span>NubHub</span>
          </Link>
          <p>
            AI + expert-reviewed nub theory gender prediction from your 12-week scan.
            An early, for-fun glimpse — results in 2 hours.
          </p>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__bottom">
        © {new Date().getFullYear()} NubHub. For entertainment purposes only — not medical advice
        or a diagnostic test. Always consult your healthcare provider.
      </div>
    </footer>
  );
}
