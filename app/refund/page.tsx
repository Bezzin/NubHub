import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund Policy | NubHub',
  description: 'NubHub’s money-back guarantee and refund policy for gender predictions.',
  alternates: { canonical: `${SITE_URL}/refund` },
};

export default function RefundPage() {
  return (
    <div className="article-page">
      <SiteHeader />

      <main className="article-shell">
        <span className="article-eyebrow">
          <span aria-hidden="true">💛</span> Refund policy
        </span>
        <h1 className="article-title">Money-Back Guarantee</h1>
        <p className="article-lede">
          Wrong prediction? No problem. We stand by our service with a 100% money-back guarantee.
        </p>

        <div className="article-prose">
          <h2>Our Promise to You</h2>
          <ul>
            <li>100% refund if our prediction is wrong</li>
            <li>Automatic refund if scan image is unclear</li>
            <li>No questions asked - we trust you</li>
            <li>Refund processed within 5-7 business days</li>
            <li>Keep the prediction result as our gift</li>
          </ul>

          <h2>How It Works</h2>
          <ul>
            <li>
              <strong>Wait for Your 20-Week Scan</strong> — Complete your 20-week anatomy scan to
              confirm the gender.
            </li>
            <li>
              <strong>Submit Your Request</strong> — Upload your 20-week scan and provide your
              prediction details.
            </li>
            <li>
              <strong>Receive Your Refund</strong> — We&apos;ll verify and process your refund within
              5-7 business days.
            </li>
          </ul>

          <h2>How to Request a Refund</h2>
          <p>
            To start your refund, email us with your email address, your Prediction ID (found in your
            confirmation email), and your 20-week scan (JPG or PNG, max 10MB). We&apos;ll email you
            within 24 hours with your refund status.
          </p>
          <p>
            <a href="mailto:support@nubpredictor.com">support@nubpredictor.com</a>
          </p>

          <h2>Time Limit</h2>
          <p>
            Refund requests must be submitted within 30 days of your 20-week scan date.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
