'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, Upload, Mail, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const steps = [
  {
    icon: Calendar,
    title: 'Wait for Your 20-Week Scan',
    description: 'Complete your 20-week anatomy scan to confirm the gender.',
  },
  {
    icon: Upload,
    title: 'Submit Your Request',
    description: 'Upload your 20-week scan and provide your prediction details.',
  },
  {
    icon: CheckCircle,
    title: 'Receive Your Refund',
    description: 'We\'ll verify and process your refund within 5-7 business days.',
  },
];

export default function RefundPage() {
  const [email, setEmail] = useState('');
  const [predictionId, setPredictionId] = useState('');
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Money-Back Guarantee</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Wrong prediction? No problem. We stand by our service with a 100% money-back guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-green-900 mb-4">Our Promise to You</h2>
                  <ul className="space-y-4">
                    {[
                      '100% refund if our prediction is wrong',
                      'Automatic refund if scan image is unclear',
                      'No questions asked - we trust you',
                      'Refund processed within 5-7 business days',
                      'Keep the prediction result as our gift',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-green-800">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-8">
                  <h3 className="text-xl font-semibold mb-6">How It Works</h3>
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div key={step.title} className="flex gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-neutral-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Refund requests must be submitted within 30 days of your 20-week scan date.
                  </AlertDescription>
                </Alert>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-white rounded-2xl shadow-lg border p-8 sticky top-24">
                  {!isSubmitted ? (
                    <>
                      <h2 className="text-2xl font-bold mb-2">Request a Refund</h2>
                      <p className="text-neutral-600 mb-6">Fill out the form below to start your refund process.</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative mt-1.5">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="predictionId">Prediction ID</Label>
                          <Input
                            id="predictionId"
                            type="text"
                            value={predictionId}
                            onChange={(e) => setPredictionId(e.target.value)}
                            placeholder="Found in your confirmation email"
                            className="mt-1.5"
                            required
                          />
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <Label className="text-sm font-medium">Upload 20-Week Scan</Label>
                          <div className="mt-2 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                            <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-neutral-500 mt-1">JPG or PNG, max 10MB</p>
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-base" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
                          ) : (
                            'Submit Refund Request'
                          )}
                        </Button>

                        <p className="text-xs text-center text-neutral-500">
                          We&apos;ll email you within 24 hours with your refund status.
                        </p>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
                      <p className="text-neutral-600 mb-6">
                        We&apos;ve received your refund request. Check your email for confirmation and next steps.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                        Submit Another Request
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
