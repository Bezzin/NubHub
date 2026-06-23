import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | NubHub',
  description: 'How NubHub handles and protects your ultrasound images and personal data.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Personal identification information (Name, email address)',
      'Ultrasound scan images you upload for analysis',
      'Payment information (processed securely via Stripe)',
      'Usage data and analytics',
      'Referral codes and marketing preferences',
    ],
  },
  {
    title: 'How We Protect Your Data',
    content: [
      'All scan images are encrypted at rest and in transit',
      'We use industry-standard SSL/TLS encryption',
      'Access to customer data is restricted to authorized personnel only',
      'Regular security audits and penetration testing',
      'GDPR-compliant data handling procedures',
    ],
  },
  {
    title: 'Your Privacy Rights',
    content: [
      'Right to access your personal data',
      'Right to request data deletion',
      'Right to data portability',
      'Right to object to processing',
      'Right to withdraw consent at any time',
    ],
  },
  {
    title: 'Data Retention & Deletion',
    content: [
      'Scan images are retained for 90 days after prediction',
      'Personal data retained for 7 years for legal compliance',
      'You can request immediate deletion of your data',
      'Anonymized data may be retained for analytics',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="article-page">
      <SiteHeader />

      <main className="article-shell">
        <span className="article-eyebrow">
          <span aria-hidden="true">🔒</span> Privacy
        </span>
        <h1 className="article-title">Privacy Policy</h1>
        <p className="article-lede">
          Your privacy is our priority. We treat your ultrasound images with the same care as
          medical records.
        </p>

        <div className="article-meta">
          <span>
            <b>Last Updated:</b> February 2026
          </span>
          <span>
            <b>Effective Date:</b> February 2026
          </span>
        </div>

        <div className="article-prose">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h2>Contact Us About Privacy</h2>
            <p>
              If you have any questions about our privacy practices or would like to exercise your
              data rights:
            </p>
            <p>
              <a href="mailto:privacy@nubpredictor.com">privacy@nubpredictor.com</a>
              <br />
              <strong>Response within 24 hours</strong>
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
