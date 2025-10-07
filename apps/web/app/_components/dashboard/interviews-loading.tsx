'use client';

import { cn } from '@/lib/utils';
import { Calendar, Video, Users } from 'lucide-react';

export default function InterviewsLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 space-y-6',
        className
      )}
    >
      {/* Animated icons */}
      <div className='relative flex items-center space-x-4'>
        <div className='animate-bounce [animation-delay:-0.3s]'>
          <Calendar className='w-12 h-12 text-blue-600' />
        </div>
        <div className='animate-bounce [animation-delay:-0.15s]'>
          <Video className='w-12 h-12 text-purple-600' />
        </div>
        <div className='animate-bounce'>
          <Users className='w-12 h-12 text-green-600' />
        </div>
      </div>

      {/* Loading text */}
      <div className='text-center space-y-2'>
        <h3 className='text-xl font-semibold text-gray-900 animate-pulse'>
          Loading your interviews...
        </h3>
        <div className='flex items-center justify-center space-x-1'>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-green-600 rounded-full animate-bounce'></div>
        </div>
        <p className='text-gray-500 animate-pulse'>
          Preparing your interview schedule
        </p>
      </div>

      {/* Progress bar */}
      <div className='w-64 bg-gray-200 rounded-full h-2 overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full animate-pulse'></div>
      </div>
    </div>
  );
}
