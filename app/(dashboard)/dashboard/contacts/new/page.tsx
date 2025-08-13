import { Suspense } from 'react';
import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import NewContactContent from './_components/new-contact-content';

async function fetchCompanies() {
  const { dbUser } = await getSignedInUser();
  if (!dbUser) {
    return [];
  }

  const companies = await prisma.company.findMany({
    where: {
      OR: [
        { visibility: 'GLOBAL' },
        { visibility: 'PUBLIC' },
        { createdBy: dbUser.id },
      ],
    },
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

function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded mb-4'></div>
            <div className='space-y-4'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function NewContactPage() {
  const companies = await fetchCompanies();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewContactContent companies={companies} />
    </Suspense>
  );
}
