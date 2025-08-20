import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import NewApplicationContent from './components/new-application-content';
import { prisma } from '@/lib/prisma';
import { getSignedInUser } from '@/app/lib/auth';

// Loading fallback component for the new application form
function NewApplicationLoading() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <div className='h-4 bg-gray-200 rounded w-32 animate-pulse mb-2'></div>
          <div className='h-8 bg-gray-200 rounded w-64 animate-pulse'></div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='space-y-6'>
            <Loading variant='dots' size='lg' className='py-8' />
            <div className='text-center text-gray-500'>
              Preparing application form...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchCompanies() {
  const { dbUser } = await getSignedInUser();
  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  const companies = await prisma.company.findMany({
    include: {
      applications: {
        where: { userId: dbUser.id },
      },
      contacts: {
        where: { userId: dbUser.id },
      },
    },
  });

  return companies;
}

export default async function NewApplication() {
  const companies = await fetchCompanies();

  return (
    <Suspense fallback={<NewApplicationLoading />}>
      <NewApplicationContent companies={companies} />
    </Suspense>
  );
}
