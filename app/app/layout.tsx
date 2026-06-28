import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'] });

/**
 * GA4 measurement id for the NubHub property. Override via NEXT_PUBLIC_GA_ID
 * (e.g. a Vercel env var); otherwise defaults to the live property in production
 * builds only, so local dev doesn't pollute analytics. A GA4 id is public — it
 * ships in client JS — so keeping it in source is safe.
 */
const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID ??
  (process.env.NODE_ENV === 'production' ? 'G-WG6Q5WGS4Q' : undefined);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'NubHub | Baby Gender Prediction at 12 Weeks | Up to 94%',
  description: 'Know your baby\'s gender at 12 weeks with AI-powered, expert-reviewed nub theory prediction. Results in 2 hours, with a 100% money-back guarantee if wrong.',
  keywords: 'nub theory, gender prediction, 12 week scan, baby gender, ultrasound prediction, nub theory accuracy',
  openGraph: {
    title: 'Know Your Baby\'s Gender at 12 Weeks | NubHub',
    description: 'AI-powered gender prediction from your 12-week ultrasound. Results in 2 hours. 100% money-back guarantee.',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
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
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'NubHub - Baby Gender Prediction',
      },
    ],
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
    canonical: SITE_URL,
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
      </head>
      <body className={inter.className}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
        {/* Google Analytics — only loads when NEXT_PUBLIC_GA_ID is configured. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
