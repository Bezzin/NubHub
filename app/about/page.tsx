'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Users, Award, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '15,000+', label: 'Predictions Made' },
  { value: '94%', label: 'Accuracy Rate' },
  { value: '4.8/5', label: 'Customer Rating' },
  { value: '2hrs', label: 'Average Delivery' },
];

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'We understand the excitement of expecting parents because we\'ve been there. Every prediction is made with care and respect.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Precision',
    description: 'Our advanced AI system, combined with expert human review, delivers the most accurate nub theory predictions available.',
  },
  {
    icon: Shield,
    title: '100% Privacy First',
    description: 'Your ultrasound images are treated with the same confidentiality as medical records. We never share your data.',
  },
];

const team = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Lead Sonographer',
    bio: 'Certified with 15+ years experience in fetal ultrasound.',
  },
  {
    name: 'James Chen',
    role: 'AI Engineer',
    bio: 'Former Google AI researcher specializing in medical imaging.',
  },
  {
    name: 'Emma Thompson',
    role: 'Customer Care',
    bio: 'Dedicated to ensuring every parent has an amazing experience.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">NubHub</Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">← Back to Home</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Our Story
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Helping Parents Meet Their Baby <span className="text-primary">Sooner</span>
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                We believe the wait to know your baby&apos;s gender shouldn&apos;t be 8 weeks long. 
                Our mission is to give parents peace of mind with fast, accurate predictions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-sm border p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold mb-6">Why We Started</h2>
              <div className="prose prose-lg text-neutral-600">
                <p className="mb-4">
                  It started with a simple frustration: waiting 20 weeks to find out if we were having 
                  a boy or a girl felt like an eternity. After our 12-week scan, we discovered nub theory 
                  and realized there was a scientific way to get an early glimpse.
                </p>
                <p className="mb-4">
                  But finding accurate information and reliable predictions was difficult. That&apos;s when 
                  we decided to combine cutting-edge AI technology with expert sonographer review to create 
                  the most accurate nub theory prediction service available.
                </p>
                <p>
                  Today, we&apos;ve helped over 15,000 parents get an early peek at their little one. Every 
                  prediction is backed by our 100% money-back guarantee because we believe in what we do.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-neutral-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border p-8 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-neutral-600">The experts behind your predictions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border p-6 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-neutral-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Award className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Meet Your Baby?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Join thousands of happy parents who got their answer early.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Get Your Prediction - £9.97
            </Link>
            <p className="text-white/70 text-sm mt-4">
              100% money-back guarantee • Results in 2 hours
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
