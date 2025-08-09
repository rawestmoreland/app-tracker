'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  GhostIcon,
} from 'lucide-react';
import { getRemotePolicyColor, getStatusColor } from '@/lib/utils';
import { formatDate } from '@/lib/dates';
import { JobTrackerLoading } from '@/components/ui/loading';

interface Application {
  id: string;
  title: string;
  status: string;
  remote: string;
  appliedAt: string;
  company: {
    id: string;
    name: string;
  };
  interviews: Array<{
    id: string;
    type: string;
    outcome?: string;
  }>;
}

interface Analytics {
  totalApplications: number;
  activeApplications: number;
  totalInterviews: number;
  successRate: number;
  ghostRate: number;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<Application>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [applicationsRes, analyticsRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/analytics?type=overview'),
      ]);

      const applicationsData = await applicationsRes.json();
      const analyticsData = await analyticsRes.json();

      setApplications(applicationsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Position',
        cell: (info) => (
          <div className='font-medium text-gray-900'>{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('company.name', {
        header: 'Company',
        cell: (info) => (
          <Link
            href={`/companies/${info.row.original.company.id}`}
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
                status
              )}`}
            >
              {status.replace('_', ' ')}
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
                remote
              )}`}
            >
              {remote.replace('_', ' ')}
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
          <div className='text-gray-500'>{formatDate(info.getValue())}</div>
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
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className='text-right'>
            <Link
              href={`/applications/${info.row.original.id}`}
              className='text-blue-600 hover:text-blue-900 font-medium'
            >
              View
            </Link>
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

  if (loading) {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <JobTrackerLoading />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Analytics Cards */}
      {analytics && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-blue-600'
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
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Applications
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {analytics.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Active Applications
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {analytics.activeApplications}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Interviews
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {analytics.totalInterviews}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <GhostIcon className='w-6 h-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Ghost Rate</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {analytics.ghostRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className='bg-white rounded-lg shadow'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Recent Applications
            </h2>
          </div>
        </div>

        {applications.length > 0 ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
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
                href='/applications/new'
                className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
              >
                Add Application
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
