'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { testimonials as allTestimonials } from '@/lib/content/testimonials';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-terracotta text-terracotta' : 'text-stone-200'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof allTestimonials[0] }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[350px] md:w-[400px] bg-white rounded-3xl shadow-soft border border-stone-100 p-6 mx-3"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-terracotta/20 to-blush-200 rounded-full flex items-center justify-center text-lg font-serif font-medium text-terracotta">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium text-stone-800 text-sm">{testimonial.name}</h4>
            <p className="text-xs text-stone-500">{testimonial.location}</p>
          </div>
        </div>
        <Quote className="w-8 h-8 text-terracotta/20" />
      </div>

      <StarRating rating={testimonial.rating} />

      <p className="text-stone-600 text-sm mt-3 leading-relaxed line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            testimonial.prediction === 'boy' 
              ? 'bg-sage/20 text-sage-700' 
              : 'bg-blush-100 text-blush-300'
          }`}>
            {testimonial.prediction === 'boy' ? '👶 Boy' : '👧 Girl'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 bg-cream-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-5 py-2 bg-white text-terracotta rounded-full text-sm font-medium mb-4 shadow-soft">
            ⭐ 4.8/5 from 1,200+ Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-stone-800">
            Loved by Parents
          </h2>
          <p className="text-stone-600 text-lg">
            Join thousands of families who got their early peek
          </p>
        </motion.div>
      </div>

      {/* Infinite Scrolling Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[...allTestimonials, ...allTestimonials].map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-cream-100 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cream-100 to-transparent pointer-events-none z-10" />

        {/* Navigation Buttons - Warm */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-white shadow-soft border border-stone-100 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-white shadow-soft border border-stone-100 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Trust Stats - Warm */}
      <div className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '15,000+', label: 'Predictions Made' },
            { value: '94%', label: 'Accuracy Rate' },
            { value: '4.8/5', label: 'Average Rating' },
            { value: '97%', label: 'Would Recommend' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-medium text-terracotta">{stat.value}</div>
              <div className="text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
