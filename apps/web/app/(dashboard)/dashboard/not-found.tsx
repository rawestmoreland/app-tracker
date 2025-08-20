'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='max-w-2xl mx-auto text-center'>
        {/* Animated 404 */}
        <div className='relative mb-8'>
          <div className='text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse'>
            404
          </div>
          <div className='absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce'></div>
          <div
            className='absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='absolute top-1/2 -right-8 w-4 h-4 bg-green-400 rounded-full animate-bounce'
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>

        {/* Main Content */}
        <div className='space-y-6'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Oops! This job posting seems to have been filled
          </h1>

          <p className='text-xl text-gray-600 leading-relaxed'>
            The page you&apos;re looking for has either been moved, deleted, or
            never existed. Just like that perfect job opportunity that got away!
            🎯
          </p>

          {/* Fun Job-Related Message */}
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg'>
            <div className='flex items-center justify-center space-x-2 mb-3'>
              <Briefcase className='w-6 h-6 text-blue-600' />
              <span className='text-lg font-semibold text-gray-800'>
                App Track Pro Tip
              </span>
            </div>
            <p className='text-gray-700'>
              &ldquo;When one door closes, another opens. But we often look so
              long and so regretfully upon the closed door that we do not see
              the one which has opened for us.&rdquo;
              <br />
              <span className='text-sm text-gray-500 mt-2 block'>
                - Alexander Graham Bell (and probably every career coach ever)
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-6'>
            <Button
              asChild
              size='lg'
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <Link href='/dashboard' className='flex items-center space-x-2'>
                <Home className='w-5 h-5' />
                <span>Back to Dashboard</span>
              </Link>
            </Button>

            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300'
            >
              <Link href='/dashboard' className='flex items-center space-x-2'>
                <ArrowLeft className='w-5 h-5' />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className='mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200'>
            <div className='flex items-center justify-center space-x-2 mb-2'>
              <Search className='w-5 h-5 text-blue-600' />
              <span className='font-medium text-blue-800'>
                Can&apos;t find what you&apos;re looking for?
              </span>
            </div>
            <p className='text-blue-700 text-sm'>
              Try searching for a specific application or company name in your
              dashboard
            </p>
          </div>

          {/* Fun Stats */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8'>
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50'>
              <div className='text-2xl font-bold text-blue-600'>404</div>
              <div className='text-sm text-gray-600'>Pages Not Found</div>
            </div>
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50'>
              <div className='text-2xl font-bold text-green-600'>∞</div>
              <div className='text-sm text-gray-600'>Job Opportunities</div>
            </div>
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50'>
              <div className='text-2xl font-bold text-purple-600'>100%</div>
              <div className='text-sm text-gray-600'>Chance to Bounce Back</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className='fixed top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75'></div>
        <div
          className='fixed top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75'
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className='fixed bottom-40 left-20 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='fixed bottom-20 right-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75'
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>
    </div>
  );
}
