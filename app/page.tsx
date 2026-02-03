'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, Clock, Shield, Heart, Sparkles, 
  Zap, Lock, Award, Users, Star, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/marketing/Testimonials';
import TrustBadges from '@/components/marketing/TrustBadges';
import FAQ from '@/components/marketing/FAQ';
import Comparison from '@/components/marketing/Comparison';
import ExitIntent from '@/components/marketing/ExitIntent';
import SocialProof from '@/components/marketing/SocialProof';

// Animated Counter Component
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [end]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Component that uses search params
function HomeContent() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [urgencyMessage, setUrgencyMessage] = useState('');

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('referral_code', ref);
    } else {
      const stored = localStorage.getItem('referral_code');
      if (stored) setReferralCode(stored);
    }

    const hour = new Date().getHours();
    if (hour >= 9 && hour < 19) {
      setUrgencyMessage('Order in the next 2 hours for results today');
    } else {
      setUrgencyMessage('Order now for first results tomorrow morning');
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setIsCreatingCheckout(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referral_code: referralCode }),
      });
      const data = await response.json();
      if (data.sessionUrl) window.location.href = data.sessionUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* HERO SECTION - With organic shapes and texture */}
      <section className="relative pt-28 pb-20 overflow-hidden texture-grain">
        {/* Organic blob shapes */}
        <div className="blob-terracotta w-[500px] h-[500px] -top-20 -right-40 shape-float" style={{ animationDelay: '0s' }} />
        <div className="blob-sage w-[400px] h-[400px] top-1/3 -left-32 shape-float" style={{ animationDelay: '2s' }} />
        <div className="blob-terracotta w-[300px] h-[300px] bottom-0 right-1/4 shape-float" style={{ animationDelay: '4s' }} />
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 texture-dots pointer-events-none" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-terracotta px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-soft"
            >
              <Heart className="w-4 h-4 fill-terracotta" />
              <span>Trusted by 15,000+ expecting parents</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-8 leading-[1.1] text-stone-800"
            >
              Discover Your Baby&apos;s Gender
              <span className="block text-terracotta mt-2">at Just 12 Weeks</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Upload your ultrasound scan and receive your personalised prediction 
              within <span className="font-medium text-stone-800">2 hours</span>.
              Not accurate? We&apos;ll refund you in full.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-5"
            >
              <Button
                onClick={handleCheckout}
                disabled={isCreatingCheckout}
                className="bg-terracotta hover:bg-terracotta/90 text-white text-lg px-10 py-7 rounded-full shadow-warm hover:shadow-lg transition-all transform hover:scale-[1.02]"
                size="lg"
              >
                {isCreatingCheckout ? (
                  'Loading...'
                ) : (
                  <>
                    Get Your Prediction
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sage" />
                  Money-back guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sage" />
                  Results in 2 hours
                </span>
              </div>

              <div className="mt-6 bg-white rounded-3xl shadow-soft-lg border border-stone-100 p-8 inline-block">
                <div className="flex items-baseline gap-3 justify-center">
                  <span className="text-stone-400 line-through text-lg">£19.97</span>
                  <span className="text-5xl font-serif font-medium text-stone-800">£9.97</span>
                </div>
                <p className="text-stone-500 text-sm mt-2">One-time payment</p>
                {referralCode && (
                  <p className="text-sm text-terracotta mt-3 font-medium bg-terracotta/10 px-3 py-1 rounded-full inline-block">
                    ✓ {referralCode} discount applied
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-terracotta text-terracotta" />
                  ))}
                </div>
                <span className="font-medium text-stone-700">4.8/5</span>
                <span className="text-stone-500">(1,200+ reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Users className="w-4 h-4 text-sage" />
                <span><AnimatedCounter end={15847} /> predictions</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* PROBLEM SECTION - With wash texture */}
      <section className="py-24 bg-white texture-wash relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="blob-cream w-[600px] h-[600px] -top-40 -left-40" />
        <div className="blob-cream w-[400px] h-[400px] bottom-0 right-0" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-stone-800">
              The Wait Can Feel Like Forever
            </h2>
            <p className="text-xl text-stone-600 mb-12 leading-relaxed">
              We understand that 20 weeks feels like an eternity when you&apos;re excited to meet your little one. 
              You want to start planning, dreaming, and preparing for their arrival.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Clock, text: '8 weeks feels like an eternity', color: 'bg-blush-100 text-blush-300' },
                { icon: Heart, text: 'You want to start preparing', color: 'bg-terracotta/10 text-terracotta' },
                { icon: Sparkles, text: 'The curiosity is overwhelming', color: 'bg-sage/20 text-sage' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-cream-100 rounded-3xl p-8 text-center shadow-soft relative overflow-hidden"
                >
                  {/* Subtle texture on cards */}
                  <div className="absolute inset-0 texture-noise opacity-50" />
                  <div className="relative">
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <p className="text-stone-700 font-medium">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-lg text-stone-600 mb-6">
                There&apos;s a gentle, scientifically-grounded way to get an early glimpse...
              </p>
              <Button onClick={scrollToPricing} className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-8 py-6 text-base">
                Discover Your Baby&apos;s Gender
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS - With grid texture */}
      <section id="how-it-works" className="py-24 bg-cream-100 texture-grid relative">
        {/* Organic blobs */}
        <div className="blob-sage w-[500px] h-[500px] top-0 right-0 opacity-50" />
        <div className="blob-terracotta w-[400px] h-[400px] bottom-0 left-0 opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-5 py-2 bg-white text-terracotta rounded-full text-sm font-medium mb-6 shadow-soft">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-stone-800">
              Three Simple Steps
            </h2>
            <p className="text-stone-600 text-lg">
              From scan to prediction in under two hours
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Upload Your Scan',
                desc: 'Take a clear photo of your 12-week ultrasound showing a side view of your baby.',
                time: '30 seconds',
              },
              {
                step: '2',
                title: 'Expert Analysis',
                desc: 'Our specialists analyse the nub angle and positioning with care and precision.',
                time: 'Under 2 hours',
              },
              {
                step: '3',
                title: 'Receive Your Answer',
                desc: 'Get your personalised prediction delivered straight to your inbox.',
                time: 'Instant delivery',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-0 shadow-soft rounded-3xl overflow-hidden group hover:shadow-soft-lg transition-shadow relative">
                  {/* Card texture */}
                  <div className="absolute inset-0 texture-noise opacity-30" />
                  <CardContent className="pt-8 pb-8 text-center relative">
                    <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-terracotta/20 transition-colors">
                      <span className="text-2xl font-serif font-medium text-terracotta">{item.step}</span>
                    </div>
                    <div className="inline-block bg-sage/20 text-sage-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
                      {item.time}
                    </div>
                    <h3 className="text-xl font-serif font-medium mb-3 text-stone-800">{item.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION - With waves texture */}
      <section className="py-24 bg-sage/10 texture-waves relative overflow-hidden">
        {/* Decorative elements */}
        <div className="blob-cream w-[500px] h-[500px] -top-40 left-1/4" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
              <Shield className="w-10 h-10 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-stone-800">
              Our Promise to You
            </h2>
            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              We&apos;re so confident in our predictions that if we get it wrong, 
              we&apos;ll refund every penny. No questions asked.
            </p>

            <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10 relative texture-grain">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  'Upload your 20-week confirmation scan',
                  'We verify within 24 hours',
                  'Full refund to your account',
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center mb-3">
                      <Check className="w-5 h-5 text-terracotta" />
                    </div>
                    <p className="text-stone-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Button onClick={scrollToPricing} className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-10 py-6 text-lg">
                Try Risk-Free for £9.97
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Comparison />
      <Testimonials />

      {/* BACKGROUND IMAGE SECTION - Like Hertility's "World-class treatment" */}
      <section 
        className="py-24 relative bg-image-overlay texture-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23C17A59;stop-opacity:0.1' /%3E%3Cstop offset='100%25' style='stop-color:%238FA68E;stop-opacity:0.1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cellipse cx='200' cy='200' rx='300' ry='300' fill='url(%23g)'/%3E%3Cellipse cx='1200' cy='600' rx='400' ry='400' fill='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay with organic shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob-terracotta w-[600px] h-[600px] -top-40 -left-40 opacity-20" />
          <div className="blob-sage w-[500px] h-[500px] -bottom-40 -right-40 opacity-20" />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] shadow-soft-lg p-10 md:p-16 text-center texture-noise">
              <span className="inline-block px-5 py-2 bg-sage/20 text-sage-700 rounded-full text-sm font-medium mb-6">
                Expert Care
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-stone-800">
                Personalised Predictions, <br />
                <span className="text-terracotta">Without the Wait</span>
              </h2>
              <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Our team of certified specialists brings together years of ultrasound expertise 
                with advanced AI analysis to give you the most accurate early gender prediction available.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                {[
                  { number: '15,000+', label: 'Happy Parents' },
                  { number: '94%', label: 'Accuracy Rate' },
                  { number: '2hrs', label: 'Average Response' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-serif font-medium text-terracotta mb-1">{stat.number}</div>
                    <div className="text-sm text-stone-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Button onClick={scrollToPricing} className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-10 py-6 text-lg shadow-warm">
                Get Your Prediction
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white relative texture-wash">
        <div className="blob-cream w-[500px] h-[500px] top-0 right-0" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block px-5 py-2 bg-terracotta/10 text-terracotta rounded-full text-sm font-medium mb-6">
              Limited Time
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-stone-800">
              Simple, Transparent Pricing
            </h2>
            <p className="text-stone-600 text-lg">
              Less than the cost of a coffee date to know your baby&apos;s gender 8 weeks early
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-[2rem] shadow-soft-lg border border-stone-100 overflow-hidden relative texture-grain">
              <div className="bg-terracotta text-white text-center py-4">
                <span className="font-medium">Most Popular</span>
              </div>
              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-stone-400 line-through text-xl">£19.97</span>
                    <span className="text-6xl font-serif font-medium text-stone-800">£9.97</span>
                  </div>
                  <p className="text-stone-500">One-time payment</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Zap, text: 'Results in 2 hours' },
                    { icon: Sparkles, text: 'Expert analysis included' },
                    { icon: Shield, text: '100% Money-back guarantee' },
                    { icon: Lock, text: 'Private & confidential' },
                    { icon: Heart, text: 'Personalised explanation' },
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-sage/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-sage" />
                      </div>
                      <span className="text-stone-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleCheckout}
                  disabled={isCreatingCheckout}
                  className="w-full bg-terracotta hover:bg-terracotta/90 text-white text-lg py-6 rounded-full shadow-warm hover:shadow-lg transition-all"
                >
                  {isCreatingCheckout ? 'Processing...' : 'Get My Prediction'}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-stone-400">
                  <Lock className="w-3 h-3" />
                  <span>Secure payment via Stripe</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-terracotta relative overflow-hidden">
        {/* Multiple layered textures */}
        <div className="absolute inset-0 texture-noise opacity-30" />
        <div className="absolute inset-0 texture-dots opacity-15" />
        <div className="absolute inset-0 texture-waves opacity-10" />
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta via-terracotta to-terracotta-600 opacity-90" />
        
        {/* Organic shapes */}
        <div className="blob-cream w-[500px] h-[500px] -top-32 -left-32 opacity-25 pulse-soft" />
        <div className="blob-cream w-[400px] h-[400px] top-1/2 -right-40 opacity-20 shape-float" />
        <div className="blob-cream w-[350px] h-[350px] -bottom-20 left-1/4 opacity-15" />
        
        {/* Decorative rings */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-32 left-32 w-24 h-24 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/5 rounded-full" />
        
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of parents who got their answer early. 
              Your little one is waiting to meet you.
            </p>
            <Button
              onClick={handleCheckout}
              className="bg-white text-terracotta hover:bg-cream-100 text-lg px-10 py-7 rounded-full shadow-lg"
            >
              Get Started — £9.97
            </Button>
            <p className="text-white/70 text-sm mt-5">
              100% Money-Back Guarantee
            </p>
          </motion.div>
        </div>
      </section>

      <FAQ />

      {/* DISCLAIMER */}
      <section className="py-12 bg-cream-200">
        <div className="container mx-auto px-4">
          <Alert className="max-w-3xl mx-auto bg-white border-stone-200 shadow-soft texture-grain">
            <AlertCircle className="w-5 h-5 text-terracotta" />
            <AlertDescription className="text-stone-600">
              <strong>Important:</strong> This service is for entertainment purposes only and is not medical advice. 
              Always consult with your healthcare provider for official confirmation at your 20-week scan.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </>
  );
}

// Loading fallback
function HomeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-terracotta mx-auto mb-4" />
        <p className="text-stone-600">Loading...</p>
      </div>
    </div>
  );
}

// Main export with suspense
export default function Home() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <SocialProof />
      <ExitIntent />
      
      <Suspense fallback={<HomeLoading />}>
        <HomeContent />
      </Suspense>
      
      <Footer />
    </div>
  );
}
