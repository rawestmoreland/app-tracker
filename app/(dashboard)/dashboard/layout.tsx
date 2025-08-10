'use client';

import { Header } from '@/app/components/header';
import { ClerkProvider } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className='min-h-full flex flex-col'>
        <Header />
        <main className='flex-1 bg-gray-50'>
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
    </ClerkProvider>
  );
}
