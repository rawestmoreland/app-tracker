"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FacetedFilter, FacetOption } from "@/components/ui/faceted-filter";
import { XIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: string;
    title: string;
    options: FacetOption[];
  }[];
  searchableColumns?: {
    id: string;
    title: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.map(
          (searchableColumn) =>
            table.getColumn(searchableColumn.id) && (
              <Input
                key={searchableColumn.id}
                placeholder={`Filter ${searchableColumn.title.toLowerCase()}...`}
                value={
                  (table
                    .getColumn(searchableColumn.id)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(searchableColumn.id)
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
            )
        )}
        {filterableColumns.map(
          (filterableColumn) =>
            table.getColumn(filterableColumn.id) && (
              <FacetedFilter
                key={filterableColumn.id}
                column={table.getColumn(filterableColumn.id)}
                title={filterableColumn.title}
                options={filterableColumn.options}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}