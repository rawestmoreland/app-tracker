import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import CookieBanner from '@/components/cookie-banner';
import { ConditionalAnalytics } from '@/components/conditional-analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Jobble - Juggle Your Job Applications',
  description:
    'Track job applications, manage interviews, and organize your career journey with Jobble. Get insights, stay organized, and land your dream job faster.',
  keywords: [
    'job application tracker',
    'job search management',
    'career tracking',
    'interview management',
    'job search organizer',
    'application status tracker',
    'career development',
    'job hunting tools',
    'application management',
    'interview scheduling',
  ],
  authors: [{ name: 'Jobble Team' }],
  creator: 'Jobble',
  publisher: 'Jobble',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jobble.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jobble - Juggle Your Job Applications',
    description:
      'Track job applications, manage interviews, and organize your career journey with Jobble.',
    url: 'https://jobble.app',
    siteName: 'Jobble',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jobble - Job Application Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobble - Juggle Your Job Applications',
    description:
      'Track job applications, manage interviews, and organize your career journey with Jobble.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider waitlistUrl="/waitlist" signUpForceRedirectUrl="/onboarding">
      <SpeedInsights />
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
          <>
            {children}
            <CookieBanner />
            <ConditionalAnalytics gaId="G-FE9XBVBH38" />
          </>
        </body>
      </html>
    </ClerkProvider>
  );
}
