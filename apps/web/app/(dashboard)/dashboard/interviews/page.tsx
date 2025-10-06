import { getSignedInUser } from '@/app/lib/auth';
import { getInterviews } from '@/lib/actions/interview-actions';
import InterviewsPageContent from '@/app/_components/dashboard/interviews-page-content';

export default async function InterviewsPage() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return <div>Unauthorized</div>;
  }

  const interviews = await getInterviews();

  return <InterviewsPageContent interviews={interviews} />;
}
