import { Suspense } from 'react';
import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import NewContactContent from './_components/new-contact-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Track - New Contact',
  description: 'Create a new contact for a company',
};

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="animate-pulse">
            <div className="mb-4 h-8 rounded bg-gray-200"></div>
            <div className="space-y-4">
              <div className="h-4 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
              <div className="h-4 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function NewContactPage() {
  const companies = await fetchCompanies();

  const uniqueContacts =
    companies?.flatMap((company) => company.contacts) ?? [];

  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewContactContent
        companies={companies}
        uniqueContacts={uniqueContacts}
      />
    </Suspense>
  );
}
