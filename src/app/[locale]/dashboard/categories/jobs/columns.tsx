"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MainCategory } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import React from "react";
import { useDeleteCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { handleDeleteApiError } from "@/lib/utils/form-error-handler";
import EditJobCategoryDialog from "./EditJobCategoryDialog";
import { useTranslations } from "next-intl";

type UseJobCategoryColumnsProps = {
  onSortChange?: (sort: string) => void;
};

const JobActionsCell = ({ category }: { category: MainCategory }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const t = useTranslations("Table");

  const handleDelete = () => {
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success("Job category deleted successfully");
      },
      onError: (error) => {
        handleDeleteApiError(error);
      },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => router.push(`/dashboard/categories/jobs/${category.id}`)}
        title="View departments"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("Actions.label")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            {t("Actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600"
          >
            {t("Actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditJobCategoryDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        category={category}
      />
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        description={`This action cannot be undone. This will permanently delete the job category "${category.name}" and all its departments and job positions.`}
      />
    </div>
  );
};

export const useJobCategoryColumns = ({
  onSortChange,
}: UseJobCategoryColumnsProps = {}) => {
  const t = useTranslations("Table");
  const tCommon = useTranslations("Common");
  const columns: ColumnDef<MainCategory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("Columns.id"),
    },
    {
      accessorKey: "nameAr",
      header: t("Columns.arabicName"),
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("nameAr")}</div>;
      },
    },
    {
      accessorKey: "nameEn",
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
            {t("Columns.englishName")}
            <ArrowUpDown className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        );
      },
    },
    {
      accessorKey: "_count",
      header: t("Columns.departments"),
      cell: ({ row }) => {
        const count = row.original._count;
        return <div className="text-center">{count?.candidates || 0}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: t("Columns.status"),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? tCommon("active") : tCommon("inactive")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: t("Columns.actions"),
      cell: ({ row }) => <JobActionsCell category={row.original} />,
    },
  ];

  return { columns };
};
