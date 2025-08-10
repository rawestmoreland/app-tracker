'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardApplication } from '@/lib/types/dashboard';
import { getRemotePolicyColor, getStatusColor } from '@/lib/utils';
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function ApplicationsTable({
  applications,
}: {
  applications: DashboardApplication[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<DashboardApplication>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Position',
        cell: (info) => (
          <Link
            href={`/dashboard/applications/${info.row.original.id}`}
            className='hover:text-blue-900 font-medium underline hover:underline-offset-2'
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor('company.name', {
        header: 'Company',
        cell: (info) => (
          <Link
            href={`/dashboard/companies/${info.row.original.company.id}`}
            className='text-blue-600 hover:text-blue-900 font-medium'
          >
            {info.row.original.company.name}
          </Link>
        ),
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-auto p-0 font-medium text-gray-500 uppercase tracking-wider hover:bg-transparent'
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className='ml-2 h-4 w-4' />
            ) : (
              <ChevronsUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        ),
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                status ?? ''
              )}`}
            >
              {status?.replace('_', ' ')}
            </span>
          );
        },
      }),
      columnHelper.accessor('remote', {
        header: ({ column }) => (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-auto p-0 font-medium text-gray-500 uppercase tracking-wider hover:bg-transparent'
          >
            Remote Policy
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className='ml-2 h-4 w-4' />
            ) : (
              <ChevronsUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        ),
        cell: (info) => {
          const remote = info.getValue();
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRemotePolicyColor(
                remote ?? ''
              )}`}
            >
              {remote?.replace('_', ' ')}
            </span>
          );
        },
      }),
      columnHelper.accessor('appliedAt', {
        header: ({ column }) => (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-auto p-0 font-medium text-gray-500 uppercase tracking-wider hover:bg-transparent'
          >
            Applied
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className='ml-2 h-4 w-4' />
            ) : (
              <ChevronsUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        ),
        cell: (info) => (
          <div className='text-gray-500'>
            {format(info.getValue(), 'MMM d, yyyy')}
          </div>
        ),
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.appliedAt).getTime();
          const dateB = new Date(rowB.original.appliedAt).getTime();
          return dateA - dateB;
        },
      }),
      columnHelper.accessor('interviews', {
        header: 'Interviews',
        cell: (info) => (
          <div className='text-gray-500'>
            {info.row.original.interviews.length}
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: applications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  if (!applications || applications.length === 0) {
    return (
      <div className='text-center py-12'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>
          No applications yet
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Get started by adding your first job application.
        </p>
        <div className='mt-6'>
          <Link
            href='/dashboard/applications/new'
            className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
          >
            Add Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className='px-6 py-3'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className='hover:bg-gray-50'
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className='px-6 py-4'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
