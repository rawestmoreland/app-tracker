import { notFound, unauthorized } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Note, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSignedInUser } from '@/app/lib/auth';
import { CompanyContent } from './components/company-content';

// Type for the Prisma result
export type PrismaCompany = {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
  applications: Array<{
    id: string;
    title: string;
    status: string;
    appliedAt: Date;
    location: string | null;
    remote: string | null;
    lowSalary: number | null;
    highSalary: number | null;
    currency: string | null;
    interviews: Array<{
      id: string;
      type: string;
      format: string;
      scheduledAt: Date | null;
      outcome: string | null;
    }>;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    title: string | null;
    linkedin: string | null;
    notes: string | null;
  }>;
};

// Type for the component interface (matching CompanyEditForm expectations)
export interface Company {
  id: string;
  name: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  applications: Array<{
    id: string;
    title: string;
    status: string;
    appliedAt: string;
    location?: string;
    remote?: string;
    lowSalary?: number;
    highSalary?: number;
    currency?: string;
    interviews: Array<{
      id: string;
      type: string;
      format: string;
      scheduledAt?: string;
      outcome?: string;
    }>;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    title?: string;
    linkedin?: string;
    notes?: string;
  }>;
}

function convertPrismaCompanyToCompany(prismaCompany: PrismaCompany): Company {
  return {
    id: prismaCompany.id,
    name: prismaCompany.name,
    website: prismaCompany.website || undefined,
    description: prismaCompany.description || undefined,
    industry: prismaCompany.industry || undefined,
    size: prismaCompany.size || undefined,
    location: prismaCompany.location || undefined,
    logo: prismaCompany.logo || undefined,
    createdAt: prismaCompany.createdAt.toISOString(),
    updatedAt: prismaCompany.updatedAt.toISOString(),
    notes: prismaCompany.notes,
    applications: prismaCompany.applications.map((app) => ({
      id: app.id,
      title: app.title,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      location: app.location || undefined,
      remote: app.remote || undefined,
      lowSalary: app.lowSalary || undefined,
      highSalary: app.highSalary || undefined,
      currency: app.currency || 'USD',
      interviews: app.interviews.map((interview) => ({
        id: interview.id,
        type: interview.type,
        format: interview.format,
        scheduledAt: interview.scheduledAt?.toISOString(),
        outcome: interview.outcome || undefined,
      })),
    })),
    contacts: prismaCompany.contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email || undefined,
      phone: contact.phone || undefined,
      title: contact.title || undefined,
      linkedin: contact.linkedin || undefined,
      notes: contact.notes || undefined,
    })),
  };
}

async function fetchCompany(id: string): Promise<Company | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return null;
    }

    const prismaCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        notes: true,
        applications: {
          where: { userId: dbUser.id },
          include: {
            interviews: {
              include: {
                contacts: true,
                notes: true,
              },
            },
            notes: true,
          },
          orderBy: { appliedAt: 'desc' },
        },
        contacts: {
          where: { userId: dbUser.id },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!prismaCompany) {
      return null;
    }

    return convertPrismaCompanyToCompany(prismaCompany);
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetail({ params }: PageProps) {
  const { id } = await params;
  const company = await fetchCompany(id);
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    unauthorized();
  }

  if (!company) {
    notFound();
  }

  return (
    <CompanyContent
      company={company}
      isAdmin={dbUser.role === UserRole.ADMIN}
    />
  );
}
