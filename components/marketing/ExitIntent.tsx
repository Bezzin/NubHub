'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  // Also show after 45 seconds if not shown yet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'exit_intent_popup',
          discount_code: 'EARLY10',
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Store locally too for the discount to work
        localStorage.setItem('nubpredictor_lead_email', email);
        localStorage.setItem('nubpredictor_discount_code', 'EARLY10');
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            onClick={() => setIsVisible(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4 text-stone-500" />
              </button>

              <div className="bg-gradient-to-br from-terracotta to-terracotta/80 p-8 text-white text-center">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl font-bold mb-2">Wait! Don&apos;t Miss Out</h2>
                <p className="text-white/90">
                  Get 10% off your first prediction + our free Nub Theory Guide
                </p>
              </div>

              <div className="p-8">
                {!isSuccess ? (
                  <>
                    <div className="flex items-center gap-2 text-terracotta bg-terracotta/10 p-3 rounded-xl mb-6">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Offer expires in 15 minutes</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-stone-700 block mb-1.5">
                          Enter your email to claim your discount
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none transition-all"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-terracotta hover:bg-terracotta/90 h-12 text-base rounded-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</>
                        ) : (
                          'Get 10% Off Now'
                        )}
                      </Button>
                    </form>

                    <p className="text-xs text-center text-stone-400 mt-4">
                      No spam, ever. Unsubscribe anytime.
                    </p>

                    <button
                      onClick={() => setIsVisible(false)}
                      className="w-full text-center text-sm text-stone-400 hover:text-stone-600 mt-4 transition-colors"
                    >
                      No thanks, I&apos;ll pay full price
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">You&apos;re In!</h3>
                    <p className="text-stone-600 mb-4">
                      Check your email for your 10% discount code.
                    </p>
                    <Button 
                      onClick={() => setIsVisible(false)}
                      className="bg-terracotta hover:bg-terracotta/90 rounded-xl"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
