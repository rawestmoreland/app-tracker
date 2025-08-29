import { prisma } from '@/lib/prisma';
import { createClerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST({ request }: { request: NextRequest }) {
  console.log('Test User cleanup started');

  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });

  const body = await request.json();
  const { userEmail } = body;

  if (!userEmail) {
    return NextResponse.json(
      { error: 'User email is required' },
      { status: 400 },
    );
  }

  const user = await prisma.user.delete({
    where: { email: userEmail },
    select: {
      id: true,
      clerkId: true,
    },
  });

  await clerk.users.deleteUser(user.clerkId);

  return NextResponse.json({ message: 'Test User cleanup ended' });
}
