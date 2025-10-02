'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Globe,
  MapPin,
  Users,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Shield,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServerFacetedFilter } from '@/components/ui/server-faceted-filter';
import { companyTypeOptions } from '@/lib/filter-options';
import Link from 'next/link';
import Image from 'next/image';

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

const sizeLabels = {
  STARTUP: 'Startup',
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large',
  ENTERPRISE: 'Enterprise',
} as const;

const sizeColors = {
  STARTUP: 'bg-blue-100 text-blue-800',
  SMALL: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LARGE: 'bg-orange-100 text-orange-800',
  ENTERPRISE: 'bg-purple-100 text-purple-800',
} as const;

interface AdminCompaniesTableProps {
  companies: AdminCompany[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  initialSearch: string;
  initialCompanyType: string[];
}

export function AdminCompaniesTable({
  companies,
  totalCount,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  initialSearch,
  initialCompanyType,
}: AdminCompaniesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [companyTypeFilter, setCompanyTypeFilter] =
    useState<string[]>(initialCompanyType);
  const previousSearchInput = useRef(initialSearch);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const updateSearchUrl = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const updateCompanyTypeFilter = useCallback(
    (values: string[]) => {
      const params = new URLSearchParams(searchParams);
      if (values.length > 0) {
        params.set('type', values.join(','));
      } else {
        params.delete('type');
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  useEffect(() => {
    if (initialSearch !== previousSearchInput.current) {
      setSearchInput(initialSearch);
      previousSearchInput.current = initialSearch;
    }
  }, [initialSearch]);

  useEffect(() => {
    setCompanyTypeFilter(initialCompanyType);
  }, [initialCompanyType]);

  useEffect(() => {
    if (searchInput === previousSearchInput.current) {
      return;
    }

    previousSearchInput.current = searchInput;

    const timeoutId = setTimeout(() => {
      updateSearchUrl(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, updateSearchUrl]);

  const columnHelper = createColumnHelper<AdminCompany>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Company',
      cell: (info) => {
        const company = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <Link href={`/admin/companies/${company.id}`} className="text-2xl">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  🏢
                </div>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/companies/${company.id}`}
                  className="font-medium"
                >
                  {company.name}
                </Link>
                {company.isGlobal && (
                  <span
                    className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
                    title="Global Company"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    Global
                  </span>
                )}
              </div>
              <div className="text-muted-foreground text-sm">
                {company.industry || '—'}
              </div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => {
        const description = info.getValue();
        return (
          <div className="max-w-[300px] truncate" title={description || ''}>
            {description ? (
              <div className="truncate">
                {description.replace(/<[^>]*>/g, '').trim()}
              </div>
            ) : (
              '—'
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('size', {
      header: 'Size',
      cell: (info) => {
        const size = info.getValue();
        if (!size) return <span className="text-muted-foreground">—</span>;

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              sizeColors[size as keyof typeof sizeColors]
            }`}
          >
            <Users className="mr-1 h-3 w-3" />
            {sizeLabels[size as keyof typeof sizeLabels]}
          </span>
        );
      },
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => {
        const location = info.getValue();
        if (!location) return <span className="text-muted-foreground">—</span>;

        return (
          <div className="flex items-center gap-1">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <span>{location}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('website', {
      header: 'Website',
      cell: (info) => {
        const website = info.getValue();
        return website ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-1 h-4 w-4" />
              Visit
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    }),
    columnHelper.accessor('applicationCount', {
      header: 'Applications',
      cell: (info) => (
        <div className="flex items-center gap-1">
          <TrendingUp className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
        >
          Added
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: (info) => {
        const date = info.getValue();
        return (
          <div className="flex items-center gap-1">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.createdAt).getTime();
        const dateB = new Date(rowB.original.createdAt).getTime();
        return dateA - dateB;
      },
    }),
  ];

  const table = useReactTable({
    data: companies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualFiltering: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">
          Manage all companies in the system (both global and user-specific)
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <ServerFacetedFilter
            title="Company Type"
            options={companyTypeOptions}
            selectedValues={companyTypeFilter}
            onSelectionChange={(values) => {
              setCompanyTypeFilter(values);
              updateCompanyTypeFilter(values);
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Filter className="h-4 w-4 md:mr-2" />
                <span className="sr-only md:not-sr-only">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">
                      No companies found.
                    </span>
                    <span className="text-muted-foreground">
                      Companies will appear here as users create applications.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm">
            Showing {(currentPage - 1) * 10 + 1} to{' '}
            {Math.min(currentPage * 10, totalCount)} of {totalCount} companies
            {initialSearch && ` matching "${initialSearch}"`}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
