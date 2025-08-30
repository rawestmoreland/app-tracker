import { prisma } from '@/lib/prisma';
import { createClerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Test User cleanup started');

  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });

  const testUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: '_e2e',
      },
    },
  });

  if (testUsers.length > 0) {
    for await (const user of testUsers) {
      try {
        await prisma.user.delete({
          where: { id: user.id },
        });
      } catch (error) {
        console.error('Error deleting test user:', error);
      }
    }
  }

  const clerkUsers = await clerk.users.getUserList({ query: '_e2e' });

  console.log(`Found ${clerkUsers.data.length} test users in Clerk`);

  for await (const user of clerkUsers.data) {
    try {
      await clerk.users.deleteUser(user.id);
    } catch (error) {
      console.error('Error deleting test user:', error);
    }
  }

  return NextResponse.json({ message: 'Test User cleanup ended' });
}
