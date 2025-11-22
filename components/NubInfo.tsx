import React from 'react';
import { SearchIcon } from './Icons';

export const NubInfo: React.FC = () => {
  // Static content - no need for API call
  const info = {
    summary: "The Nub Theory determines gender by the angle of the genital tubercle. >30° usually indicates a boy, while <10° indicates a girl.",
    accuracy: "70-90%",
    sources: [
      {
        title: "National Library of Medicine",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3530251/"
      },
      {
        title: "American Pregnancy Association",
        url: "https://americanpregnancy.org/prenatal-testing/ultrasound/"
      }
    ]
  };

  return (
    <div className="mt-24 max-w-4xl mx-auto px-4 pb-12">
      <div className="relative bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-[0_8px_32px_0_rgba(255,200,200,0.2)] overflow-hidden">
        
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-200/30 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-white/80 rounded-full shadow-sm text-rose-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-serif font-medium text-gray-800 italic">The Science Behind the Magic</h2>
          </div>
          
          <div className="prose prose-rose max-w-none text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
              {info.summary}
            </p>
            
            <div className="inline-flex flex-col items-center justify-center p-6 bg-white/50 rounded-2xl border border-white/50 mb-10 shadow-sm">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Accuracy Rating</span> 
              <span className="text-4xl font-serif text-gray-800">{info.accuracy}</span>
            </div>

            {info.sources.length > 0 && (
              <div className="pt-6 border-t border-rose-100/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Verified Sources</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {info.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group flex items-center px-4 py-2 bg-white/60 hover:bg-white rounded-full transition-all duration-300 border border-white/50 shadow-sm hover:shadow-md"
                    >
                      <span className="text-xs text-gray-600 group-hover:text-rose-500 transition-colors truncate max-w-[200px]">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};