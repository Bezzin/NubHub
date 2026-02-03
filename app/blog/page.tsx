'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'What is Nub Theory? The Science Explained',
    excerpt: 'Learn about the anatomical basis of nub theory and why it can predict gender as early as 12 weeks.',
    category: 'Education',
    readTime: '5 min read',
    date: 'Jan 15, 2026',
  },
  {
    id: 2,
    title: 'How to Get the Perfect 12-Week Scan Photo',
    excerpt: 'Tips and tricks for capturing a clear ultrasound image that gives the most accurate prediction.',
    category: 'Tips',
    readTime: '4 min read',
    date: 'Jan 10, 2026',
  },
  {
    id: 3,
    title: 'Nub Theory vs Blood Tests: Which is Better?',
    excerpt: 'Comparing the accuracy, cost, and timing of different early gender prediction methods.',
    category: 'Comparison',
    readTime: '6 min read',
    date: 'Jan 5, 2026',
  },
  {
    id: 4,
    title: 'Real Stories: Parents Share Their Experience',
    excerpt: 'Hear from parents who used nub theory and how it compared to their 20-week scan results.',
    category: 'Stories',
    readTime: '8 min read',
    date: 'Dec 28, 2025',
  },
  {
    id: 5,
    title: 'Understanding Nub Angle: The Key to Accuracy',
    excerpt: 'A deep dive into how the angle of the nub determines gender prediction accuracy.',
    category: 'Education',
    readTime: '7 min read',
    date: 'Dec 20, 2025',
  },
  {
    id: 6,
    title: 'Boy or Girl? Early Signs and Old Wives\' Tales',
    excerpt: 'Exploring the myths and facts about early gender prediction beyond ultrasound.',
    category: 'Fun',
    readTime: '5 min read',
    date: 'Dec 15, 2025',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">NubHub</Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">← Back to Home</Link>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">The NubHub Blog</h1>
            <p className="text-xl text-neutral-600">
              Expert insights, tips, and stories about early gender prediction
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">{post.date}</span>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
