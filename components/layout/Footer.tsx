'use client';

import Link from 'next/link';
import { Sparkles, Mail, Shield, Heart } from 'lucide-react';

const footerLinks = {
  product: [
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/refund', label: 'Refund Policy' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif font-medium text-white">
                NubHub
              </span>
            </Link>
            <p className="text-stone-400 mb-6 max-w-sm leading-relaxed">
              Helping expecting parents discover their baby&apos;s gender early, 
              with care, accuracy, and compassion.
            </p>
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@nubpredictor.com" className="hover:text-white transition-colors">
                support@nubpredictor.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-medium text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Shield className="w-4 h-4 text-sage" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Heart className="w-4 h-4 text-terracotta" />
            <span>Expert Sonographers</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Shield className="w-4 h-4 text-sage" />
            <span>100% Money-Back Guarantee</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-stone-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <p>© 2026 NubHub. All rights reserved.</p>
            <p className="text-center md:text-right">
              For entertainment purposes only. Not medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
