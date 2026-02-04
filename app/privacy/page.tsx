'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Trash2, Mail } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    icon: Eye,
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
    icon: Lock,
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
    icon: Shield,
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
    icon: Trash2,
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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            NubHub
          </Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-neutral-600">
              Your privacy is our priority. We treat your ultrasound images with the same care as medical records.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-900">
            <strong>Last Updated:</strong> February 2026 | <strong>Effective Date:</strong> February 2026
          </p>
        </div>
      </div>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-neutral-600">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Contact Us About Privacy</h2>
              </div>
              <p className="text-neutral-600 mb-4">
                If you have any questions about our privacy practices or would like to exercise your data rights:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:privacy@nubpredictor.com" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  privacy@nubpredictor.com
                </a>
                <span className="inline-flex items-center justify-center px-6 py-3 bg-white border rounded-xl text-neutral-600">
                  Response within 24 hours
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
