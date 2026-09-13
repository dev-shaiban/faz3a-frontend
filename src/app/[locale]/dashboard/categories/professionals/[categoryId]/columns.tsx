"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SubCategory } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Users, Eye } from "lucide-react";
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
import EditServiceDialog from "./EditServiceDialog";
import { useTranslations } from "next-intl";

type UseServiceColumnsProps = {
  onSortChange?: (sort: string) => void;
  parentId: number;
};

const ServiceActionsCell = ({ service, parentId }: { service: SubCategory; parentId: number }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategory(true, parentId);
  const t = useTranslations("Table");

  const handleDelete = () => {
    deleteCategory(service.id, {
      onSuccess: () => {
        toast.success("Service deleted successfully");
      },
      onError: (error) => {
        handleDeleteApiError(error);
      },
    });
  };

  const handleViewProfessionals = () => {
    router.push(`/dashboard/professionals?category=${service.id}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => router.push(`/dashboard/categories/professionals/${parentId}/${service.id}`)}
        title="View sub-services"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={handleViewProfessionals}
        title="View professionals offering this service"
      >
        <Users className="h-4 w-4" />
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
          <DropdownMenuItem onClick={handleViewProfessionals}>
            {t("Columns.professionals")}
          </DropdownMenuItem>
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
      <EditServiceDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        service={service}
        parentId={parentId}
      />
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        description={`This action cannot be undone. This will permanently delete the service "${service.name}".`}
      />
    </div>
  );
};

export const useServiceColumns = ({
  onSortChange,
  parentId,
}: UseServiceColumnsProps) => {
  const t = useTranslations("Table");
  const tCommon = useTranslations("Common");
  const columns: ColumnDef<SubCategory>[] = [
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
      header: t("Columns.professionals"),
      cell: ({ row }) => {
        const count = row.original._count;
        return (
          <div className="text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {count?.professionals || 0}
            </span>
          </div>
        );
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
      cell: ({ row }) => <ServiceActionsCell service={row.original} parentId={parentId} />,
    },
  ];

  return { columns };
};
