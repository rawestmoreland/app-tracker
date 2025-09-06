import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const oneApp = await prisma.application.findFirst({
      where: {
        title: {
          not: {},
        },
      },
      take: 1,
    });

    if (!oneApp) {
      return NextResponse.json(
        {
          status: 'healthy',
          database: 'error',
          message: 'No application found',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { status: 'healthy', database: 'connected' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
