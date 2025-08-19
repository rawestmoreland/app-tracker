import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';

import { notFound } from 'next/navigation';
import ApplicationContent from './components/application-content';
import { User } from '@prisma/client';

const fetchCompanies = async () => {
  const companies = await prisma.company.findMany();

  return companies;
};

const fetchApplication = async (dbUser: User, id: string) => {
  const application = await prisma.application.findUnique({
    where: { id, userId: dbUser.id },
    include: {
      company: true,
      interviews: {
        include: {
          contacts: true,
          notes: true,
        },
      },
      notes: true,
      events: {
        orderBy: {
          occurredAt: 'desc',
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return application;
};

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dbUser } = await getSignedInUser();

  if (!id || !dbUser) {
    notFound();
  }

  const applicationPromise = fetchApplication(dbUser, id);
  const companiesPromise = fetchCompanies();

  const [application, companies] = await Promise.all([
    applicationPromise,
    companiesPromise,
  ]);

  return <ApplicationContent application={application} companies={companies} />;
}
