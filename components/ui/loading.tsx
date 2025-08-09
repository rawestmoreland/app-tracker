'use client';

import { cn } from '@/lib/utils';
import { BriefcaseBusinessIcon } from 'lucide-react';

interface LoadingProps {
  className?: string;
  variant?: 'dots' | 'pulse' | 'spin' | 'bounce' | 'typing' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({
  className,
  variant = 'dots',
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (variant === 'dots') {
    return (
      <div
        className={cn('flex items-center justify-center space-x-1', className)}
      >
        <div className='flex space-x-1'>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'></div>
        </div>
        <span className={cn('ml-2 text-gray-600', sizeClasses[size])}>
          Loading...
        </span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className='relative'>
          <div className='w-8 h-8 bg-blue-200 rounded-full animate-ping'></div>
          <div className='absolute top-0 left-0 w-8 h-8 bg-blue-600 rounded-full animate-pulse'></div>
        </div>
        <span className={cn('ml-3 text-gray-600', sizeClasses[size])}>
          Loading...
        </span>
      </div>
    );
  }

  if (variant === 'spin') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className={cn('ml-3 text-gray-600', sizeClasses[size])}>
          Loading...
        </span>
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className='flex space-x-1'>
          <div className='w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-3 h-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-bounce'></div>
        </div>
        <span className={cn('ml-3 text-gray-600', sizeClasses[size])}>
          Loading your dashboard...
        </span>
      </div>
    );
  }

  if (variant === 'typing') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className='flex space-x-1'>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-pulse'></div>
        </div>
        <span
          className={cn('ml-3 text-gray-600 animate-pulse', sizeClasses[size])}
        >
          Preparing your job applications...
        </span>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-6 p-6', className)}>
        {/* Analytics Cards Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-lg shadow p-6 animate-pulse'
            >
              <div className='flex items-center'>
                <div className='p-2 bg-gray-200 rounded-lg w-10 h-10'></div>
                <div className='ml-4 space-y-2'>
                  <div className='h-3 bg-gray-200 rounded w-20'></div>
                  <div className='h-6 bg-gray-200 rounded w-12'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='h-6 bg-gray-200 rounded w-48 animate-pulse'></div>
          </div>
          <div className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='flex items-center space-x-6 animate-pulse'
              >
                <div className='h-4 bg-gray-200 rounded flex-1'></div>
                <div className='h-4 bg-gray-200 rounded w-24'></div>
                <div className='h-4 bg-gray-200 rounded w-16'></div>
                <div className='h-4 bg-gray-200 rounded w-20'></div>
                <div className='h-4 bg-gray-200 rounded w-12'></div>
                <div className='h-4 bg-gray-200 rounded w-12'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Job-specific animated loading component
export function JobTrackerLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 space-y-6',
        className
      )}
    >
      {/* Animated briefcase icon */}
      <div className='relative'>
        <div className='animate-bounce'>
          <BriefcaseBusinessIcon className='w-16 h-16 text-blue-600' />
        </div>
        {/* Floating dots around the briefcase */}
        <div className='absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-ping'></div>
        <div className='absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse [animation-delay:-0.5s]'></div>
        <div className='absolute top-1/2 -right-4 w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.2s]'></div>
      </div>

      {/* Loading text with typewriter effect */}
      <div className='text-center space-y-2'>
        <h3 className='text-xl font-semibold text-gray-900 animate-pulse'>
          Getting your applications ready...
        </h3>
        <div className='flex items-center justify-center space-x-1'>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'></div>
        </div>
        <p className='text-gray-500 animate-pulse'>
          Loading your career journey dashboard
        </p>
      </div>

      {/* Progress bar */}
      <div className='w-64 bg-gray-200 rounded-full h-2 overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse'></div>
      </div>
    </div>
  );
}

// Fun motivational loading messages
export function MotivationalLoading({ className }: { className?: string }) {
  const messages = [
    'Polishing your applications... ✨',
    'Counting those interview opportunities... 📊',
    'Organizing your career progress... 📈',
    'Preparing your success dashboard... 🎯',
    'Loading your bright future... 🌟',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 space-y-6',
        className
      )}
    >
      {/* Animated rocket */}
      <div className='relative'>
        <div className='animate-bounce'>
          <div className='text-6xl'>🚀</div>
        </div>
        {/* Trail effect */}
        <div className='absolute left-1/2 top-full transform -translate-x-1/2'>
          <div className='flex flex-col items-center space-y-1'>
            <div className='w-1 h-6 bg-gradient-to-t from-orange-500 to-transparent animate-pulse'></div>
            <div className='w-2 h-4 bg-gradient-to-t from-yellow-500 to-transparent animate-pulse [animation-delay:-0.2s]'></div>
            <div className='w-3 h-3 bg-gradient-to-t from-red-500 to-transparent animate-pulse [animation-delay:-0.4s]'></div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className='text-center space-y-3'>
        <h2 className='text-2xl font-bold text-gray-900'>{randomMessage}</h2>
        <div className='flex justify-center space-x-1'>
          <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='w-2 h-2 bg-pink-500 rounded-full animate-bounce'></div>
        </div>
      </div>
    </div>
  );
}
