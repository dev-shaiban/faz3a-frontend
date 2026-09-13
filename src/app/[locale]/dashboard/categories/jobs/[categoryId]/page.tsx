"use client";

import React, { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { DepartmentsDataTable } from "./DepartmentsDataTable";
import CreateDepartmentDialog from "./CreateDepartmentDialog";
import { useCategory } from "@/hooks/data/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function JobDepartmentsPage() {
  const params = useParams();
  const categoryId = parseInt(params.categoryId as string);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const t = useTranslations("Categories");

  const { data: category, isLoading } = useCategory(categoryId);

  const dataTableProps = useMemo(
    () => ({
      searchQuery,
      parentId: categoryId,
    }),
    [searchQuery, categoryId]
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
            <Link href="/dashboard/categories/jobs">
              <ArrowLeft className="h-4 w-4 mr-2 rtl:rotate-180" />
              {t("backToJobCategories")}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t("departments")}</h1>
            <p className="text-muted-foreground">
              {category?.nameAr} - {category?.nameEn}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createNewDepartment")}
        </Button>
      </header>

      <CreateDepartmentDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
        parentId={categoryId}
        parentName={category?.name || ""}
      />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder={t("searchDepartments")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <DepartmentsDataTable {...dataTableProps} />
      </div>
    </>
  );
}
