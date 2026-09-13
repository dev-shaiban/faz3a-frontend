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
import { useSubCategoryColumns } from "./columns";
import { useSubCategories } from "@/hooks/data/use-categories";
import { useTranslations } from "next-intl";

type SubCategoriesDataTableProps = {
  parentId: number;
  searchQuery?: string;
};

export function SubCategoriesDataTable({
  parentId,
  searchQuery = "",
}: SubCategoriesDataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const t = useTranslations("Common");

  const [sorting, setSorting] = useState<
    "name:asc" | "name:desc" | "createdAt:asc" | "createdAt:desc"
  >("createdAt:desc");

  const { subCategories, totalPages, isLoading, totalItems, isFetching } =
    useSubCategories(parentId, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting,
      ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
    });

  const { columns, dialogs } = useSubCategoryColumns({
    onSortChange: (newSort) => setSorting(newSort as "name:asc" | "name:desc"),
    parentId: parentId.toString(),
  });

  const table = useReactTable<SubCategory>({
    data: subCategories || [],
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
              <TableRow key={row.id} className="odd:bg-accent even:bg-white">
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
