'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How accurate is nub theory?',
    answer: 'Nub theory is 75-85% accurate at 12 weeks when the ultrasound image is clear and the baby is in the right position. Our AI system combined with expert human review helps maximize accuracy by identifying the key anatomical markers that indicate gender.',
  },
  {
    question: 'When can I use this service?',
    answer: 'You can upload your scan from 12 weeks gestation onwards. The nub becomes more visible and accurate as the pregnancy progresses, so 12-14 weeks typically provides the best results.',
  },
  {
    question: 'What if my prediction is wrong?',
    answer: 'We offer a 100% money-back guarantee. If our prediction doesn\'t match your 20-week scan, simply upload your confirmation scan and we\'ll issue a full refund within 5-7 business days. No questions asked.',
  },
  {
    question: 'How quickly will I get my results?',
    answer: 'Most predictions are delivered within 2 hours during our business hours (9am-9pm GMT). If you upload outside these hours, you\'ll receive your results first thing the next morning.',
  },
  {
    question: 'Is my scan image secure and private?',
    answer: 'Absolutely. We treat your ultrasound images with the same confidentiality as medical records. All images are encrypted, stored securely, and automatically deleted after 90 days. We never share or sell your data.',
  },
  {
    question: 'What type of scan image should I upload?',
    answer: 'For best results, upload a clear side-view (profile) ultrasound image from your 12-week scan. The image should show the baby\'s lower body area where the nub (genital tubercle) is visible. Avoid blurry or low-resolution images.',
  },
  {
    question: 'Is this a medical diagnosis?',
    answer: 'No, this service is for entertainment purposes only and should not be considered medical advice. While we strive for accuracy, only your 20-week anatomy scan can provide official confirmation of your baby\'s gender.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards through our secure Stripe payment processor. Your payment information is never stored on our servers.',
  },
];

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-cream-50 transition-colors"
      >
        <span className="font-medium text-stone-800 pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-stone-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-stone-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-cream-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <HelpCircle className="w-6 h-6 text-terracotta" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-stone-800">Frequently Asked Questions</h2>
          <p className="text-stone-600 text-lg">
            Everything you need to know about our service
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-stone-600">
            Still have questions?{' '}
            <a href="/contact" className="text-terracotta font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
