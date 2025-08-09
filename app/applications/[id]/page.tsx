import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import ApplicationContent from './components/application-content';
import { notFound } from 'next/navigation';

const fetchCompanies = async () => {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  const companies = await prisma.company.findMany();

  return companies;
};

const fetchApplication = async (id: string) => {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

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
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  return application;
};

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const applicationPromise = fetchApplication(id);
  const companiesPromise = fetchCompanies();

  const [application, companies] = await Promise.all([
    applicationPromise,
    companiesPromise,
  ]);

  return <ApplicationContent application={application} companies={companies} />;
}
