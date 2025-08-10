import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from './components/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'App Tracker',
  description: 'Track your job applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='h-full'>
        <body
          className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className='min-h-full'>
            <Header />
            <main>
              <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                {children}
              </div>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
