'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
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

const faqs = [
  {
    q: 'How accurate are your predictions?',
    a: 'Nub theory is around 85–90% accurate at 12–13 weeks with a clear scan. Our AI plus review by an obstetric & maternity professional reaches up to 94% verified accuracy, and every prediction is backed by a money-back guarantee. It is an early prediction, not a diagnostic test.',
  },
  {
    q: 'When will I receive my results?',
    a: 'Most results are delivered within 2 hours during business hours.',
  },
  {
    q: 'What if the prediction is wrong?',
    a: 'We offer a 100% money-back guarantee if incorrect.',
  },
  {
    q: 'Is my scan image private?',
    a: 'Absolutely. We treat your images with medical-grade privacy.',
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
    <div className="article-page">
      <SiteHeader />

      <main className="article-shell">
        {/* Hero */}
        <section style={{ textAlign: 'center', margin: '1.5rem auto 2.5rem', maxWidth: '42rem' }}>
          <span className="article-eyebrow">
            <span aria-hidden="true">💬</span> Get in touch
          </span>
          <h1 className="article-title">Get in Touch</h1>
          <p className="article-lede">
            Have questions? We&apos;re here to help. Reach out and we&apos;ll respond within 2 hours.
          </p>
        </section>

        {/* Contact methods */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
            gap: '1.2rem',
            marginBottom: '2rem',
          }}
        >
          {contactMethods.map((method) => (
            <div key={method.title} className="about-card" style={{ margin: 0, textAlign: 'center' }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '999px',
                  background: 'var(--clay-card-2)',
                  color: 'var(--clay-lav-deep)',
                  marginBottom: '0.9rem',
                  boxShadow: 'var(--clay-shadow-sm)',
                }}
              >
                <method.icon className="w-6 h-6" />
              </span>
              <h3
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  color: 'var(--clay-ink)',
                  fontSize: '1.15rem',
                  margin: '0 0 0.25rem',
                }}
              >
                {method.title}
              </h3>
              <p style={{ color: 'var(--clay-lav-deep)', fontWeight: 600, margin: '0 0 0.25rem' }}>
                {method.description}
              </p>
              <p style={{ color: 'var(--clay-ink-soft)', fontSize: '0.9rem', margin: 0 }}>
                {method.response}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ + Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* FAQ */}
          <div className="about-card" style={{ margin: 0 }}>
            <h2>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--clay-r-md)',
                    padding: '1rem 1.2rem',
                    boxShadow: 'var(--clay-shadow-sm)',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      color: 'var(--clay-ink)',
                      fontSize: '1rem',
                      margin: '0 0 0.35rem',
                    }}
                  >
                    {faq.q}
                  </h4>
                  <p style={{ color: 'var(--clay-ink-soft)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="about-card" style={{ margin: 0 }}>
            {!isSubmitted ? (
              <>
                <h2>Send Us a Message</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Fill out the form below and we&apos;ll get back to you shortly.
                </p>

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

                  <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</>
                    ) : (
                      <><Send className="w-5 h-5 mr-2" />Send Message</>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '999px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    marginBottom: '1rem',
                  }}
                >
                  <CheckCircle className="w-8 h-8" />
                </span>
                <h2>Message Sent!</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Thanks for reaching out. We&apos;ll get back to you within 2 hours.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
