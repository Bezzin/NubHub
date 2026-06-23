import Link from 'next/link';
import { ArrowRight, Check, Clock, Shield, Users } from 'lucide-react';
import CheckoutButton from '@/components/marketing/CheckoutButtonWrapper';
import { HeartMascot, ClaySparkle } from '@/components/marketing/ClayArt';
import JsonLd from '@/components/seo/JsonLd';
import { productSchema } from '@/lib/schema';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

const stats = [
  { value: 'Up to 94%', label: 'accuracy' },
  { value: '2 hours', label: 'result' },
  { value: 'Refund', label: 'if wrong' },
  { value: 'Private', label: '& secure' },
];

const processSteps: {
  step: string;
  title: string;
  icon: string;
  copy: string;
  isNew?: boolean;
}[] = [
  {
    step: '01',
    title: 'Upload scan',
    icon: '/clay/scan.png',
    copy: 'Send a clear side-profile scan from 12 weeks onward.',
  },
  {
    step: '02',
    title: 'AI reads the nub',
    icon: '/clay/ai.png',
    copy: 'Our model checks angle, shape, posture, and image clarity.',
    isNew: true,
  },
  {
    step: '03',
    title: 'Expert review',
    icon: '/clay/review.png',
    copy: 'Ivy, our obstetric & maternity professional with 20 years of experience, reviews every prediction before delivery.',
  },
  {
    step: '04',
    title: 'Private result',
    icon: '/clay/result.png',
    copy: 'Your result arrives securely by email, usually within 2 hours.',
  },
];

const proofRows: [string, string, string][] = [
  ['AI + expert review', 'Included', 'Often manual'],
  ['Typical turnaround', '2 hours', '24-48 hrs'],
  ['Refund if wrong', 'Yes', 'Varies'],
  ['Private upload flow', 'Encrypted', 'Not always'],
];

const methodCards = [
  {
    icon: '/clay/m-profile.png',
    title: 'Clear side profile',
    copy: 'The best scans show the baby from the side with the lower body visible.',
  },
  {
    icon: '/clay/m-reading.png',
    title: 'Nub angle reading',
    copy: 'We look for the genital tubercle and compare its angle to the lower spine.',
  },
  {
    icon: '/clay/m-human.png',
    title: 'Human review',
    copy: 'An obstetric & maternity professional (20+ years) checks the analysis before your result is sent.',
  },
];

const faqs = [
  {
    question: 'When can I upload my scan?',
    answer:
      'Nub theory works best from 12 to 14 weeks when the side-profile view is clear and the nub can be seen.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. NubHub is an early prediction service for entertainment and planning. Your medical team remains the source for clinical advice.',
  },
  {
    question: 'What happens if the prediction is wrong?',
    answer:
      'Send us your later confirmation scan and we will refund the prediction fee under the money-back guarantee.',
  },
  {
    question: 'How private is my scan?',
    answer:
      'Uploads are handled through a private flow, reviewed only for your prediction, and never used in public examples without permission.',
  },
];

export default function Page() {
  return (
    <main className="clay-page">
      <JsonLd
        data={productSchema({
          name: `${SITE_NAME} — Baby Gender Prediction at 12 Weeks`,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
        })}
      />
      {/* ---------- Nav ---------- */}
      <header className="clay-nav" aria-label="Primary navigation">
        <Link href="/" className="clay-logo" aria-label="NubHub home">
          <HeartMascot className="clay-logo__mark" />
          <span>NubHub</span>
        </Link>

        <nav className="clay-nav__links">
          <a href="#how-it-works">How it works</a>
          <Link href="/nub-theory">Nub theory</Link>
          <Link href="/blog">Guides</Link>
          <a href="#accuracy">Accuracy</a>
          <Link href="/faq">FAQ</Link>
        </nav>

        <div className="clay-nav__action">
          <CheckoutButton label="Get prediction" className="clay-cta clay-cta--nav" />
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="clay-hero" aria-labelledby="hero-title">
        <div className="clay-hero__copy">
          <span className="clay-kicker">
            <img src="/clay/sparkle-clay.png" alt="" width={18} height={18} />
            AI + expert-reviewed nub theory
          </span>

          <h1
            id="hero-title"
            className="clay-headline"
            aria-label="Baby gender prediction at 12 weeks. Just upload, that's it."
          >
            <span className="sr-only">
              Baby gender prediction at 12 weeks. Just upload, that&apos;s it.
            </span>
            <img src="/clay/headline.png" alt="" className="clay-headline__img" />
          </h1>

          <p className="clay-hero__lead">
            Discover your baby&apos;s gender from your 12-week scan. A careful,
            expert-reviewed prediction lands in your inbox within 2 hours.
          </p>

          <div className="clay-hero__actions">
            <CheckoutButton label="Get prediction · £9.97" size="lg" className="clay-cta clay-cta--lg" />
            <a href="#how-it-works" className="clay-btn-ghost">
              <span className="clay-btn-ghost__icon">
                <ArrowRight className="h-4 w-4" />
              </span>
              See how it works
            </a>
          </div>

          <ul className="clay-stats">
            {stats.map((s) => (
              <li key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* upload composition */}
        <div className="clay-stage" aria-hidden="true">
          <ClaySparkle className="clay-deco clay-deco--1" />
          <div className="clay-videoframe">
            <video
              className="clay-videoframe__vid"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src="/video/baby-stork.mp4" type="video/mp4" />
            </video>
            <img className="clay-videoframe__accent" src="/clay/sparkle-clay.png" alt="" aria-hidden="true" />
            <span className="clay-videoframe__tag">On the way 🐣</span>
          </div>

          <div className="upload-card">
            <HeartMascot className="clay-mascot-float" />

            <div className="upload-card__drop">
              <div className="polaroid">
                <img src="/mockups/nubhub-sonogram-keepsake-hero.png" alt="" />
              </div>
              <div>
                <div className="upload-card__hint">Drop your scan here</div>
                <div className="upload-card__sub">JPG · PNG · DICOM</div>
              </div>
            </div>
          </div>

          <div className="clay-chip clay-chip--ai">
            <img src="/clay/ai.png" alt="" />
            <div>
              <b>94%</b> AI match
            </div>
          </div>

          <div className="clay-chip clay-chip--result">
            <small>Prediction</small>
            <b>Girl 💗</b>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="clay-section">
        <div className="clay-section__bar">
          <div className="clay-section__head" style={{ marginBottom: 0 }}>
            <span className="clay-kicker">How it works</span>
            <h2>Four happy little steps.</h2>
          </div>
          <a href="#method" className="clay-seeall">
            See the method →
          </a>
        </div>

        <div className="clay-steps">
          {processSteps.map((item) => (
            <article key={item.step} className="clay-step">
              <div className="clay-step__art">
                <span className="clay-step__num">{item.step}</span>
                {item.isNew && <span className="clay-step__tag clay-badge-new">New</span>}
                <img src={item.icon} alt="" />
              </div>
              <div className="clay-step__body">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Accuracy ---------- */}
      <section id="accuracy" className="clay-section">
        <div className="clay-accuracy">
          <div className="clay-accuracy__copy">
            <span className="clay-kicker">Accuracy you can trust</span>
            <h2>
              Right up to 94% of the time.
            </h2>
            <p className="clay-section__head" style={{ marginTop: '0.9rem' }}>
              NubHub blends AI image analysis with review by Ivy, an obstetric &amp; maternity
              professional with 20 years of experience — your scan is checked for angle,
              visibility, and baby position before the prediction reaches you.
            </p>

            <div className="clay-proof">
              {proofRows.map(([label, nubhub, others]) => (
                <div className="clay-proof__row" key={label}>
                  <span>{label}</span>
                  <b>{nubhub}</b>
                  <em>{others}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="clay-statcard">
            <ClaySparkle
              className="clay-deco"
              style={{ width: '2.4rem', top: '1.2rem', right: '1.4rem' }}
            />
            <div className="clay-statcard__big">94%</div>
            <div className="clay-statcard__label">peak accuracy</div>
            <div className="clay-bars">
              <span style={{ height: '46%' }} />
              <span style={{ height: '66%' }} />
              <span style={{ height: '80%' }} />
              <span style={{ height: '94%' }} />
            </div>
            <p className="clay-statcard__note">Nub theory is ~85–90% accurate at 12–13 weeks; our AI + professional review lifts that toward 94%.</p>
          </div>

          <figure className="clay-review">
            <div className="clay-review__avatar">
              <img src="/clay/mascot.png" alt="" />
            </div>
            <div>
              <blockquote>
                Every prediction is reviewed by Ivy — an obstetric &amp; maternity professional
                with 20 years&apos; experience — who checks each scan&apos;s nub angle, clarity,
                and the baby&apos;s position before your result is sent.
              </blockquote>
              <figcaption>How every NubHub result is checked · usually within 2 hours</figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- Method ---------- */}
      <section id="method" className="clay-section">
        <div className="clay-section__head clay-section__head--center">
          <span className="clay-kicker">The method</span>
          <h2>A gentle early glimpse, reviewed with care.</h2>
        </div>

        <div className="clay-features">
          {methodCards.map((card) => (
            <article key={card.title} className="clay-feature">
              <div className="clay-feature__icon">
                <img src={card.icon} alt="" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="clay-section">
        <div className="clay-pricing">
          <div>
            <span className="clay-kicker">One clear price</span>
            <h2>Start with your 12-week scan.</h2>
            <p className="clay-section__head" style={{ marginTop: '0.9rem' }}>
              One prediction, expert-reviewed, with a full refund if your later scan
              proves the result wrong.
            </p>

            <div className="clay-guarantee">
              <div className="clay-guarantee__medal">
                <img src="/clay/mascot.png" alt="" />
              </div>
              <div>
                <strong>100% money-back guarantee</strong>
                <span>Wrong prediction? We refund the full fee — no fuss.</span>
              </div>
            </div>
          </div>

          <div className="clay-ticket">
            <HeartMascot className="clay-ticket__mascot" />
            <img
              src="/clay/gift-clay.png"
              alt=""
              style={{ position: 'absolute', width: '3.2rem', top: '1rem', right: '1rem', transform: 'rotate(8deg)' }}
            />
            <span className="clay-ticket__tag">Single prediction</span>
            <div className="clay-ticket__price">£9.97</div>
            <ul>
              <li><Check className="h-4 w-4" />AI-powered nub analysis</li>
              <li><Check className="h-4 w-4" />Reviewed by a maternity pro (20+ yrs)</li>
              <li><Check className="h-4 w-4" />Private result within 2 hours</li>
              <li><Check className="h-4 w-4" />Money-back guarantee</li>
            </ul>
            <CheckoutButton label="Get prediction · £9.97" size="lg" className="clay-cta clay-cta--wide" />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="clay-section">
        <div className="clay-section__head clay-section__head--center">
          <span className="clay-kicker">Questions</span>
          <h2>What parents ask before uploading.</h2>
        </div>

        <div className="clay-faq">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="clay-footer">
        <nav className="clay-footer__links" aria-label="Site links">
          <Link href="/nub-theory">Nub theory</Link>
          <Link href="/blog">Guides</Link>
          <Link href="/how-our-ai-works">How our AI works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refund">Refunds</Link>
        </nav>
        <div className="clay-footer__inner">
          <Link href="/" className="clay-logo" aria-label="NubHub home">
            <HeartMascot className="clay-logo__mark" />
            <span>NubHub</span>
          </Link>
          <div className="clay-footer__trust">
            <span><Shield className="h-4 w-4" />Secure upload</span>
            <span><Clock className="h-4 w-4" />2 hour result</span>
            <span><Users className="h-4 w-4" />Expert reviewed</span>
          </div>
        </div>
        <p className="clay-footer__note">For entertainment purposes only. Not medical advice.</p>
      </footer>
    </main>
  );
}
