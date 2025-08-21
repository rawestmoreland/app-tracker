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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardApplication } from '@/lib/types/dashboard';
import { getRemotePolicyColor } from '@/lib/utils';
import { StatusDropdown } from './status-dropdown';
import {
  applicationStatusOptions,
  remoteTypeOptions,
} from '@/lib/filter-options';
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
  VisibilityState,
  Updater,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  PlusIcon,
  Search,
  Filter,
  X,
  Archive,
  HomeIcon,
  ClipboardListIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  startTransition,
  useMemo,
  useOptimistic,
  useState,
  useCallback,
  useRef,
} from 'react';
import Image from 'next/image';
import {
  updateApplicationTableColumns,
  updateApplicationTablePagination,
} from '@/lib/actions/user-preferences-actions';
import { Checkbox } from '@/components/ui/checkbox';
import { archiveApplications } from '@/lib/actions/application-actions';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ApplicationsTable({
  applications,
  tableConfig,
}: {
  applications: DashboardApplication[];
  tableConfig?: {
    columnsVisibility: Record<string, boolean>;
    paginationSize: {
      pageSize: number;
    };
  };
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [optimisticColumnVisibility, setOptimisticColumnVisibility]: [
    VisibilityState,
    (arg: Record<string, boolean>) => void,
  ] = useOptimistic<VisibilityState>(
    // this sets the "default" values for the column visibility
    tableConfig?.columnsVisibility || {
      'select-col': true,
      title: true,
      'company.name': true,
      status: true,
      remote: true,
      appliedAt: true,
      interviews: true,
    },
  );

  const [rowSelection, setRowSelection] = useState({});

  // Use regular useState for pagination to persist during re-renders
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: tableConfig?.paginationSize?.pageSize || 10,
    pageIndex: 0,
  });

  // Refs to track the last update to prevent duplicate server calls
  const lastColumnVisibilityUpdate = useRef<string>('');
  const lastPaginationUpdate = useRef<string>('');

  const columnHelper = createColumnHelper<DashboardApplication>();

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
      columnHelper.accessor('title', {
        id: 'title',
        header: 'Position',
        cell: (info) => (
          <Link
            href={`/dashboard/applications/${info.row.original.id}`}
            className="font-medium underline hover:text-blue-900 hover:underline-offset-2"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor('company.name', {
        id: 'company.name',
        header: 'Company',
        cell: (info) => (
          <Link
            href={`/dashboard/companies/${info.row.original.company.id}`}
            className="font-medium text-blue-600 hover:text-blue-900"
          >
            <div className="flex items-center gap-2">
              {info.row.original.company.logo ? (
                <Image
                  src={info.row.original.company.logo}
                  alt={info.row.original.company.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-gray-200">
                  🏢
                </div>
              )}
              {info.row.original.company.name}
            </div>
          </Link>
        ),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Status
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
          const application = info.row.original;
          return (
            <StatusDropdown
              applicationId={application.id}
              currentStatus={application.status}
            />
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      }),
      columnHelper.accessor('remote', {
        id: 'remote',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Remote Policy
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
          const remote = info.getValue();
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRemotePolicyColor(
                remote ?? '',
              )}`}
            >
              {remote?.replace('_', ' ')}
            </span>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      }),
      columnHelper.accessor('appliedAt', {
        id: 'appliedAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium tracking-wider text-gray-500 uppercase hover:bg-transparent"
          >
            Applied
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: (info) => (
          <div className="text-gray-500">
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
        id: 'interviews',
        header: 'Interviews',
        cell: (info) => (
          <div className="text-gray-500">
            {info.row.original.interviews.length}
          </div>
        ),
      }),
    ],
    [columnHelper],
  );

  // Memoize the handlers to prevent infinite loops
  const handleColumnVisibilityChange = useCallback(
    async (newColumnVisibilityConfiguration: Updater<VisibilityState>) => {
      let newColumnVisibilityConfigurationResult: VisibilityState;
      if (newColumnVisibilityConfiguration instanceof Function) {
        newColumnVisibilityConfigurationResult =
          newColumnVisibilityConfiguration(optimisticColumnVisibility);
        startTransition(() => {
          setOptimisticColumnVisibility(newColumnVisibilityConfigurationResult);
        });
      } else {
        newColumnVisibilityConfigurationResult =
          newColumnVisibilityConfiguration;
        setOptimisticColumnVisibility(newColumnVisibilityConfiguration);
      }

      // Check if this is a duplicate update
      const newConfigString = JSON.stringify(
        newColumnVisibilityConfigurationResult,
      );
      if (lastColumnVisibilityUpdate.current === newConfigString) {
        return;
      }
      lastColumnVisibilityUpdate.current = newConfigString;

      // Call server action immediately but only if it's a new configuration
      updateApplicationTableColumns(newColumnVisibilityConfigurationResult);
    },
    [optimisticColumnVisibility],
  );

  const handlePaginationChange = useCallback(
    async (updater: Updater<PaginationState>) => {
      const previousPagination = pagination;
      let newPaginationConfigurationResult: PaginationState;

      if (updater instanceof Function) {
        newPaginationConfigurationResult = updater(pagination);
      } else {
        newPaginationConfigurationResult = updater;
      }

      // Always update the local state
      setPagination(newPaginationConfigurationResult);

      // Only call server action if pageSize changed (not pageIndex)
      if (
        previousPagination.pageSize !==
        newPaginationConfigurationResult.pageSize
      ) {
        // Check if this is a duplicate update
        const newPageSizeString = JSON.stringify({
          pageSize: newPaginationConfigurationResult.pageSize,
        });
        if (lastPaginationUpdate.current === newPageSizeString) {
          return;
        }
        lastPaginationUpdate.current = newPageSizeString;

        // Call server action only for pageSize changes
        updateApplicationTablePagination(newPaginationConfigurationResult);
      }
    },
    [pagination],
  );

  const table = useReactTable({
    data: applications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: handlePaginationChange,
    getRowId: (row) => row.id, // Use application ID as row ID
    state: {
      sorting,
      columnFilters,
      pagination: pagination,
      columnVisibility: optimisticColumnVisibility,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  if (!applications || applications.length === 0) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No applications yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first job application.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/applications/new"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Applications
          </h2>
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
                        const result = await archiveApplications(selectedIds);
                        if (result.success) {
                          toast(
                            result.message ||
                              'Applications archived successfully',
                          );
                          setRowSelection({});
                        } else {
                          toast(
                            result.error || 'Failed to archive applications',
                          );
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
                  <p>Archive selected applications</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" asChild>
              <Link href="/dashboard/applications/new">
                <PlusIcon className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new application</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search positions..."
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ClipboardListIcon className="mr-2 h-4 w-4" />
              Status
              {(table.getColumn('status')?.getFilterValue() as string[])
                ?.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  {
                    (table.getColumn('status')?.getFilterValue() as string[])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {applicationStatusOptions.map((option) => {
              const isSelected =
                (
                  table.getColumn('status')?.getFilterValue() as string[]
                )?.includes(option.value) || false;
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table
                        .getColumn('status')
                        ?.getFilterValue() as string[]) || [];
                    if (checked) {
                      table
                        .getColumn('status')
                        ?.setFilterValue([...currentFilter, option.value]);
                    } else {
                      table
                        .getColumn('status')
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
            {(table.getColumn('status')?.getFilterValue() as string[])?.length >
              0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() =>
                    table.getColumn('status')?.setFilterValue([])
                  }
                  className="justify-center text-center"
                >
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Remote Policy Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <HomeIcon className="mr-2 h-4 w-4" />
              Remote
              {(table.getColumn('remote')?.getFilterValue() as string[])
                ?.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0">
                  {
                    (table.getColumn('remote')?.getFilterValue() as string[])
                      .length
                  }
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {remoteTypeOptions.map((option) => {
              const isSelected =
                (
                  table.getColumn('remote')?.getFilterValue() as string[]
                )?.includes(option.value) || false;
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentFilter =
                      (table
                        .getColumn('remote')
                        ?.getFilterValue() as string[]) || [];
                    if (checked) {
                      table
                        .getColumn('remote')
                        ?.setFilterValue([...currentFilter, option.value]);
                    } else {
                      table
                        .getColumn('remote')
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
            {(table.getColumn('remote')?.getFilterValue() as string[])?.length >
              0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() =>
                    table.getColumn('remote')?.setFilterValue([])
                  }
                  className="justify-center text-center"
                >
                  Clear filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                console.log('column', column);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === 'appliedAt'
                      ? 'Applied Date'
                      : column.id.replace('.', ' ')}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {(columnFilters.length > 0 ||
        (table.getColumn('title')?.getFilterValue() as string)?.length > 0) && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {(table.getColumn('title')?.getFilterValue() as string)?.length >
            0 && (
            <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Position: {table.getColumn('title')?.getFilterValue() as string}
              <button
                type="button"
                className="hover:bg-secondary-foreground/20 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                onClick={() => {
                  table.getColumn('title')?.setFilterValue('');
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

            // Handle array filters (status, remote)
            if (Array.isArray(filterValue)) {
              const filterValues = filterValue as string[];
              if (!filterValues.length) return null;

              return filterValues.map((value) => (
                <div
                  key={`${filter.id}-${value}`}
                  className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {filter.id === 'status'
                    ? applicationStatusOptions.find(
                        (opt) => opt.value === value,
                      )?.label
                    : remoteTypeOptions.find((opt) => opt.value === value)
                        ?.label}
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

            // Handle string filters (search) - but these are handled separately above
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
                      No applications found.
                    </span>
                    <span className="text-muted-foreground">
                      Get started by{' '}
                      <Link
                        href="/dashboard/applications/new"
                        className="text-blue-500 underline"
                      >
                        adding your first application
                      </Link>
                      .
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
            of {table.getFilteredRowModel().rows.length} applications
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
