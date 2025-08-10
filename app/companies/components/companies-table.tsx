'use client';

import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import Link from 'next/link';
import Image from 'next/image';

type Company = {
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

interface CompaniesTableProps {
  companies: Company[];
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper<Company>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Company',
      cell: (info) => {
        const company = info.row.original;
        return (
          <div className='flex items-center gap-3'>
            <Link href={`/companies/${company.id}`} className='text-2xl'>
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={48}
                  height={48}
                  className='rounded-full'
                />
              ) : (
                <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                  🏢
                </div>
              )}
            </Link>
            <div>
              <div className='font-medium'>{company.name}</div>
              <div className='text-sm text-muted-foreground'>
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
          <div className='max-w-[300px] truncate' title={description || ''}>
            {description || '—'}
          </div>
        );
      },
    }),
    columnHelper.accessor('size', {
      header: 'Size',
      cell: (info) => {
        const size = info.getValue();
        if (!size) return <span className='text-muted-foreground'>—</span>;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              sizeColors[size as keyof typeof sizeColors]
            }`}
          >
            <Users className='w-3 h-3 mr-1' />
            {sizeLabels[size as keyof typeof sizeLabels]}
          </span>
        );
      },
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => {
        const location = info.getValue();
        if (!location) return <span className='text-muted-foreground'>—</span>;

        return (
          <div className='flex items-center gap-1'>
            <MapPin className='w-4 h-4 text-muted-foreground' />
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
          <Button variant='ghost' size='sm' asChild>
            <a href={website} target='_blank' rel='noopener noreferrer'>
              <Globe className='w-4 h-4 mr-1' />
              Visit
            </a>
          </Button>
        ) : (
          <span className='text-muted-foreground'>—</span>
        );
      },
    }),
    columnHelper.accessor('applicationCount', {
      header: 'Applications',
      cell: (info) => (
        <div className='flex items-center gap-1'>
          <TrendingUp className='w-4 h-4 text-muted-foreground' />
          <span className='font-medium'>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Added',
      cell: (info) => {
        const date = info.getValue();
        return (
          <div className='flex items-center gap-1'>
            <Calendar className='w-4 h-4 text-muted-foreground' />
            <span>{date.toLocaleDateString()}</span>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: companies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='space-y-4'>
      {/* Filters and Search */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 flex-1'>
          <Search className='w-4 h-4 text-muted-foreground' />
          <Input
            placeholder='Search companies...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <Filter className='w-4 h-4 mr-2' />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
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

      {/* Table */}
      <div className='rounded-md border'>
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
                            header.getContext()
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
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <div className='flex flex-col gap-2'>
                    <span className='text-muted-foreground'>
                      No companies found.
                    </span>
                    <span className='text-muted-foreground'>
                      Once you{' '}
                      <Link
                        href='/applications/new'
                        className='underline text-blue-500'
                      >
                        create an application
                      </Link>
                      , you will see companies here.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
