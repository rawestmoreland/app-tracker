import { Header } from '@/app/_components/header';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { getSignedInUser } from '../lib/auth';
import { UserRole } from '@prisma/client';
import CookieBanner from '@/components/cookie-banner';
import { ConditionalAnalytics } from '@/components/conditional-analytics';
import CookieButton from '@/components/cookie-button';

export const metadata: Metadata = {
  title: 'App Track - Dashboard',
  description: 'Track your job applications and interviews with App Track',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { dbUser } = await getSignedInUser();
  const isAdmin = dbUser?.role === UserRole.ADMIN;

  return (
    <ClerkProvider waitlistUrl="/waitlist" signUpForceRedirectUrl="/onboarding">
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
          <>
            <div className="flex min-h-screen flex-col">
              <Header isAdmin={isAdmin} />
              <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer className="h-16 shrink-0 border-t border-gray-200 bg-white px-4">
                <div className="flex h-16 items-center justify-between">
                  <p className="text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Westmoreland Creative LLC.
                    All rights reserved.
                  </p>
                  <CookieButton />
                </div>
              </footer>
            </div>
            <ConditionalAnalytics gaId="G-FE9XBVBH38" />
            <Toaster />
            <CookieBanner />
          </>
        </body>
      </html>
    </ClerkProvider>
  );
}
