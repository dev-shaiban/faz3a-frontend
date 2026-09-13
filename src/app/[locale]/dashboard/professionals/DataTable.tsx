"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SubCategory } from "@/types/api.types";

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
import { useProfessionalsColumns } from "./columns";
import { Professional } from "@/types";
import { useProfessionals } from "@/hooks/data/use-professionals";
import { useTranslations } from "next-intl";

type ProfessionalsDataTableProps = {
  searchQuery?: string;
};

export function ProfessionalsDataTable({
  searchQuery = "",
}: ProfessionalsDataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<
    "name:asc" | "name:desc" | "createdAt:asc" | "createdAt:desc"
  >("createdAt:desc");
  const t = useTranslations("Common");

  const { professionals, totalPages, isLoading, totalItems, isFetching } =
    useProfessionals({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting,
      ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
    });

  const { columns, dialogs } = useProfessionalsColumns({
    onSortChange: (newSort) => setSorting(newSort as "name:asc" | "name:desc"),
  });

  const table = useReactTable<Professional>({
    data: professionals || [],
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
            <LoadingComponent table={table} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="odd:bg-accent dark:odd:bg-inherit">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />

      {dialogs}
    </div>
  );
}
