'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock, PoundSterling, Microscope } from 'lucide-react';

const options = [
  {
    name: '20-Week Anatomy Scan',
    icon: Clock,
    waitTime: '8+ weeks',
    price: 'Free',
    accuracy: '99%',
    features: [
      { text: 'Medically confirmed', included: true },
      { text: 'Completely free', included: true },
      { text: 'Long wait time', included: false, negative: true },
      { text: 'Must wait 8+ weeks', included: false, negative: true },
    ],
    recommended: false,
  },
  {
    name: 'NubHub',
    icon: Microscope,
    waitTime: '2 hours',
    price: '£9.97',
    accuracy: '75-85%',
    features: [
      { text: 'Results in 2 hours', included: true },
      { text: 'AI + Expert review', included: true },
      { text: 'Money-back guarantee', included: true },
      { text: 'Entertainment only', included: true, note: true },
    ],
    recommended: true,
  },
  {
    name: 'Blood Test (NIPT)',
    icon: PoundSterling,
    waitTime: '1 week',
    price: '£400+',
    accuracy: '99%',
    features: [
      { text: 'Highly accurate', included: true },
      { text: 'Medical grade', included: true },
      { text: 'Very expensive', included: false, negative: true },
      { text: 'Invasive procedure', included: false, negative: true },
    ],
    recommended: false,
  },
];

export default function Comparison() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-5 py-2 bg-cream-100 text-terracotta rounded-full text-sm font-medium mb-4">
            Compare Your Options
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-stone-800">
            Why Wait 8 Weeks?
          </h2>
          <p className="text-stone-600 text-lg">
            See how NubHub compares to other gender prediction methods
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {options.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-[2rem] overflow-hidden ${
                option.recommended
                  ? 'bg-white shadow-soft-lg border-2 border-terracotta/20 scale-105 z-10'
                  : 'bg-cream-50 border border-stone-100'
              }`}
            >
              {option.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-terracotta text-white text-center py-2.5 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className={`p-6 ${option.recommended ? 'pt-14' : ''}`}>
                <div className="text-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    option.recommended ? 'bg-terracotta/10' : 'bg-stone-100'
                  }`}>
                    <option.icon className={`w-7 h-7 ${option.recommended ? 'text-terracotta' : 'text-stone-500'}`} />
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-2 text-stone-800">{option.name}</h3>
                  <div className="flex justify-center gap-4 text-sm text-stone-500">
                    <div>
                      <span className="text-stone-400">Wait:</span>{' '}
                      <span className={option.recommended ? 'text-terracotta font-medium' : 'text-stone-700'}>{option.waitTime}</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Accuracy:</span>{' '}
                      <span className="text-stone-700">{option.accuracy}</span>
                    </div>
                  </div>
                  <div className={`text-3xl font-serif font-medium mt-3 ${option.recommended ? 'text-terracotta' : 'text-stone-800'}`}>
                    {option.price}
                  </div>
                </div>

                <div className="space-y-3">
                  {option.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          option.recommended ? 'bg-terracotta/10' : 'bg-stone-200'
                        }`}>
                          <Check className={`w-3 h-3 ${option.recommended ? 'text-terracotta' : 'text-stone-500'}`} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-3 h-3 text-red-400" />
                        </div>
                      )}
                      <span className={`text-sm ${
                        'negative' in feature && feature.negative ? 'text-stone-400' : 
                        'note' in feature && feature.note ? 'text-amber-600' : 'text-stone-700'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {option.recommended && (
                  <button className="w-full mt-6 bg-terracotta hover:bg-terracotta/90 text-white font-medium py-3 rounded-xl transition-colors shadow-warm">
                    Get Started Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
