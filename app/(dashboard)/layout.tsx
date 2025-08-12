'use client';

import { Header } from '@/app/components/header';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider waitlistUrl='/waitlist'>
      <html lang='en' className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className='antialiased'>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-1 bg-gray-50'>
              <div className='mx-auto container px-4 py-8 sm:px-6 lg:px-8'>
                {children}
              </div>
            </main>
            <footer className='bg-white border-t border-gray-200 h-16 shrink-0'>
              <div className='flex items-center justify-center h-16'>
                <p className='text-center text-sm text-gray-500'>
                  &copy; {new Date().getFullYear()} Westmoreland Creative LLC.
                  All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
