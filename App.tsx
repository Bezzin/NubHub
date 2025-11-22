import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, PredictionResult, UploadResponse } from './types';
import { PaymentModal } from './components/PaymentModal';
import { NubInfo } from './components/NubInfo';
import { UploadIcon, BabyIcon, SparklesIcon } from './components/Icons';
import { Confetti } from './components/Confetti';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setPromoCode(code);
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB.");
      return;
    }

    setUploadError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; 
      setImage(base64Data);
      setState(AppState.PAYMENT);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePaymentInitiate = useCallback(async (userEmail: string) => {
    if (!image) return;

    setState(AppState.UPLOADING);
    setEmail(userEmail);

    try {
      // Call /api/upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          image: `data:image/jpeg;base64,${image}`,
          promoCode: promoCode || undefined,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Server returned an invalid response. Please check your environment variables are set in Vercel.');
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Upload failed');
      }
      setSubmissionId(data.submissionId);
      setCheckoutUrl(data.checkoutUrl);

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setState(AppState.ERROR);
    }
  }, [image, promoCode]);

  const handlePaymentCancel = () => {
    setImage(null);
    setEmail('');
    setCheckoutUrl(null);
    setSubmissionId(null);
    setState(AppState.LANDING);
  };

  const handleReset = () => {
    setImage(null);
    setEmail('');
    setResult(null);
    setCheckoutUrl(null);
    setSubmissionId(null);
    setState(AppState.LANDING);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] text-slate-700 font-sans overflow-x-hidden selection:bg-rose-300 relative">
      
      {/* Base Gradient Layer - Richer than before */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-rose-200 via-pink-100 to-indigo-100 opacity-70"></div>

      {/* Enhanced Background Ambient Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-rose-300/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-300/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] bg-amber-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="w-full p-6 md:p-8 flex justify-between items-center relative z-40">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
          <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/40 group-hover:bg-white/80 transition-all duration-300">
            <BabyIcon className="w-6 h-6 text-rose-500" />
          </div>
          <span className="text-2xl font-serif italic font-bold text-gray-800 tracking-tight drop-shadow-sm">
            NubHub
          </span>
        </div>
      </header>

      <main className="relative z-10 pt-12 pb-20 px-4 lg:pt-20">
        
        {/* Landing State */}
        {state === AppState.LANDING && (
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-sm text-rose-600 text-xs font-bold uppercase tracking-widest mb-8 animate-float ring-1 ring-rose-200">
              <SparklesIcon className="w-4 h-4" />
              INSTANT RESULTS
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-medium mb-8 text-gray-900 leading-tight tracking-tight drop-shadow-sm">
              Boy or Girl? <br/>
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">
                The secret is in the nub.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Experience the magic of early gender reveal. Simply share your 12-week ultrasound, and let our premier service discover the secret for you.
            </p>

            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={triggerFileInput}
                className="group relative px-12 py-6 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-full shadow-[0_20px_40px_-12px_rgba(251,113,133,0.5)] hover:shadow-[0_25px_60px_-12px_rgba(251,113,133,0.7)] hover:-translate-y-1 transition-all duration-500 overflow-hidden ring-4 ring-white/60"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                <span className="relative z-10 flex items-center gap-3 font-serif text-xl italic text-white">
                  <SparklesIcon className="w-6 h-6" />
                  Reveal My Baby's Gender
                </span>
              </button>
              
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Secure • Private • Accurate
              </p>
              
              {uploadError && (
                <div className="mt-4 px-6 py-3 bg-red-50/80 backdrop-blur-sm text-red-500 rounded-xl text-sm border border-red-100 shadow-sm">
                  {uploadError}
                </div>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />

            <NubInfo />
          </div>
        )}

        {/* Payment Modal */}
        {state === AppState.PAYMENT && (
          <PaymentModal
            onInitiate={handlePaymentInitiate}
            onCancel={handlePaymentCancel}
            promoCode={promoCode}
          />
        )}

        {/* Uploading State */}
        {state === AppState.UPLOADING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 rounded-full border border-white/50"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-rose-500 animate-spin duration-[3s]"></div>
              <div className="absolute inset-4 rounded-full border-[3px] border-transparent border-b-indigo-400 animate-spin duration-[2s] direction-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-full shadow-xl shadow-rose-100/50">
                  <UploadIcon className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-serif italic text-gray-800 mb-3 drop-shadow-sm">Uploading Scan...</h2>
            <p className="text-rose-500/80 font-medium tracking-widest text-xs uppercase">Preparing your analysis</p>
          </div>
        )}

        {/* Under Review State */}
        {state === AppState.UNDER_REVIEW && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 ring-1 ring-white/80 p-16 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 mb-6">
                  <span className="text-5xl">👨‍⚕️</span>
                </div>
                <h2 className="text-5xl font-serif italic text-purple-600 mb-4">Expert Review in Progress</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-8"></div>
              </div>

              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your ultrasound scan requires our expert team's careful review for the most accurate result.
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">What happens next?</h3>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>Our specialist will carefully analyze your image</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>You'll receive results via email within <strong>2 hours</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>If we don't deliver on time, you'll get an <strong>automatic full refund</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-8">
                <p className="text-amber-900 text-sm font-medium">
                  ⏰ Results guaranteed within 2 hours or your money back!
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-2xl bg-gray-900 text-white text-lg font-medium shadow-xl hover:bg-black transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === AppState.ERROR && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 ring-1 ring-white/80 p-16 text-center">
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-4xl font-serif italic text-red-600 mb-4">Something Went Wrong</h2>
              <p className="text-gray-600 mb-8">{uploadError}</p>
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-2xl bg-gray-900 text-white text-lg font-medium shadow-xl hover:bg-black transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 rounded-full border border-white/50"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-rose-500 animate-spin duration-[3s]"></div>
              <div className="absolute inset-4 rounded-full border-[3px] border-transparent border-b-indigo-400 animate-spin duration-[2s] direction-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-full shadow-xl shadow-rose-100/50">
                  <SparklesIcon className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-serif italic text-gray-800 mb-3 drop-shadow-sm">Analyzing Scan...</h2>
            <p className="text-rose-500/80 font-medium tracking-widest text-xs uppercase">Consulting Gemini Vision</p>
          </div>
        )}

        {/* Result State */}
        {state === AppState.RESULT && result && (
          <>
            <Confetti />
            <div className="max-w-3xl mx-auto animate-scale-up">
              <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 ring-1 ring-white/80">
                
                {/* Result Header */}
                <div className={`p-16 text-center relative overflow-hidden`}>
                  
                  {/* Dynamic Background Gradient */}
                  <div className={`absolute inset-0 opacity-30 ${
                    result.gender === 'Boy' ? 'bg-gradient-to-b from-blue-300 via-blue-100 to-transparent' : 
                    result.gender === 'Girl' ? 'bg-gradient-to-b from-rose-300 via-rose-100 to-transparent' : 
                    'bg-gradient-to-b from-purple-300 via-purple-100 to-transparent'
                  }`}></div>

                  <div className="relative z-10">
                    <div className="inline-block p-3 rounded-2xl bg-white/80 shadow-sm mb-6 ring-1 ring-white">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Prediction Complete</span>
                    </div>
                    
                    <h2 className={`text-7xl md:text-8xl font-serif italic mb-6 drop-shadow-sm ${
                      result.gender === 'Boy' ? 'text-blue-600' : 
                      result.gender === 'Girl' ? 'text-rose-600' : 'text-purple-600'
                    }`}>
                      It's a {result.gender}!
                    </h2>
                    
                    <div className="flex justify-center gap-4">
                       <div className="px-6 py-3 bg-white/90 rounded-full shadow-sm border border-white/50 backdrop-blur-sm">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Confidence</span>
                          <span className="font-serif text-lg text-gray-800">{result.confidence}%</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Report */}
                <div className="px-10 pb-12 md:px-16 md:pb-16 space-y-10">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200/60 pb-2">
                      Visual Analysis
                    </h3>
                    <p className="text-gray-700 leading-loose text-lg font-light">
                      {result.reasoning}
                    </p>
                  </div>

                  {result.tips.length > 0 && (
                    <div className="bg-gradient-to-br from-white/50 to-white/80 rounded-3xl p-8 border border-white shadow-sm ring-1 ring-white/50">
                      <h4 className="font-serif text-xl text-gray-800 mb-6 italic">Expert Recommendations</h4>
                      <ul className="space-y-4">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-4 text-gray-600">
                            <div className="min-w-[24px] h-[24px] flex items-center justify-center rounded-full bg-rose-200 text-rose-700 text-xs font-bold mt-0.5 shadow-sm">
                              {i + 1}
                            </div>
                            <span className="font-light">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-6">
                    <button 
                      onClick={handleReset}
                      className="w-full py-5 rounded-2xl bg-gray-900 text-white text-lg font-medium shadow-xl hover:bg-black hover:shadow-2xl transition-all ring-4 ring-transparent hover:ring-rose-100"
                    >
                      Analyze Another Scan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default App;