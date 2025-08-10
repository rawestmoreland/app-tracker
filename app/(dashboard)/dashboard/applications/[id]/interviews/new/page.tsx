import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NewInterviewContent } from './components/new-interview-content';

async function fetchApplication(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const application = await prisma.application.findUnique({
    where: {
      id,
      userId: dbUser.id,
    },
    include: {
      company: true,
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  return application;
}

export default async function NewInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await fetchApplication(id as string);

  return <NewInterviewContent application={application} />;
}
