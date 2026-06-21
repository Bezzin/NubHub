// Server Component — wraps CheckoutButton in Suspense for useSearchParams
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CheckoutButton from './CheckoutButton';

interface WrapperProps {
  label: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function CheckoutButtonWrapper({ label, size, className }: WrapperProps) {
  return (
    <Suspense fallback={
      <Button size={size} className={`bg-terracotta hover:bg-terracotta/90 text-white ${className}`}>
        {label}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    }>
      <CheckoutButton label={label} size={size} className={className} />
    </Suspense>
  );
}
