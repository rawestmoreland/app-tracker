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
          className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <div className='min-h-full flex flex-col'>
            <Header />
            <main className='flex-1'>
              <div className='mx-auto container px-4 py-8 sm:px-6 lg:px-8'>
                {children}
              </div>
            </main>
            <footer className='bg-white border-t border-gray-200 flex-none max-h-16'>
              <div className='flex items-center justify-center h-16'>
                <p className='text-center text-sm text-gray-500'>
                  &copy; {new Date().getFullYear()} App Tracker. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
