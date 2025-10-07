'use client';

import { Calendar, Video, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function InterviewsEmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
      {/* Fun illustration */}
      <div className='relative mb-8'>
        <div className='flex items-center justify-center space-x-2'>
          <div className='animate-bounce [animation-delay:-0.3s]'>
            <Calendar className='w-16 h-16 text-blue-400 opacity-50' />
          </div>
          <div className='animate-bounce [animation-delay:-0.15s]'>
            <Video className='w-20 h-20 text-purple-500' />
          </div>
          <div className='animate-bounce'>
            <Trophy className='w-16 h-16 text-yellow-400 opacity-50' />
          </div>
        </div>

        {/* Floating particles */}
        <div className='absolute -top-4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping'></div>
        <div className='absolute -bottom-4 right-1/3 w-2 h-2 bg-purple-500 rounded-full animate-pulse [animation-delay:-0.5s]'></div>
      </div>

      {/* Message */}
      <div className='space-y-4 max-w-md'>
        <h2 className='text-3xl font-bold text-gray-900'>
          No interviews yet!
        </h2>
        <p className='text-lg text-gray-600'>
          Your interview schedule is empty. Once you start getting interview invitations, they'll appear here.
        </p>
        <p className='text-sm text-gray-500'>
          Keep applying and your calendar will fill up in no time! 🚀
        </p>

        {/* Call to action */}
        <div className='pt-4'>
          <Link href='/dashboard'>
            <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='mt-12 flex items-center space-x-8 opacity-30'>
        <div className='text-6xl animate-pulse [animation-delay:-0.2s]'>📅</div>
        <div className='text-6xl animate-pulse [animation-delay:-0.4s]'>💼</div>
        <div className='text-6xl animate-pulse [animation-delay:-0.6s]'>🎯</div>
      </div>
    </div>
  );
}
