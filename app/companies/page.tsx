import { prisma } from '@/lib/prisma';
import { CompaniesTable } from './components/companies-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSignedInUser } from '../lib/auth';

async function fetchCompanies() {
  const { dbUser } = await getSignedInUser();

  const companies = await prisma.company.findMany({
    where: {
      OR: [
        {
          applications: {
            some: {
              userId: dbUser.id,
            },
          },
        },
        {
          creator: {
            id: dbUser.id,
          },
        },
      ],
    },
    include: {
      applications: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return companies.map((company) => ({
    id: company.id,
    name: company.name,
    website: company.website,
    description: company.description,
    industry: company.industry,
    size: company.size,
    location: company.location,
    logo: company.logo,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    applicationCount: company.applications.length,
  }));
}

export default async function CompaniesPage() {
  const companies = await fetchCompanies();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Companies</h1>
          <p className='text-muted-foreground'>
            Manage and track all the companies you&apos;re interested in
          </p>
        </div>
        {/* <Button asChild>
          <Link href='/companies/new'>
            <div className='w-4 h-4 mr-2'>🏢</div>
            Add Company
          </Link>
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-blue-500'>🏢</div>
            <span className='text-sm font-medium text-muted-foreground'>
              Total Companies
            </span>
          </div>
          <p className='text-2xl font-bold'>{companies.length}</p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-green-500'>📈</div>
            <span className='text-sm font-medium text-muted-foreground'>
              Total Applications
            </span>
          </div>
          <p className='text-2xl font-bold'>
            {companies.reduce(
              (sum, company) => sum + company.applicationCount,
              0
            )}
          </p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-purple-500'>👥</div>
            <span className='text-sm font-medium text-muted-foreground'>
              Large Companies
            </span>
          </div>
          <p className='text-2xl font-bold'>
            {
              companies.filter(
                (c) => c.size === 'LARGE' || c.size === 'ENTERPRISE'
              ).length
            }
          </p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-orange-500'>🌐</div>
            <span className='text-sm font-medium text-muted-foreground'>
              With Websites
            </span>
          </div>
          <p className='text-2xl font-bold'>
            {companies.filter((c) => c.website).length}
          </p>
        </div>
      </div>

      {/* Companies Table */}
      <CompaniesTable companies={companies} />
    </div>
  );
}
