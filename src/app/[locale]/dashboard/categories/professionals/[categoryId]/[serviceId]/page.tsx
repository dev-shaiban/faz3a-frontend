"use client";

import React, { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useCategory } from "@/hooks/data/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import CreateSubServiceDialog from "./CreateSubServiceDialog";
import { SubServicesDataTable } from "./SubServicesDataTable";
import { useTranslations } from "next-intl";

export default function SubServicesPage() {
  const params = useParams();
  const categoryId = parseInt(params.categoryId as string);
  const serviceId = parseInt(params.serviceId as string);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const t = useTranslations("Categories");

  const { data: service, isLoading } = useCategory(serviceId);
  const { data: mainCategory } = useCategory(categoryId);

  const dataTableProps = useMemo(
    () => ({
      searchQuery,
      parentId: serviceId,
    }),
    [searchQuery, serviceId]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/categories/professionals/${categoryId}`}>
              <ArrowLeft className="h-4 w-4 mr-2 rtl:rotate-180" />
              {t("backToServices")}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t("subServices")}</h1>
            <p className="text-muted-foreground">
              {mainCategory?.nameAr} → {service?.nameAr} - {service?.nameEn}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createNewSubService")}
        </Button>
      </header>

      <CreateSubServiceDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
        parentId={serviceId}
        serviceName={service?.name || ""}
        mainCategoryName={mainCategory?.name || ""}
      />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder={t("searchSubServices")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <SubServicesDataTable {...dataTableProps} />
      </div>
    </>
  );
}
