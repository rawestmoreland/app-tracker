import { Suspense } from 'react';
import { getSignedInUser } from '@/app/lib/auth';
import { getInterviews } from '@/lib/actions/interview-actions';
import InterviewsPageContent from '@/app/_components/dashboard/interviews-page-content';
import { unauthorized } from 'next/navigation';
import InterviewsLoading from '@/app/_components/dashboard/interviews-loading';

async function InterviewsContent() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    unauthorized();
  }

  const interviews = await getInterviews();

  return <InterviewsPageContent interviews={interviews} />;
}

export default function InterviewsPage() {
  return (
    <Suspense fallback={<InterviewsLoading />}>
      <InterviewsContent />
    </Suspense>
  );
}
