'use client';

import { AdminCompaniesTable } from './admin-companies-table';

type AdminCompany = {
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
  applicationCount: number;
  isGlobal?: boolean;
  userId?: string | null;
};

interface CompaniesContentProps {
  companies: AdminCompany[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  initialSearch: string;
  initialCompanyType: string[];
}

export function CompaniesContent({
  companies,
  totalCount,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  initialSearch,
  initialCompanyType,
}: CompaniesContentProps) {
  return (
    <AdminCompaniesTable
      companies={companies}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      initialSearch={initialSearch}
      initialCompanyType={initialCompanyType}
    />
  );
}
