'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'support@nubpredictor.com',
    response: 'We reply within 2 hours',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available 9am - 9pm GMT',
    response: 'Instant responses',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: 'Mon - Sun: 9am - 9pm',
    response: 'UK time zone',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

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
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-neutral-600">
              Have questions? We&apos;re here to help. Reach out and we&apos;ll respond within 2 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border p-6 text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                  <p className="text-primary font-medium">{method.description}</p>
                  <p className="text-neutral-500 text-sm mt-1">{method.response}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-8 h-full">
                  <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {[
                      { q: 'How accurate are your predictions?', a: 'Our predictions are 75-85% accurate under ideal conditions.' },
                      { q: 'When will I receive my results?', a: 'Most results are delivered within 2 hours during business hours.' },
                      { q: 'What if the prediction is wrong?', a: 'We offer a 100% money-back guarantee if incorrect.' },
                      { q: 'Is my scan image private?', a: 'Absolutely. We treat your images with medical-grade privacy.' },
                    ].map((faq, i) => (
                      <div key={i} className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-sm mb-1">{faq.q}</h4>
                        <p className="text-neutral-600 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-white rounded-2xl shadow-lg border p-8">
                  {!isSubmitted ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                      <p className="text-neutral-600 mb-6">Fill out the form below and we&apos;ll get back to you shortly.</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="John Doe"
                              className="mt-1.5"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="you@example.com"
                              className="mt-1.5"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="How can we help?"
                            className="mt-1.5"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us more about your question..."
                            className="mt-1.5 min-h-[120px]"
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-base" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</>
                          ) : (
                            <><Send className="w-5 h-5 mr-2" />Send Message</>
                          )}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-neutral-600 mb-6">
                        Thanks for reaching out. We&apos;ll get back to you within 2 hours.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
