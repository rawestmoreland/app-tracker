import { Suspense } from 'react';
import NewCompanyContent from './components/new-company-content';

function NewCompanySkeleton() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <div className='h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse'></div>
          <div className='h-8 bg-gray-200 rounded w-1/2 animate-pulse'></div>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='space-y-4'>
            <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
            <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-1/3 animate-pulse'></div>
            <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
            <div className='h-24 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCompanyPage() {
  return (
    <Suspense fallback={<NewCompanySkeleton />}>
      <NewCompanyContent />
    </Suspense>
  );
}
