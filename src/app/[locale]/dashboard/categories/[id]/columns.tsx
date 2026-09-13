"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JSX, useState } from "react";
import { EditSubCategoryDialog } from "./EditSubCategoryDialog";
import { useDeleteCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { handleDeleteApiError } from "@/lib/utils/form-error-handler";
import { SubCategory } from "@/types/api.types";
import { useTranslations } from "next-intl";

type UseSubCategoryColumnsProps = {
  onSortChange?: (sort: string) => void;
  parentId: string; 
};

type UseSubCategoryColumnsReturn = {
  columns: ColumnDef<SubCategory>[];
  dialogs: JSX.Element;
};

export const useSubCategoryColumns = ({
  onSortChange,
  parentId,
}: UseSubCategoryColumnsProps): UseSubCategoryColumnsReturn => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<SubCategory | null>(
    null
  );
  const { mutate: deleteCategory, isPending } = useDeleteCategory(true, Number(parentId));
  const t = useTranslations("Table");
  const tCommon = useTranslations("Common");

  const handleDelete = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        toast.success("Subcategory deleted successfully");
      },
      onError: (error) => {
        handleDeleteApiError(error);
      },
    });
  };

  const columns: ColumnDef<SubCategory>[] = [
    {
      accessorKey: "id",
      header: t("Columns.id"),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newSort =
                column.getIsSorted() === "asc" ? "name:desc" : "name:asc";
              onSortChange?.(newSort);
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            {t("Columns.name")}
            <ArrowUpDown className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        );
      },
    },
    {
      accessorKey: "type",
      header: t("Columns.type"),
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <span className="capitalize">{type.toLowerCase()}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: t("Columns.status"),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <span className={isActive ? "text-green-500" : "text-red-500"}>
            {isActive ? tCommon("active") : tCommon("inactive")}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Actions.label")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentCategory(row.original); // Use fresh row data
                  setIsEditOpen(true);
                }}
              >
                {t("Actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentCategory(row.original); // Use fresh row data
                  setIsDeleteOpen(true);
                }}
                className="text-red-600"
              >
                {t("Actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return {
    columns,
    dialogs: (
      <>
        {currentCategory && (
          <>
            <EditSubCategoryDialog
              open={isEditOpen}
              setOpen={setIsEditOpen}
              subCategory={currentCategory}
              parentId={parentId} // Pass parentId to EditSubCategoryDialog
            />
            <DeleteConfirmationDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={() => handleDelete(currentCategory.id)}
              isPending={isPending}
              description={`Are you sure you want to delete the subcategory "${currentCategory.name}"?`}
            />
          </>
        )}
      </>
    ),
  };
};
