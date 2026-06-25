'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  label: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function CheckoutButton({ label, size = 'default', className = '' }: CheckoutButtonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Persist any referral code so it survives the trip to the checkout page.
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      try {
        localStorage.setItem('referral_code', ref);
      } catch {
        // ignore unavailable localStorage
      }
    }
  }, [searchParams]);

  const handleCheckout = () => {
    setIsNavigating(true);
    // Inline, on-site checkout — no redirect to Stripe, no popup.
    router.push('/checkout');
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isNavigating}
      size={size}
      className={`bg-terracotta hover:bg-terracotta/90 text-white ${className}`}
    >
      {isNavigating ? (
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
