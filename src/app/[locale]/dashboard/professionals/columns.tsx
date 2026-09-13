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
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { handleDeleteApiError } from "@/lib/utils/form-error-handler";
import { Professional } from "@/types";
import { EditProfessionalDialog } from "./EditDialog";
import { useDeleteProfessional } from "@/hooks/data/use-professionals";
import { useLocale, useTranslations } from "next-intl";

type UseProfessionalsColumnsProps = {
  onSortChange?: (sort: string) => void;
};

type UseProfessionalsColumnsReturn = {
  columns: ColumnDef<Professional>[];
  dialogs: JSX.Element;
};

export const useProfessionalsColumns = ({
  onSortChange,
}: UseProfessionalsColumnsProps): UseProfessionalsColumnsReturn => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] =
    useState<Professional | null>(null);
  const { mutate: deleteProfessional, isPending } = useDeleteProfessional();
  const t = useTranslations("Table");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleDelete = (id: number) => {
    deleteProfessional(id, {
      onSuccess: () => {
        toast.success("Professional deleted successfully");
        setIsDeleteOpen(false);
        setCurrentProfessional(null);
      },
      onError: (error) => {
        handleDeleteApiError(error);
      },
    });
  };

  const columns: ColumnDef<Professional>[] = [
    {
      accessorKey: "id",
      header: t("Columns.id"),
    },
    {
      accessorKey: "user",
      header: t("Columns.name"),
      cell: ({ row }) => {
        const user = row.getValue("user") as Professional['user'];
        return `${user.firstName} ${user.lastName}`;
      },
    },
    {
      accessorKey: "user.email",
      header: t("Columns.email"),
      cell: ({ row }) => (
        <span dir="ltr" className="inline-block">
          {(row.getValue("user.email") as string) ?? ""}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: t("Columns.phone"),
      cell: ({ row }) => (
        <span dir="ltr" className="inline-block">
          {(row.getValue("phone") as string) || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "yearsOfExp",
      header: t("Columns.experienceYears"),
    },
    {
      accessorKey: "governorate",
      header: t("Columns.governorate"),
      cell: ({ row }) => {
        const governorate = row.getValue("governorate") as Professional['governorate'];
        return (isRTL ? governorate?.nameAr || governorate?.name : governorate?.name) || 'N/A';
      },
    },
    {
      accessorKey: "categories",
      header: t("Columns.categories"),
      cell: ({ row }) => {
        const categories = row.getValue("categories") as Professional['categories'];
        return (
          categories
            .map((c) => (isRTL ? c.nameAr || c.name : c.nameEn || c.name))
            .join("، ") || "N/A"
        );
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
                  setCurrentProfessional(row.original);
                  setIsEditOpen(true);
                }}
              >
                {t("Actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentProfessional(row.original);
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
        {currentProfessional && (
          <>
            <EditProfessionalDialog
              professional={currentProfessional}
              open={isEditOpen}
              onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) {
                  setCurrentProfessional(null);
                }
              }}
            />
            <DeleteConfirmationDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={() => handleDelete(currentProfessional.id)}
              isPending={isPending}
              title="Delete Professional"
              description={`Are you sure you want to delete ${currentProfessional.user.firstName} ${currentProfessional.user.lastName}? This action cannot be undone.`}
            />
          </>
        )}
      </>
    ),
  };
};
