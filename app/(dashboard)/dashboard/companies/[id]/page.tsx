/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound, unauthorized } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { CompanyEditForm, CompanyDeleteButton } from './components';
import { formatDate } from '@/lib/dates';
import { getCompanySizeLabel, getStatusColor } from '@/lib/utils';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSignedInUser } from '@/app/lib/auth';

// Type for the Prisma result
type PrismaCompany = {
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
interface Company {
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
    <div className='container mx-auto px-4 py-8'>
      {/* Breadcrumb */}
      <Breadcrumb className='mb-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard/companies'>Companies</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className='flex justify-between items-start mb-8'>
        <div>
          <div className='flex items-center gap-4 mb-2'>
            <h1 className='text-3xl font-bold text-gray-900'>{company.name}</h1>
            {company.logo && (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                width={48}
                height={48}
                className='w-12 h-12 rounded-lg object-cover'
              />
            )}
          </div>
          <div className='flex items-center gap-4 text-gray-600'>
            {company.website && (
              <a
                href={company.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800'
              >
                {company.website}
              </a>
            )}
            {company.location && <span>{company.location}</span>}
            {company.industry && (
              <span className='bg-gray-100 px-2 py-1 rounded text-sm'>
                {company.industry}
              </span>
            )}
          </div>
        </div>
        {dbUser.role === UserRole.ADMIN && (
          <div className='flex gap-2'>
            <CompanyEditForm company={company} />
            <CompanyDeleteButton companyId={company.id} />
          </div>
        )}
      </div>

      {/* Company Information */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
        <div className='lg:col-span-2'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold mb-4'>Company Information</h2>
            <div className='space-y-4'>
              {company.description && (
                <div>
                  <h3 className='font-medium text-gray-900 mb-2'>
                    Description
                  </h3>
                  <p className='text-gray-600'>{company.description}</p>
                </div>
              )}
              <div className='grid grid-cols-2 gap-4'>
                {company.size && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-1'>
                      Company Size
                    </h3>
                    <p className='text-gray-600'>
                      {getCompanySizeLabel(company.size)}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className='font-medium text-gray-900 mb-1'>Created</h3>
                  <p className='text-gray-600'>
                    {formatDate(company.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Quick Stats</h2>
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium text-gray-900 mb-1'>Applications</h3>
              <p className='text-2xl font-bold text-blue-600'>
                {company.applications.length}
              </p>
            </div>
            <div>
              <h3 className='font-medium text-gray-900 mb-1'>Contacts</h3>
              <p className='text-2xl font-bold text-green-600'>
                {company.contacts.length}
              </p>
            </div>
            <div>
              <h3 className='font-medium text-gray-900 mb-1'>Interviews</h3>
              <p className='text-2xl font-bold text-purple-600'>
                {company.applications.reduce(
                  (total, app) => total + app.interviews.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className='bg-white rounded-lg shadow mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Applications</h2>
            <Link href={`/dashboard/applications/new?companyId=${company.id}`}>
              <Button>New Application</Button>
            </Link>
          </div>
        </div>
        {company.applications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Interviews</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/applications/${application.id}`}
                      className='font-medium text-blue-600 hover:text-blue-800'
                    >
                      {application.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(application.appliedAt)}</TableCell>
                  <TableCell>
                    {application.location && (
                      <div>
                        <span>{application.location}</span>
                        {application.remote && (
                          <span className='text-gray-500 ml-1'>
                            ({application.remote.replace('_', ' ')})
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{application.interviews.length}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/applications/${application.id}`}>
                      <Button variant='outline' size='sm'>
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='p-6 text-center text-gray-500'>
            No applications yet.
            <Link
              href='/dashboard/applications/new'
              className='text-blue-600 hover:text-blue-800 ml-1'
            >
              Create your first application
            </Link>
          </div>
        )}
      </div>

      {/* Contacts */}
      <div className='bg-white rounded-lg shadow'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>Contacts</h2>
            <Link href='/contacts/new'>
              <Button>New Contact</Button>
            </Link>
          </div>
        </div>
        {company.contacts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>LinkedIn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {company.contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className='font-medium'>{contact.name}</TableCell>
                  <TableCell>{contact.title || '-'}</TableCell>
                  <TableCell>
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {contact.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className='text-blue-600 hover:text-blue-800'
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.linkedin ? (
                      <a
                        href={contact.linkedin}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800'
                      >
                        View Profile
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='p-6 text-center text-gray-500'>
            No contacts yet.
            <Link
              href='/contacts/new'
              className='text-blue-600 hover:text-blue-800 ml-1'
            >
              Add your first contact
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
