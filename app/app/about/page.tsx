import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { SITE_URL, PRICE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About NubHub | AI + Expert-Reviewed Nub Theory',
  description:
    'NubHub pairs AI nub-theory analysis with review by an obstetric & maternity professional (20 years’ experience) to give parents an early, careful gender prediction.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const stats = [
  { value: 'Up to 94%', label: 'Accuracy (AI + review)' },
  { value: '2 hours', label: 'Average delivery' },
  { value: '20 yrs', label: 'Reviewer experience' },
  { value: 'Money-back', label: 'Guarantee' },
];

const values = [
  {
    emoji: '💛',
    title: 'Made with care',
    description:
      'We understand the excitement of expecting parents — every prediction is handled with care and respect.',
  },
  {
    emoji: '🧠',
    title: 'AI + expert review',
    description:
      'Our AI reads the nub, then an obstetric & maternity professional reviews it — careful, consistent predictions.',
  },
  {
    emoji: '🔒',
    title: 'Privacy first',
    description:
      'Your ultrasound images are handled privately and are never shared without your permission.',
  },
];

const reviewer = {
  name: 'Ivy',
  role: "Obstetric & maternity professional · 20 years' experience",
  bio: "Ivy reviews every NubHub prediction before it's sent. With two decades in obstetrics and maternity care, she checks the AI's nub reading on each scan for angle, clarity and baby position. She works with us independently, so we share her first name only.",
  image: '/team/ivy.jpg',
};

export default function AboutPage() {
  return (
    <div className="article-page">
      <SiteHeader />

      <main className="about-shell">
        {/* Hero */}
        <section className="about-hero">
          <span className="article-eyebrow">
            <span aria-hidden="true">💛</span> Our story
          </span>
          <h1>Helping parents meet their baby sooner</h1>
          <p>
            The wait to know your baby&apos;s gender shouldn&apos;t feel endless. NubHub gives
            expecting parents a careful, expert-reviewed early prediction from the 12-week scan
            they already have.
          </p>
        </section>

        {/* Stats */}
        <div className="about-stats">
          {stats.map((s) => (
            <div className="about-stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="about-card">
          <h2>Why we started</h2>
          <p>
            It started with a simple frustration: waiting until the 20-week scan to find out if we
            were having a boy or a girl felt like an eternity. After our 12-week scan, we discovered
            nub theory and realised there was an evidence-backed way to get an early glimpse.
          </p>
          <p>
            But finding accurate information and a reliable reading was hard. So we combined AI
            analysis with review by an experienced obstetric &amp; maternity professional to create a
            careful, expert-reviewed prediction service.
          </p>
          <p>
            Today we help expecting parents get an early, expert-reviewed peek at their little one —
            every prediction backed by our 100% money-back guarantee, because we believe in what we do.
          </p>
        </div>

        {/* Values */}
        <div className="about-section-head">
          <h2>What we value</h2>
          <p>The principles behind every prediction</p>
        </div>
        <div className="about-values">
          {values.map((v) => (
            <article className="about-value" key={v.title}>
              <span className="about-value__icon" aria-hidden="true">
                {v.emoji}
              </span>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </article>
          ))}
        </div>

        {/* Reviewer */}
        <div className="about-section-head">
          <h2>Meet your scan reviewer</h2>
          <p>The professional who checks every prediction before it reaches you</p>
        </div>
        <div className="about-reviewer">
          <img
            className="about-reviewer__photo"
            src={reviewer.image}
            alt={`${reviewer.name}, ${reviewer.role}`}
            width={112}
            height={112}
          />
          <h3>{reviewer.name}</h3>
          <p className="about-reviewer__role">{reviewer.role}</p>
          <p>{reviewer.bio}</p>
        </div>

        {/* CTA */}
        <section className="article-cta">
          <h2>Ready to meet your baby?</h2>
          <p>Upload your 12-week scan and get a careful, expert-reviewed prediction within 2 hours.</p>
          <Link href="/#pricing" className="article-cta__btn">
            Get your prediction · {PRICE.symbol}{PRICE.amount}
          </Link>
          <small>100% money-back guarantee · Results in 2 hours</small>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
