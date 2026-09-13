import type { ColumnDef } from "@tanstack/react-table";
import type { Governorate } from "@/types/domain.types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useLocale } from "next-intl";

import CellText from "@/components/table/cell-text";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useUpdateGovernorateStatus } from "@/hooks/data/use-governorates";

export const useGovernorateColumns = () => {
  const t = useTranslations("Governorates.Table");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const updateStatusMutation = useUpdateGovernorateStatus();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [governorate, setGovernorate] = useState<Governorate>();

//   const handleEditOpen = (governorate: Governorate) => {
//     setGovernorate(governorate);
//     setIsEditOpen(true);
//   };

//   const handleDeleteOpen = (governorate: Governorate) => {
//     setGovernorate(governorate);
//     setIsDeleteOpen(true);
//   };

  const handleStatusChange = (id: number, isActive: boolean) => {
    console.log("Switch clicked:", { id, isActive });
    updateStatusMutation.mutate({ id, isActive }, {
      onSuccess: (data) => {
        console.log("Status update successful:", data);
      },
      onError: (error) => {
        console.error("Status update failed:", error);
      }
    });
  };

  const columns: ColumnDef<Governorate>[] = [
    {
      accessorKey: "id",
      header: t("Columns.id"),
      cell: ({ row }) => <CellText>{row.getValue("id")}</CellText>,
    },
    {
      accessorKey: "name",
      header: t("Columns.name"),
      cell: ({ row }) => {
        const governorate = row.original;
        const displayName = isRTL
          ? governorate.nameAr || governorate.name
          : governorate.name;
        return <CellText>{displayName}</CellText>;
      },
    },
    {
      accessorKey: "isActive",
      header: t("Columns.status"),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        const governorate = row.original;
        
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => 
                handleStatusChange(governorate.id, checked)
              }
              disabled={updateStatusMutation.isPending}
            />
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={
                !isActive
                  ? "bg-red-100 text-red-800"
                  : "bg-green-200 text-green-800"
              }
            >
              <CellText>{isActive ? tCommon("active") : tCommon("inactive")}</CellText>
            </Badge>
          </div>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: t("Columns.actions"),
    //   cell: ({ row }) => (
    //     <div className="flex space-x-8">
    //       <Edit
    //         size={20}
    //         className="cursor-pointer"
    //         onClick={() => handleEditOpen(row.original)}
    //       />
    //       <Trash
    //         color="red"
    //         size={20}
    //         className="cursor-pointer"
    //         onClick={() => handleDeleteOpen(row.original)}
    //       />
    //     </div>
    //   ),
    // },
  ];

  return {
    columns,
  };
};
