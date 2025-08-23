import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { R2Service } from '@/lib/r2';
import { getSignedInUser } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const routeParams = await params;

    // Get the resume and verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: routeParams.id,
        userId: dbUser.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Generate download URL
    const downloadUrl = await R2Service.generateDownloadUrl(resume.url);

    return NextResponse.json({
      downloadUrl,
      filename: resume.name,
      key: resume.url,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 },
    );
  }
}
