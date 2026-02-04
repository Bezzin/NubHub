'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Clock, Award, Users, Heart } from 'lucide-react';

const badges = [
  {
    icon: Heart,
    title: 'Expert Sonographers',
    description: 'Reviewed by certified sonographers',
  },
  {
    icon: Shield,
    title: '100% Money-Back',
    description: 'Wrong prediction? Full refund',
  },
  {
    icon: Lock,
    title: 'Complete Privacy',
    description: 'Your data stays confidential',
  },
  {
    icon: Clock,
    title: '2-Hour Results',
    description: 'Fast, caring service',
  },
  {
    icon: Award,
    title: '94% Accuracy',
    description: 'Trusted by thousands',
  },
  {
    icon: Users,
    title: '15,000+ Families',
    description: 'Parents who got answers',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-14 bg-white border-y border-stone-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-terracotta/10 transition-colors">
                <badge.icon className="w-7 h-7 text-stone-400 group-hover:text-terracotta transition-colors" />
              </div>
              <h3 className="font-medium text-sm text-stone-800">{badge.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
