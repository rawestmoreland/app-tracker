'use client';

import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();

  // Don't render authentication-dependent content until Clerk is loaded
  if (!isLoaded) {
    return (
      <header className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                <Link href='/'>App Tracker</Link>
              </h1>
              <p className='text-gray-600'>
                Track your job applications and interviews
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              {/* Show skeleton or loading state */}
              <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              <Link href='/'>App Tracker</Link>
            </h1>
            <p className='text-gray-600'>
              Track your job applications and interviews
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            {isSignedIn ? (
              <>
                <Button asChild>
                  <Link href='/applications/new'>Add Application</Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link href='/companies/new'>Add Company</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode='modal'>
                  <Button>Sign In</Button>
                </SignInButton>
                {/* <SignUpButton mode='modal'>
                  <button className='text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-600 hover:border-blue-700 transition-colors'>
                    Sign Up
                  </button>
                </SignUpButton> */}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
