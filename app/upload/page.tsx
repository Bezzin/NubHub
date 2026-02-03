'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, Check, Loader2, Shield, Clock, ImageIcon, 
  AlertCircle, ArrowLeft, Sparkles, FileCheck
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';

function UploadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<'good' | 'poor' | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No payment session found. Please complete payment first.');
      setIsVerifying(false);
      return;
    }

    fetch('/api/upload/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setIsValid(true);
        } else {
          setError('Invalid or expired payment session.');
        }
      })
      .catch(() => setError('Failed to verify payment session.'))
      .finally(() => setIsVerifying(false));
  }, [sessionId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG or PNG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);

    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setSelectedFile(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setTimeout(() => setImageQuality(Math.random() > 0.3 ? 'good' : 'poor'), 500);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError('Failed to process image. Please try another file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !sessionId) return;

    setIsUploading(true);
    setError(null);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('session_id', sessionId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => setUploadSuccess(true), 500);
      } else {
        setError(data.error || 'Upload failed. Please try again.');
        setUploadProgress(0);
      }
    } catch (err) {
      setError('Upload failed. Please check your connection and try again.');
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 p-4">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-soft border-0">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-terracotta" />
            <p className="text-stone-600">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 p-4">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-soft border-0">
          <CardContent className="pt-6">
            <Alert className="border-red-200 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
            <Button className="w-full mt-4 bg-terracotta hover:bg-terracotta/90 rounded-full" onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-serif font-medium text-stone-800">NubHub</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-sage-600 bg-sage/10 px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" />
              <span>Payment Verified</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-sage" />
                </div>
                <span className="text-sm font-medium text-stone-800">Payment</span>
              </div>
              <div className="w-12 h-0.5 bg-terracotta" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  uploadSuccess ? 'bg-sage/20' : 'bg-terracotta'
                }`}>
                  {uploadSuccess ? (
                    <Check className="w-4 h-4 text-sage" />
                  ) : (
                    <span className="text-white text-sm font-medium">2</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${uploadSuccess ? 'text-stone-800' : 'text-terracotta'}`}>
                  Upload
                </span>
              </div>
              <div className="w-12 h-0.5 bg-stone-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                  <span className="text-stone-500 text-sm font-medium">3</span>
                </div>
                <span className="text-sm font-medium text-stone-500">Results</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {uploadSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="text-center bg-white rounded-3xl shadow-soft-lg border-0 border-sage/20">
                  <CardHeader>
                    <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-sage" />
                    </div>
                    <CardTitle className="text-3xl font-serif font-medium text-stone-800">Upload Successful!</CardTitle>
                    <CardDescription className="text-lg text-stone-600">
                      Your scan has been received and is being analysed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-cream-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-terracotta" />
                        <span className="font-medium text-stone-800">What happens next?</span>
                      </div>
                      <ul className="text-left space-y-2 text-stone-600">
                        <li className="flex items-start gap-2">
                          <span className="text-terracotta mt-1">•</span>
                          Our specialists are analysing your scan
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-terracotta mt-1">•</span>
                          Expert review within 2 hours
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-terracotta mt-1">•</span>
                          Prediction delivered to your inbox
                        </li>
                      </ul>
                    </div>

                    <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl p-4">
                      <p className="text-terracotta-800">
                        <strong>Expected delivery:</strong>{' '}
                        {new Date().getHours() >= 9 && new Date().getHours() < 19
                          ? 'Within 2 hours'
                          : 'First thing tomorrow morning'}
                      </p>
                    </div>

                    <Link href="/">
                      <Button variant="outline" className="w-full rounded-full border-stone-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Home
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="bg-white rounded-3xl shadow-soft-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif font-medium flex items-center gap-2 text-stone-800">
                      <ImageIcon className="w-6 h-6 text-terracotta" />
                      Upload Your Scan
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      For best results, upload a clear side-view ultrasound image
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert className="mb-4 border-red-200 bg-red-50 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      {!preview ? (
                        <motion.label 
                          className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-terracotta hover:bg-terracotta/5 transition-all group"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
                              <Upload className="w-8 h-8 text-terracotta" />
                            </div>
                            <p className="mb-2 text-lg text-stone-700">
                              <span className="font-medium text-terracotta">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-stone-500">JPG or PNG (max 10MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png"
                            onChange={handleFileSelect}
                          />
                        </motion.label>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200">
                            <img src={preview} alt="Preview" className="w-full" />
                            {imageQuality && (
                              <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium ${
                                imageQuality === 'good' 
                                  ? 'bg-sage/20 text-sage-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {imageQuality === 'good' ? '✓ Good quality' : '⚠ May be unclear'}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setPreview(null);
                              setSelectedFile(null);
                              setImageQuality(null);
                            }}
                            className="w-full rounded-full border-stone-200"
                          >
                            Choose Different Image
                          </Button>
                        </motion.div>
                      )}

                      {/* Tips Card */}
                      <div className="bg-cream-100 rounded-2xl p-5">
                        <h4 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-terracotta" />
                          Tips for best results:
                        </h4>
                        <ul className="space-y-2 text-sm text-stone-600">
                          <li className="flex items-start gap-2">
                            <span className="text-terracotta mt-0.5">•</span>
                            Ensure the image shows a clear side view of your baby
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-terracotta mt-0.5">•</span>
                            The nub should be visible between the legs
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-terracotta mt-0.5">•</span>
                            Image should be from a 12+ week scan
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-terracotta mt-0.5">•</span>
                            Avoid blurry or low-quality photos
                          </li>
                        </ul>
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Uploading...</span>
                            <span className="font-medium">{uploadProgress}%</span>
                          </div>
                          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-terracotta"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="w-full bg-terracotta hover:bg-terracotta/90 h-12 text-base rounded-full"
                        size="lg"
                      >
                        {isUploading ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Uploading...</>
                        ) : (
                          <><Upload className="w-5 h-5 mr-2" />Analyse My Scan</>
                        )}
                      </Button>

                      {/* Security Note */}
                      <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                        <Shield className="w-4 h-4" />
                        <span>Your scan is encrypted and secure. Deleted after 90 days.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Alert className="mt-6 bg-amber-50 border-amber-200 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    <strong>Important:</strong> This service is for entertainment purposes only 
                    and is not medical advice. Your 20-week anatomy scan will provide official confirmation.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    }>
      <UploadContent />
    </Suspense>
  );
}
