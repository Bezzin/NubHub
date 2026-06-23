import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service | NubHub',
  description: 'The terms for using NubHub’s early gender prediction service.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="article-page">
      <SiteHeader />

      <main className="article-shell">
        <span className="article-eyebrow">
          <span aria-hidden="true">📄</span> Legal
        </span>
        <h1 className="article-title">Terms of Service</h1>
        <p className="article-lede">
          Please read these terms carefully before using our service.
        </p>

        <div className="article-prose">
          <h2>Service Description</h2>
          <p>
            NubHub provides entertainment-based gender prediction services using ultrasound scan
            analysis. We employ AI technology combined with human review to provide predictions
            based on nub theory. This service is strictly for entertainment purposes and should not
            be considered medical advice or diagnosis.
          </p>

          <h2>Medical Disclaimer</h2>
          <p>
            Our predictions are not medically verified and should never replace professional medical
            advice. The accuracy of nub theory predictions is estimated at around 85-90% at 12-13
            weeks under ideal conditions, and no early prediction is guaranteed. Always consult with
            your healthcare provider for official gender confirmation. We are not responsible for
            decisions made based on our predictions.
          </p>

          <h2>Payment &amp; Pricing</h2>
          <p>
            All payments are processed securely through Stripe. The current service fee is £9.97 per
            prediction. Prices are subject to change with notice. Payment must be completed before
            scan analysis begins. We accept major credit cards and debit cards.
          </p>

          <h2>Refund Policy</h2>
          <p>
            If our prediction is incorrect, you are eligible for a full refund by providing your
            20-week scan confirmation. Refund requests must be submitted within 30 days of receiving
            your 20-week scan. Refunds are processed within 5-7 business days. If your scan image is
            unclear, we will issue an automatic refund.
          </p>

          <h2>Important Notice</h2>
          <p>
            By using our service, you acknowledge that you are at least 18 years old and understand
            that this is an entertainment service only. You agree not to hold NubHub liable for any
            decisions made based on our predictions.
          </p>

          <h2>Questions About Our Terms?</h2>
          <p>
            If you have any questions about these terms, please contact us at{' '}
            <a href="mailto:support@nubpredictor.com">support@nubpredictor.com</a>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
