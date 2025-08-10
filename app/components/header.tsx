'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  const isCurrentPath = (path: string) => {
    return pathname === path;
  };

  // Don't render authentication-dependent content until Clerk is loaded
  if (!isLoaded) return null;

  return (
    <nav className='border-b border-gray-200 bg-white sticky top-0 z-50'>
      <div className='mx-auto container px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex shrink-0 items-center'>
              <Image
                alt='App Tracker'
                src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                className='h-8 w-auto'
                width={32}
                height={32}
              />
            </div>
            {isSignedIn && (
              <div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
                <Link
                  href='/dashboard'
                  aria-current={
                    isCurrentPath('/dashboard') ? 'page' : undefined
                  }
                  className={cn(
                    isCurrentPath('/dashboard')
                      ? 'border-indigo-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                  )}
                >
                  My Applications
                </Link>
                <Link
                  href='/dashboard/companies'
                  aria-current={
                    isCurrentPath('/dashboard/companies') ? 'page' : undefined
                  }
                  className={cn(
                    isCurrentPath('/dashboard/companies')
                      ? 'border-indigo-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                  )}
                >
                  My Companies
                </Link>
                <Link
                  href='/dashboard/interviews'
                  aria-current={
                    isCurrentPath('/dashboard/interviews') ? 'page' : undefined
                  }
                  className={cn(
                    isCurrentPath('/dashboard/interviews')
                      ? 'border-indigo-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                  )}
                >
                  My Interviews
                </Link>
              </div>
            )}
          </div>
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
