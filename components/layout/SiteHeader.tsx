import Link from 'next/link';
import { HeartMascot } from '@/components/marketing/ClayArt';

/**
 * Shared clay-styled header for content/editorial pages. Server component so the
 * nav (internal links) renders in static HTML for crawlers and AI bots.
 */
const navLinks = [
  { href: '/nub-theory', label: 'Nub theory' },
  { href: '/blog', label: 'Guides' },
  { href: '/how-our-ai-works', label: 'How our AI works' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-header__logo" aria-label="NubHub home">
        <HeartMascot />
        <span>NubHub</span>
      </Link>
      <nav className="site-header__nav" aria-label="Primary">
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/#pricing" className="site-header__cta">
        Get prediction
      </Link>
    </header>
  );
}
