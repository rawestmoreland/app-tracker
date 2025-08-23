import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { R2Service } from '@/lib/r2';
import {
  validateFile,
  generateSecureFilename,
  sanitizeFilename,
} from '@/lib/file-validation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const routeParams = await params;

    // Check if this is a file upload or a presigned URL request
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 },
        );
      }

      // Verify the application exists and belongs to the user
      const application = await prisma.application.findFirst({
        where: {
          id: routeParams.id,
          userId: dbUser.id,
        },
      });

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 },
        );
      }

      // Convert file to buffer for validation
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validate the file
      const validationResult = await validateFile(buffer, file.name);
      if (!validationResult.isValid) {
        return NextResponse.json(
          { error: validationResult.error },
          { status: 400 },
        );
      }

      // Generate secure filename and sanitize original for storage
      const secureFilename = generateSecureFilename(file.name);
      const sanitizedOriginalName = sanitizeFilename(file.name);
      const key = `${dbUser.id}/${routeParams.id}/${secureFilename}`;

      // Upload file to R2 using detected MIME type for accuracy
      await R2Service.uploadFile(
        key,
        buffer,
        validationResult.detectedMimeType!,
      );

      // Add resume to the Resume table
      const newResume = await prisma.resume.create({
        data: {
          userId: dbUser.id,
          name: sanitizedOriginalName,
          url: key,
        },
      });

      if (!newResume) {
        // Delete the file from R2
        await R2Service.deleteFile(key);

        return NextResponse.json(
          { error: 'Failed to create resume' },
          { status: 500 },
        );
      }

      // Update application with resume info
      await prisma.application.update({
        where: { id: routeParams.id },
        data: {
          resumeId: newResume.id,
        },
      });

      return NextResponse.json({
        success: true,
        key,
        filename: sanitizedOriginalName,
        validationInfo: {
          detectedMimeType: validationResult.detectedMimeType,
          detectedExtension: validationResult.detectedExtension,
        },
      });
    } else {
      // Handle presigned URL request (for backward compatibility)
      const { filename, contentType } = await request.json();

      if (!filename || !contentType) {
        return NextResponse.json(
          { error: 'Filename and content type are required' },
          { status: 400 },
        );
      }

      // Validate filename and content type
      const sanitizedFilename = sanitizeFilename(filename);
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedMimeTypes.includes(contentType)) {
        return NextResponse.json(
          { error: `Content type not allowed: ${contentType}` },
          { status: 400 },
        );
      }

      // Verify the application exists and belongs to the user
      const application = await prisma.application.findFirst({
        where: {
          id: routeParams.id,
          userId: dbUser.id,
        },
      });

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 },
        );
      }

      // Generate secure filename for storage
      const secureFilename = generateSecureFilename(sanitizedFilename);

      // Generate upload URL
      const { uploadUrl, key } = await R2Service.generateUploadUrl(
        dbUser.id,
        routeParams.id,
        secureFilename,
        contentType,
      );

      // Create resume in the Resume table
      const newResume = await prisma.resume.create({
        data: {
          userId: dbUser.id,
          name: sanitizedFilename,
          url: key,
        },
      });

      if (!newResume) {
        // Delete the file from R2
        await R2Service.deleteFile(key);

        return NextResponse.json(
          { error: 'Failed to create resume' },
          { status: 500 },
        );
      }

      // Update application with resume info
      await prisma.application.update({
        where: { id: routeParams.id },
        data: {
          resumeId: newResume.id,
        },
      });

      return NextResponse.json({
        uploadUrl,
        key,
        filename: sanitizedFilename,
      });
    }
  } catch (error) {
    console.error('Error handling resume upload:', error);
    return NextResponse.json(
      { error: 'Failed to handle resume upload' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const routeParams = await params;

    // Get the application and verify ownership
    const application = await prisma.application.findFirst({
      where: {
        id: routeParams.id,
        userId: dbUser.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    if (!application.resume) {
      return NextResponse.json(
        { error: 'No resume to delete' },
        { status: 400 },
      );
    }

    // Delete from R2
    await R2Service.deleteFile(application.resume);

    // Update application to remove resume info
    await prisma.application.update({
      where: { id: routeParams.id },
      data: {
        resume: null,
        resumeName: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routeParams = await params;

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the application and verify ownership
    const application = await prisma.application.findFirst({
      where: {
        id: routeParams.id,
        userId: dbUser.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    if (!application.resume) {
      return NextResponse.json({ error: 'No resume found' }, { status: 404 });
    }

    // Generate download URL
    const downloadUrl = await R2Service.generateDownloadUrl(application.resume);

    return NextResponse.json({
      downloadUrl,
      filename: application.resumeName,
      key: application.resume,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 },
    );
  }
}
