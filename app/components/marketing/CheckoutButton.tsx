'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  label: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function CheckoutButton({ label, size = 'default', className = '' }: CheckoutButtonProps) {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('referral_code', ref);
    } else {
      const stored = localStorage.getItem('referral_code');
      if (stored) setReferralCode(stored);
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

  return (
    <Button
      onClick={handleCheckout}
      disabled={isCreatingCheckout}
      size={size}
      className={`bg-terracotta hover:bg-terracotta/90 text-white ${className}`}
    >
      {isCreatingCheckout ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="ml-2 w-5 h-5" />
        </>
      )}
    </Button>
  );
}
