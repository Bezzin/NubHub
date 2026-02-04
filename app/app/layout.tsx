import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NubHub | Baby Gender Prediction at 12 Weeks | 94% Accuracy',
  description: 'Know your baby\'s gender at 12 weeks with AI-powered nub theory prediction. Results in 2 hours. 100% money-back guarantee if wrong. Trusted by 15,000+ parents.',
  keywords: 'nub theory, gender prediction, 12 week scan, baby gender, ultrasound prediction, nub theory accuracy',
  openGraph: {
    title: 'Know Your Baby\'s Gender at 12 Weeks | NubHub',
    description: 'AI-powered gender prediction from your 12-week ultrasound. Results in 2 hours. 100% money-back guarantee.',
    type: 'website',
    url: 'https://nubhub.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NubHub - Baby Gender Prediction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Know Your Baby\'s Gender at 12 Weeks',
    description: 'AI-powered gender prediction. Results in 2 hours. 100% money-back guarantee.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://nubhub.com',
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍼</text></svg>',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍼</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#C17A59" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
