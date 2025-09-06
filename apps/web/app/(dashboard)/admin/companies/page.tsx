import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import { CompaniesContent } from './_components/companies-content';

interface SearchParams {
  page?: string;
  search?: string;
  type?: string;
}

interface AdminCompaniesPageProps {
  searchParams: Promise<SearchParams>;
}

async function fetchAllCompanies({
  page = 1,
  search = '',
  companyTypes = [],
  limit = 30,
}: {
  page?: number;
  search?: string;
  companyTypes?: string[];
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  // Build where clause
  const whereConditions: any[] = [];

  // Search filter
  if (search.trim()) {
    whereConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { industry: { contains: search, mode: 'insensitive' as const } },
        { location: { contains: search, mode: 'insensitive' as const } },
      ],
    });
  }

  // Company type filter
  if (companyTypes.length > 0) {
    const typeConditions: any[] = [];
    if (companyTypes.includes('global')) {
      typeConditions.push({ isGlobal: true });
    }
    if (companyTypes.includes('private')) {
      typeConditions.push({ isGlobal: { not: true } });
    }
    if (typeConditions.length > 0) {
      whereConditions.push({ OR: typeConditions });
    }
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ]);

  const companiesWithApplicationCount = companies.map((company) => ({
    ...company,
    applicationCount: company._count.applications,
  }));

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    companies: companiesWithApplicationCount,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}

export default async function AdminCompaniesPage({
  searchParams,
}: AdminCompaniesPageProps) {
  const { dbUser } = await getSignedInUser();
  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    return unauthorized();
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const companyTypes = resolvedSearchParams.type
    ? resolvedSearchParams.type.split(',')
    : [];

  const {
    companies,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await fetchAllCompanies({ page, search, companyTypes });

  return (
    <CompaniesContent
      companies={companies}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      initialSearch={search}
      initialCompanyType={companyTypes}
    />
  );
}
