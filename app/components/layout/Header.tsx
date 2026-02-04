'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#testimonials', label: 'Reviews' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
        }`}
      >
        {/* Top Banner - Warm */}
        <div className="bg-terracotta text-white text-center py-2.5 text-sm">
          <span className="font-medium">Limited Time:</span> Get 10% off with code{' '}
          <span className="font-semibold bg-white/20 px-2 py-0.5 rounded">EARLY10</span>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Warmer */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif font-medium text-stone-800">
                NubHub
              </span>
            </Link>

            {/* Desktop Nav - Softer */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-stone-600 hover:text-terracotta transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Terracotta */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/#pricing">
                <Button className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-6 shadow-warm">
                  Get Prediction
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-stone-600" /> : <Menu className="w-6 h-6 text-stone-600" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream-100 pt-32 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium py-3 border-b border-stone-200 text-stone-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-terracotta hover:bg-terracotta/90 text-white rounded-full py-6 mt-4">
                  Get Prediction — £9.97
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
