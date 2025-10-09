import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InterviewDetails from './components/interview-details';

const fetchInterview = async (id: string) => {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  const interview = await prisma.interview.findUnique({
    where: {
      id,
      userId: dbUser.id,
      archived: false,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      application: {
        include: {
          company: true,
        },
      },
      interviewContacts: {
        include: {
          contact: true,
        },
      },
    },
  });

  if (!interview) {
    return notFound();
  }

  return interview;
};

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const interview = await fetchInterview(id);

  return <InterviewDetails interview={interview} />;
}
