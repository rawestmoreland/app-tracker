import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { CompanyVisibility } from '@prisma/client';

export async function GET() {
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

    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { visibility: 'GLOBAL' },
          { visibility: 'PUBLIC' },
          { createdBy: dbUser.id },
        ],
      },
      include: {
        applications: {
          where: { userId: dbUser.id },
        },
        contacts: {
          where: { userId: dbUser.id },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

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
    const {
      name,
      website,
      description,
      industry,
      size,
      location,
      logo,
      visibility = 'PRIVATE',
      isGlobal = false,
      useExistingCompanyId,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // If user wants to use an existing company, return that company
    if (useExistingCompanyId) {
      const existingCompany = await prisma.company.findUnique({
        where: { id: useExistingCompanyId },
      });

      if (!existingCompany) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(existingCompany);
    }

    // Determine visibility and global status based on user role and preferences
    let finalVisibility = visibility as CompanyVisibility;
    let finalIsGlobal = isGlobal;

    // Admin users can create global companies
    if (dbUser.role === 'ADMIN' && isGlobal) {
      finalVisibility = 'GLOBAL';
      finalIsGlobal = true;
    } else if (dbUser.role === 'ADMIN' && visibility === 'PUBLIC') {
      finalVisibility = 'PUBLIC';
      finalIsGlobal = false;
    } else {
      // Regular users can only create private companies
      finalVisibility = 'PRIVATE';
      finalIsGlobal = false;
    }

    // Check for duplicates only if creating a PUBLIC or GLOBAL company
    if (finalVisibility === 'PUBLIC' || finalVisibility === 'GLOBAL') {
      const exactDuplicate = await prisma.company.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          OR: [{ visibility: 'GLOBAL' }, { visibility: 'PUBLIC' }],
        },
      });

      if (exactDuplicate) {
        return NextResponse.json(
          {
            error:
              'A company with this name already exists in the public database. Please use the existing company or create a private company instead.',
            existingCompany: exactDuplicate,
            isPublicDuplicate: true,
          },
          { status: 409 }
        );
      }
    }

    const company = await prisma.company.create({
      data: {
        name,
        website,
        description,
        industry,
        size,
        location,
        logo,
        visibility: finalVisibility,
        isGlobal: finalIsGlobal,
        createdBy: dbUser.id,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
