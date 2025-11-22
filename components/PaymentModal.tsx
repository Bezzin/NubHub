import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface PaymentModalProps {
  onInitiate: (email: string) => void;
  onCancel: () => void;
  promoCode: string | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onInitiate, onCancel, promoCode }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handlePay = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Call the upload and checkout flow
    onInitiate(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/20 backdrop-blur-md transition-all duration-700">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 p-8 text-center relative border-b border-rose-100">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg shadow-rose-100 mb-4">
            <SparklesIcon className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-3xl font-serif text-gray-800 mb-1">Unlock Prediction</h3>
          <p className="text-rose-400 font-medium text-sm tracking-wide uppercase">Premium Analysis</p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex justify-between items-end mb-8 pb-6 border-b border-dashed border-gray-200">
            <div>
              <p className="text-gray-900 font-serif text-xl italic">12-Week Scan Report</p>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">Detailed AI Analysis</p>
            </div>
            <div className="text-3xl font-serif font-medium text-rose-500">£9.97</div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-colors text-gray-800 placeholder:text-gray-400"
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-500">{emailError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              We'll send your results to this email address
            </p>
          </div>

          <div className="text-center mb-6 text-gray-600 text-sm">
            You will be redirected to a secure Stripe checkout page to complete your purchase.
          </div>

          <button
            onClick={handlePay}
            className="w-full bg-gray-900 text-white font-medium text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transform active:scale-[0.98] transition-all flex justify-center items-center gap-3"
          >
            <span>Purchase Analysis</span>
          </button>

          <button className="w-full text-center mt-6 text-xs font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-colors" onClick={onCancel}>
            Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
};
