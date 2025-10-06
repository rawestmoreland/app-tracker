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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DashboardInterview } from '@/lib/types/dashboard';
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Search,
  Filter,
  X,
  Archive,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { archiveInterviews } from '@/lib/actions/interview-actions';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  interviewTypeOptions,
  interviewFormatOptions,
  interviewOutcomeOptions,
} from '@/lib/filter-options';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InterviewTypeBadge } from './interview-type-badge';
import { InterviewFormatBadge } from './interview-format-badge';

export default function InterviewsTable({
  interviews,
}: {
  interviews: DashboardInterview[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const columnHelper = createColumnHelper<DashboardInterview>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select-col',
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() === true
                ? true
                : table.getIsSomePageRowsSelected() === true
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      }),
      columnHelper.display({
        id: 'global',
        enableHiding: false,
        enableSorting: false,
        filterFn: (row, id, value) => {
          const searchValue = value.toLowerCase();
          const companyName =
            row.original.application.company.name.toLowerCase();
          const applicationTitle = row.original.application.title.toLowerCase();
          const type = row.original.type.toLowerCase();
          return (
            companyName.includes(searchValue) ||
            applicationTitle.includes(searchValue) ||
            type.includes(searchValue)
          );
        },
        header: () => null,
        cell: () => null,
      }),
      columnHelper.accessor('application.company.name', {
        id: 'company',
        header: 'Company',
        cell: (info) => (
          <div className="flex items-center gap-2">
            {info.row.original.application.company.logo ? (
              <Image
                src={info.row.original.application.company.logo}
                alt={info.row.original.application.company.name}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex size-6 items-center justify-center rounded-full bg-gray-200">
                🏢
              </div>
            )}
            <span className="font-medium text-gray-900">
              {info.row.original.application.company.name}
            </span>
          </div>
        ),
      }),

      columnHelper.accessor('application.title', {
        id: 'position',
        header: 'Position',
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('type', {
        id: 'type',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Type
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: (info) => <InterviewTypeBadge type={info.getValue()} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      }),
      columnHelper.accessor('format', {
        id: 'format',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Format
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: (info) => <InterviewFormatBadge format={info.getValue()} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      }),
      columnHelper.accessor('scheduledAt', {
        id: 'scheduledAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Scheduled
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
          const scheduledAt = info.getValue();
          return scheduledAt ? (
            <div className="text-gray-500">
              {format(scheduledAt, 'MMM d, yyyy h:mm a')}
            </div>
          ) : (
            <span className="text-gray-400 italic">Not scheduled</span>
          );
        },
        sortingFn: (rowA, rowB) => {
          const dateA = rowA.original.scheduledAt
            ? new Date(rowA.original.scheduledAt).getTime()
            : 0;
          const dateB = rowB.original.scheduledAt
            ? new Date(rowB.original.scheduledAt).getTime()
            : 0;
          return dateA - dateB;
        },
      }),
      columnHelper.accessor('duration', {
        id: 'duration',
        header: 'Duration',
        cell: (info) => {
          const duration = info.getValue();
          return duration ? (
            <div className="text-gray-500">{duration} min</div>
          ) : (
            <span className="text-gray-400 italic">-</span>
          );
        },
      }),
      columnHelper.accessor('outcome', {
        id: 'outcome',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Outcome
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
          const outcome = info.getValue();
          if (!outcome) {
            return <span className="text-gray-400 italic">-</span>;
          }
          const colorClass =
            outcome === 'PASSED'
              ? 'bg-green-100 text-green-800'
              : outcome === 'FAILED'
                ? 'bg-red-100 text-red-800'
                : outcome === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : outcome === 'CANCELLED'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-100 text-blue-800';
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorClass}`}
            >
              {outcome.replace(/_/g, ' ')}
            </span>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: interviews,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  if (!interviews || interviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No interviews yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Interviews will appear here once you add them to your applications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Interviews</h2>
          {Object.keys(rowSelection).length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {Object.keys(rowSelection).length} selected
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      const selectedIds = Object.keys(rowSelection);
                      try {
                        const result = await archiveInterviews(selectedIds);
                        if (result.success) {
                          toast(
                            result.message ||
                              'Interviews archived successfully',
                          );
                          setRowSelection({});
                        } else {
                          toast(result.error || 'Failed to archive interviews');
                        }
                      } catch (error) {
                        console.error('Archive error:', error);
                        toast('An unexpected error occurred');
                      }
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Archive selected interviews</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search interviews..."
            value={
              (table.getColumn('global')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('global')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        {/* Interview Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <BriefcaseIcon className="h-4 w-4 md:mr-2" />
              <span className="sr-only md:not-sr-only md:block">Type</span>
              {(table.getColumn('type')?.getFilterValue() as string[])?.length >
                0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  {
                    (table.getColumn('type')?.getFilterValue() as string[])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {interviewTypeOptions.map((option) => {
              const isSelected =
                (
                  table.getColumn('type')?.getFilterValue() as string[]
                )?.includes(option.value) || false;
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table.getColumn('type')?.getFilterValue() as string[]) ||
                      [];
                    if (checked) {
                      table
                        .getColumn('type')
                        ?.setFilterValue([...currentFilter, option.value]);
                    } else {
                      table
                        .getColumn('type')
                        ?.setFilterValue(
                          currentFilter.filter(
                            (value) => value !== option.value,
                          ),
                        );
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            {(table.getColumn('type')?.getFilterValue() as string[])?.length >
              0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() =>
                    table.getColumn('type')?.setFilterValue([])
                  }
                  className="justify-center text-center"
                >
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Interview Format Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 md:mr-2" />
              <span className="sr-only md:not-sr-only md:block">Format</span>
              {(table.getColumn('format')?.getFilterValue() as string[])
                ?.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  {
                    (table.getColumn('format')?.getFilterValue() as string[])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {interviewFormatOptions.map((option) => {
              const isSelected =
                (
                  table.getColumn('format')?.getFilterValue() as string[]
                )?.includes(option.value) || false;
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table
                        .getColumn('format')
                        ?.getFilterValue() as string[]) || [];
                    if (checked) {
                      table
                        .getColumn('format')
                        ?.setFilterValue([...currentFilter, option.value]);
                    } else {
                      table
                        .getColumn('format')
                        ?.setFilterValue(
                          currentFilter.filter(
                            (value) => value !== option.value,
                          ),
                        );
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            {(table.getColumn('format')?.getFilterValue() as string[])?.length >
              0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() =>
                    table.getColumn('format')?.setFilterValue([])
                  }
                  className="justify-center text-center"
                >
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Interview Outcome Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ClockIcon className="h-4 w-4 md:mr-2" />
              <span className="sr-only md:not-sr-only md:block">Outcome</span>
              {(table.getColumn('outcome')?.getFilterValue() as string[])
                ?.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  {
                    (table.getColumn('outcome')?.getFilterValue() as string[])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {interviewOutcomeOptions.map((option) => {
              const isSelected =
                (
                  table.getColumn('outcome')?.getFilterValue() as string[]
                )?.includes(option.value) || false;
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table
                        .getColumn('outcome')
                        ?.getFilterValue() as string[]) || [];
                    if (checked) {
                      table
                        .getColumn('outcome')
                        ?.setFilterValue([...currentFilter, option.value]);
                    } else {
                      table
                        .getColumn('outcome')
                        ?.setFilterValue(
                          currentFilter.filter(
                            (value) => value !== option.value,
                          ),
                        );
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            {(table.getColumn('outcome')?.getFilterValue() as string[])
              ?.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() =>
                    table.getColumn('outcome')?.setFilterValue([])
                  }
                  className="justify-center text-center"
                >
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {(columnFilters.length > 0 ||
        (table.getColumn('global')?.getFilterValue() as string)?.length >
          0) && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {(table.getColumn('global')?.getFilterValue() as string)?.length >
            0 && (
            <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Search: {table.getColumn('global')?.getFilterValue() as string}
              <button
                type="button"
                className="hover:bg-secondary-foreground/20 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                onClick={() => {
                  table.getColumn('global')?.setFilterValue('');
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {columnFilters.map((filter) => {
            const column = table.getColumn(filter.id);
            const filterValue = filter.value;
            if (!column || !filterValue) return null;

            if (Array.isArray(filterValue)) {
              const filterValues = filterValue as string[];
              if (!filterValues.length) return null;

              let options = interviewTypeOptions;
              if (filter.id === 'format') {
                options = interviewFormatOptions;
              } else if (filter.id === 'outcome') {
                options = interviewOutcomeOptions;
              }

              return filterValues.map((value) => (
                <div
                  key={`${filter.id}-${value}`}
                  className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {options.find((opt) => opt.value === value)?.label}
                  <button
                    type="button"
                    className="hover:bg-secondary-foreground/20 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                    onClick={() => {
                      const currentValues = column.getFilterValue() as string[];
                      const newValues = currentValues.filter(
                        (v) => v !== value,
                      );
                      column.setFilterValue(
                        newValues.length > 0 ? newValues : undefined,
                      );
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ));
            }

            return null;
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                  className="cursor-pointer"
                  onClick={(e) => {
                    // Don't navigate if clicking checkbox or other interactive elements
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('input[type="checkbox"]') ||
                      target.closest('button')
                    ) {
                      return;
                    }
                    window.location.href = `/dashboard/interviews/${row.original.id}`;
                  }}
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
                      No interviews found.
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
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{' '}
            of {table.getFilteredRowModel().rows.length} interviews
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Show:</span>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
