import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { validateFile } from '@/lib/file-validation';
import { R2Service } from '@/lib/r2';
import { LogoUploadService } from '@/lib/services/logo-upload';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    if (dbUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      website,
      description,
      plainTextDescription,
      industry,
      size,
      location,
      logo,
      isGlobal,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 },
      );
    }

    // Upload company logo to our R2 bucket
    let filename = null;
    if (logo) {
      const result = await LogoUploadService.uploadLogo(
        logo,
        process.env.R2_LOGO_BUCKET_NAME!,
        name,
      );
      if (result.success) {
        filename = result.filename;
      }
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        website: website || null,
        description: description || null,
        plainTextDescription: plainTextDescription || null,
        industry: industry || null,
        size: size || null,
        location: location || null,
        logo:
          `${process.env.R2_COMPANY_LOGO_BASE_URL}/${filename}` || logo || null,
        isGlobal: isGlobal || false,
        visibility: isGlobal ? 'GLOBAL' : 'PRIVATE',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    if (dbUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if there are any applications linked to this company
    const applicationCount = await prisma.application.count({
      where: { companyId: id },
    });

    if (applicationCount > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete company with existing applications. Please delete all applications first.',
        },
        { status: 400 },
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 },
    );
  }
}
