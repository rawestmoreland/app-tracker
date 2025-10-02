import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionClaims } = await auth();

  if (
    (sessionClaims?.metadata as { onboardingComplete: boolean })
      ?.onboardingComplete
  ) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
