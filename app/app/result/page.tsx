'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const loadingMessages = [
  'Examining the nub...',
  'Consulting the stork\'s delivery schedule...',
  'Counting tiny fingers and toes...',
  'Checking if baby is cooperating...',
  'Analysing ultrasound patterns...',
  'Reading the crystal ball...',
  'Asking the baby nicely...',
  'Looking for visual clues...',
  'Cross-referencing with nub theory...',
  'Almost there, baby is posing...',
  'Enhancing scan resolution...',
  'Comparing with thousands of scans...',
  'Double-checking our findings...',
  'The suspense is building...',
];

const reviewMessages = [
  'Your scan is being reviewed by our expert...',
  'Our specialist is taking a close look...',
  'Expert review in progress...',
  'Almost there — your result is being confirmed...',
  'Hang tight, the expert is working on it...',
];

// Confetti component
function Confetti() {
  const colors = ['#C17A59', '#8FA68E', '#E8C4C4', '#F5E6DD', '#D9A38D'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
            y: -20,
            rotate: 0,
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// Floating hearts animation
function FloatingHearts({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -100,
            scale: [0.5, 1, 0.5],
            x: Math.sin(i) * 50,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            bottom: '10%',
          }}
        >
          <Heart className="w-8 h-8" style={{ color }} fill={color} />
        </motion.div>
      ))}
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const predictionId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    prediction: 'boy' | 'girl' | 'unclear';
    confidence: number;
    explanation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleResult = useCallback((data: { prediction: { final_result: string; ai_confidence: number; ai_raw_response: string } }) => {
    setResult({
      prediction: data.prediction.final_result as 'boy' | 'girl' | 'unclear',
      confidence: data.prediction.ai_confidence || 0,
      explanation: data.prediction.ai_raw_response || '',
    });
    setLoading(false);
  }, []);

  const [inReview, setInReview] = useState(false);
  const [reviewMessageIndex, setReviewMessageIndex] = useState(0);

  // Cycle review messages
  useEffect(() => {
    if (!inReview) return;
    const interval = setInterval(() => {
      setReviewMessageIndex((prev) => (prev + 1) % reviewMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [inReview]);

  useEffect(() => {
    if (!predictionId) {
      setError('No prediction ID found');
      setLoading(false);
      return;
    }

    let active = true;

    // Poll for final result (set after expert review)
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/predictions/${predictionId}`);
        const data = await response.json();

        if (active && data.prediction?.final_result) {
          handleResult(data);
          clearInterval(pollInterval);
        }
      } catch {
        // Continue polling
      }
    }, 3000);

    // After 3 minutes, switch to "expert review" messaging
    const reviewTimeout = setTimeout(() => {
      if (active && loading) {
        setInReview(true);
      }
    }, 180000);

    // Timeout after 10 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (active && loading) {
        setError('Your result is still being reviewed. You\'ll receive an email with your result shortly.');
        setLoading(false);
      }
    }, 600000);

    return () => {
      active = false;
      clearInterval(pollInterval);
      clearTimeout(reviewTimeout);
      clearTimeout(timeout);
    };
  }, [predictionId, handleResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-200 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated sparkle icon */}
          <motion.div
            className="relative w-24 h-24 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-terracotta/20" />
            <div className="absolute inset-0 rounded-full border-4 border-terracotta border-t-transparent" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-terracotta" />
            </motion.div>
          </motion.div>

          <h2 className="text-2xl font-serif font-medium text-stone-800 mb-6">
            {inReview ? 'Expert Review in Progress' : 'Analysing Your Scan'}
          </h2>

          {/* Rotating messages */}
          <div className="h-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {inReview ? (
                <motion.p
                  key={`review-${reviewMessageIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg text-terracotta font-medium absolute inset-x-0"
                >
                  {reviewMessages[reviewMessageIndex]}
                </motion.p>
              ) : (
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg text-terracotta font-medium absolute inset-x-0"
                >
                  {loadingMessages[messageIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bouncing dots */}
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-terracotta/60 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>

          <p className="mt-6 text-sm text-stone-400">
            {inReview
              ? 'Your scan is being reviewed — results usually arrive within a few minutes'
              : 'This usually takes 10-30 seconds'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-200 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <p className="text-stone-600 mb-4">{error}</p>
          <Link href="/">
            <Button className="bg-terracotta hover:bg-terracotta/90 rounded-full">
              Return Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  const isBoy = result.prediction === 'boy';
  const isGirl = result.prediction === 'girl';
  const themeColor = isBoy ? '#4A90E2' : isGirl ? '#E91E63' : '#C17A59';
  const bgGradient = isBoy 
    ? 'from-blue-50 to-blue-100' 
    : isGirl 
    ? 'from-pink-50 to-pink-100' 
    : 'from-cream-100 to-cream-200';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} relative overflow-hidden`}>
      {/* Confetti */}
      {(isBoy || isGirl) && <Confetti />}
      
      {/* Floating hearts */}
      {(isBoy || isGirl) && <FloatingHearts color={themeColor} />}
      
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 -right-40 w-96 h-96 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 -left-40 w-96 h-96 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)` }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Sparkle icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
              style={{ backgroundColor: `${themeColor}20` }}
            >
              {isBoy ? '👶' : isGirl ? '👧' : '🔍'}
            </div>
          </motion.div>

          {/* Congratulations text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-serif font-medium mb-4"
            style={{ color: themeColor }}
          >
            {isBoy || isGirl ? 'Congratulations!' : 'Analysis Complete'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-stone-700 mb-2"
          >
            {isBoy && "It's a Boy!"}
            {isGirl && "It's a Girl!"}
            {result.prediction === 'unclear' && "We're Not Quite Sure Yet"}
          </motion.p>

          {/* Confidence score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block mt-6 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-soft">
              <p className="text-sm text-stone-500 mb-1">AI Confidence</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-stone-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
                <span className="font-semibold text-stone-700">{result.confidence.toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Explanation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-soft-lg rounded-3xl mb-8">
              <CardContent className="p-8">
                <h3 className="font-serif font-medium text-xl mb-4 text-stone-800">
                  Our Analysis
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {result.explanation || `Based on nub theory analysis, our prediction is ${result.prediction} with ${result.confidence.toFixed(0)}% confidence.`}
                </p>

                <div className="mt-6 p-4 bg-cream-100 rounded-2xl text-sm text-stone-600">
                  <p>
                    <strong>What's next?</strong> You'll also receive a confirmation email with your result.
                    Your 20-week anatomy scan will provide official confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              variant="outline"
              className="rounded-full px-6 border-stone-200"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `I'm having a ${result.prediction}!`,
                    text: `Just found out I'm having a ${result.prediction} using NubHub!`,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Link href="/">
              <Button 
                className="rounded-full px-8"
                style={{ backgroundColor: themeColor }}
              >
                <Heart className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-sm text-stone-400 max-w-md mx-auto"
          >
            This is an AI-powered prediction for entertainment purposes only. 
            Your 20-week anatomy scan will provide official confirmation.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

// Loading fallback
function ResultLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-200 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-terracotta" />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultContent />
    </Suspense>
  );
}
