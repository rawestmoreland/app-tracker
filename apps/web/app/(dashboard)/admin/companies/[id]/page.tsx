import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { notFound, unauthorized } from 'next/navigation';
import { AdminCompanyEditForm } from './_components/admin-company-edit-form';

export interface AdminCompany {
  id: string;
  name: string;
  website?: string;
  description?: string;
  plainTextDescription?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  isGlobal?: boolean;
  createdBy?: string | null;
}

async function fetchCompany(id: string): Promise<AdminCompany | null> {
  try {
    const prismaCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!prismaCompany) {
      return null;
    }

    return {
      id: prismaCompany.id,
      name: prismaCompany.name,
      website: prismaCompany.website || undefined,
      description: prismaCompany.description || undefined,
      plainTextDescription: prismaCompany.plainTextDescription || undefined,
      industry: prismaCompany.industry || undefined,
      size: prismaCompany.size || undefined,
      location: prismaCompany.location || undefined,
      logo: prismaCompany.logo || undefined,
      createdAt: prismaCompany.createdAt.toISOString(),
      updatedAt: prismaCompany.updatedAt.toISOString(),
      applicationCount: prismaCompany._count.applications,
      isGlobal: prismaCompany.isGlobal || false,
      createdBy: prismaCompany.createdBy || undefined,
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await fetchCompany(id);
  return {
    title: `${company?.name} - Admin - Job Tracker`,
    description: `Admin view for ${company?.name}`,
  };
}

export default async function AdminCompanyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    return unauthorized();
  }

  const { id } = await params;

  const company = await fetchCompany(id);

  if (!company) {
    return notFound();
  }

  return <AdminCompanyEditForm company={company} />;
}
