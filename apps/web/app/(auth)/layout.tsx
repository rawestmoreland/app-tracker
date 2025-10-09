import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';
import CookieBanner from '@/components/cookie-banner';
import { ConditionalAnalytics } from '@/components/conditional-analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Jobble - Onboarding',
  description: 'Complete your Jobble account setup',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function AuthLayout({
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
            <div className="min-h-screen">{children}</div>
            <ConditionalAnalytics gaId="G-FE9XBVBH38" />
            <CookieBanner />
          </>
        </body>
      </html>
    </ClerkProvider>
  );
}
