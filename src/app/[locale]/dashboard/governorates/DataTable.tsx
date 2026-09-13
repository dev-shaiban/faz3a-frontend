"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/table-pagination";
import { LoadingComponent } from "@/components/table/loading-table";
import { useGovernorates } from "@/hooks/data/use-governorates";
import { useGovernorateColumns } from "./columns";
import { useTranslations } from "next-intl";

type DataTableProps = {
  searchQuery?: string;
};

export function DataTable({ searchQuery = "" }: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, // TanStack Table uses 0-based index
    pageSize: 10,
  });
  const t = useTranslations("Common");

  // Only pass search param if it's not empty to avoid unnecessary API calls
  const searchParams = searchQuery.trim() ? { search: searchQuery.trim() } : {};
  const { governorates, totalPages, isLoading, totalItems, isFetching } = useGovernorates(
    {
      ...searchParams,
      page: pagination.pageIndex + 1, // Convert to 1-based for API
      limit: pagination.pageSize,
      sort: 'name:asc'
    }
  );

  const { columns } = useGovernorateColumns();
  const table = useReactTable({
    data: governorates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages || -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  const getNoResultsMessage = () => {
    if (searchQuery.trim()) {
      return t("noResults");
    }
    return t("noData");
  };

  return (
    <>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
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
            {isLoading || isFetching ? (
              <LoadingComponent table={table}></LoadingComponent>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="odd:bg-accent even:bg-white"
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
                //   className="h-24 text-center"
                >
                  {getNoResultsMessage()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={totalPages || 1}
          pageSize={pagination.pageSize}
          totalItems={totalItems || 0}
          onPageChange={(page) => table.setPageIndex(page - 1)} // Convert to 0-based
          onPageSizeChange={(size) => table.setPageSize(size)}
        />
      </div>

      {/* {editDialog}
      {deleteDialog} */}
    </>
  );
}
