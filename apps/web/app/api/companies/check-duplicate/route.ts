import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Check for existing companies with similar names
    const existingCompanies = await prisma.company.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  equals: name,
                  mode: 'insensitive',
                },
              },
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            OR: [
              { visibility: 'GLOBAL' },
              { visibility: 'PUBLIC' },
              { createdBy: dbUser.id },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        website: true,
        industry: true,
        location: true,
        visibility: true,
        isGlobal: true,
      },
      take: 5,
    });

    // Separate public and private duplicates
    const publicDuplicates = existingCompanies.filter(
      (company) =>
        company.visibility === 'PUBLIC' || company.visibility === 'GLOBAL'
    );
    const privateDuplicates = existingCompanies.filter(
      (company) => company.visibility === 'PRIVATE'
    );

    return NextResponse.json({
      hasDuplicates: existingCompanies.length > 0,
      duplicates: existingCompanies,
      publicDuplicates,
      privateDuplicates,
      hasPublicDuplicates: publicDuplicates.length > 0,
      hasPrivateDuplicates: privateDuplicates.length > 0,
    });
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return NextResponse.json(
      { error: 'Failed to check for duplicates' },
      { status: 500 }
    );
  }
}
