import { getSignedInUser } from '@/app/lib/auth';
import { UserRole } from '@prisma/client';
import { unauthorized } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    unauthorized();
  }

  return <div>{children}</div>;
}
