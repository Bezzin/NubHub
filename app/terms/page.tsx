'use client';

import { motion } from 'framer-motion';
import { Scale, AlertTriangle, FileText, CreditCard, RotateCcw, Mail } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    icon: FileText,
    title: 'Service Description',
    content: `NubHub provides entertainment-based gender prediction services using ultrasound scan analysis. We employ AI technology combined with human review to provide predictions based on nub theory. This service is strictly for entertainment purposes and should not be considered medical advice or diagnosis.`,
  },
  {
    icon: AlertTriangle,
    title: 'Medical Disclaimer',
    content: `Our predictions are not medically verified and should never replace professional medical advice. The accuracy of nub theory predictions is estimated at 75-85% under ideal conditions. Always consult with your healthcare provider for official gender confirmation. We are not responsible for decisions made based on our predictions.`,
  },
  {
    icon: CreditCard,
    title: 'Payment & Pricing',
    content: `All payments are processed securely through Stripe. The current service fee is £9.97 per prediction. Prices are subject to change with notice. Payment must be completed before scan analysis begins. We accept major credit cards and debit cards.`,
  },
  {
    icon: RotateCcw,
    title: 'Refund Policy',
    content: `If our prediction is incorrect, you are eligible for a full refund by providing your 20-week scan confirmation. Refund requests must be submitted within 30 days of receiving your 20-week scan. Refunds are processed within 5-7 business days. If your scan image is unclear, we will issue an automatic refund.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">NubHub</Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">← Back to Home</Link>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-neutral-600">
              Please read these terms carefully before using our service.
            </p>
          </motion.div>
        </div>
      </section>

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
                    <p className="text-neutral-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-amber-900">Important Notice</h2>
              </div>
              <p className="text-amber-800">
                By using our service, you acknowledge that you are at least 18 years old and understand 
                that this is an entertainment service only. You agree not to hold NubHub liable 
                for any decisions made based on our predictions.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Questions About Our Terms?</h2>
              </div>
              <p className="text-neutral-600 mb-4">
                If you have any questions about these terms, please contact us:
              </p>
              <a href="mailto:support@nubpredictor.com" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                support@nubpredictor.com
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
