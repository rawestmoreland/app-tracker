import { prisma } from '@/lib/prisma';
import { CompaniesTable } from './_components/companies-table';
import { getSignedInUser } from '../../../lib/auth';

async function fetchCompanies(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const { dbUser } = await getSignedInUser();
  const skip = (page - 1) * limit;

  let where: object = {
    OR: [
      { visibility: 'GLOBAL' as const },
      { visibility: 'PUBLIC' as const },
      { createdBy: dbUser.id },
    ],
  };

  // Add search functionality
  if (search && search.trim()) {
    where = {
      AND: [
        where,
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { industry: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ],
        },
      ],
    };
  }

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        applications: {
          select: {
            id: true,
          },
          where: {
            userId: dbUser.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.company.count({ where }),
  ]);

  const companiesWithCounts = companies.map((company) => ({
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

  return {
    companies: companiesWithCounts,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPreviousPage: page > 1,
  };
}

async function fetchCompanyStats() {
  const { dbUser } = await getSignedInUser();

  const where = {
    OR: [
      { visibility: 'GLOBAL' as const },
      { visibility: 'PUBLIC' as const },
      { createdBy: dbUser.id },
    ],
  };

  const [totalApplications, largeCompaniesCount, companiesWithWebsites] =
    await Promise.all([
      prisma.application.count({
        where: {
          userId: dbUser.id,
          company: where,
        },
      }),
      prisma.company.count({
        where: {
          ...where,
          size: {
            in: ['LARGE', 'ENTERPRISE'],
          },
        },
      }),
      prisma.company.count({
        where: {
          ...where,
          website: {
            not: null,
          },
        },
      }),
    ]);

  return {
    totalApplications,
    largeCompaniesCount,
    companiesWithWebsites,
  };
}

interface CompaniesPageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || '';

  const [
    {
      companies,
      totalCount,
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
    { totalApplications, largeCompaniesCount, companiesWithWebsites },
  ] = await Promise.all([
    fetchCompanies(page, limit, search),
    fetchCompanyStats(),
  ]);

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
          <Link href='/dashboard/companies/new'>
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
          <p className='text-2xl font-bold'>{totalCount}</p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-green-500'>📈</div>
            <span className='text-sm font-medium text-muted-foreground'>
              Total Applications
            </span>
          </div>
          <p className='text-2xl font-bold'>{totalApplications}</p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-purple-500'>👥</div>
            <span className='text-sm font-medium text-muted-foreground'>
              Large Companies
            </span>
          </div>
          <p className='text-2xl font-bold'>{largeCompaniesCount}</p>
        </div>
        <div className='bg-card border rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 text-orange-500'>🌐</div>
            <span className='text-sm font-medium text-muted-foreground'>
              With Websites
            </span>
          </div>
          <p className='text-2xl font-bold'>{companiesWithWebsites}</p>
        </div>
      </div>

      {/* Companies Table */}
      <CompaniesTable
        companies={companies}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        initialSearch={search}
      />
    </div>
  );
}
