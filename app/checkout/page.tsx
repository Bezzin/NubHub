'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { ShieldCheck, ArrowLeft, Clock, BadgeCheck } from 'lucide-react';

// Load Stripe.js once at module scope. Publishable keys are safe to expose.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function CheckoutPage() {
  // Stripe calls this to create the embedded session. Referral code (if any)
  // was stored in localStorage by the CTA button on the marketing pages.
  const fetchClientSecret = useCallback(async () => {
    let referral_code: string | null = null;
    try {
      referral_code = localStorage.getItem('referral_code');
    } catch {
      // localStorage unavailable (private mode etc.) — proceed without a ref.
    }

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referral_code }),
    });

    if (!res.ok) {
      throw new Error('Unable to start checkout. Please try again.');
    }

    const data = await res.json();
    if (!data.clientSecret) {
      throw new Error('Unable to start checkout. Please try again.');
    }
    return data.clientSecret as string;
  }, []);

  return (
    <main className="min-h-screen bg-cream-100">
      <header className="bg-white border-b border-stone-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-800">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-lg font-serif font-medium">NubHub</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-sage-700 bg-sage/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-medium text-stone-800 mb-1">
              Your nub theory prediction
            </h1>
            <p className="text-stone-600">
              AI + expert review, with a money-back guarantee if wrong.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-stone-600 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-terracotta" />
              Result in ~2 hours
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-terracotta" />
              Refund if wrong
            </span>
          </div>

          {stripePromise ? (
            <div className="bg-white rounded-3xl shadow-soft p-2 sm:p-4">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-soft p-6 text-center text-stone-600">
              Payments aren&apos;t configured yet. Please try again shortly.
            </div>
          )}

          <p className="text-center text-xs text-stone-500 mt-6">
            For entertainment purposes only. Not medical advice. Payments
            processed securely by Stripe.
          </p>
        </div>
      </div>
    </main>
  );
}
