"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus } from "lucide-react";

import { useParams } from "next/navigation";
import { useCategory } from "@/hooks/data/use-categories";
import { SubCategoriesDataTable } from "./DataTable";
import { CreateSubCategoryDialog } from "./CreateSubCategoryDialog";
import { useTranslations } from "next-intl";

export default function SubCategoriesPage() {
  const params = useParams();
  const parentId = Number(params.id);
  const { data: category } = useCategory(parentId);
  const t = useTranslations("Categories");
  const tCommon = useTranslations("Common");

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {category?.nameEn || t("subcategories")}
        </h1>
        <CreateSubCategoryDialog
          parentId={parentId}
          parentType={category?.type || "JOB"}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {tCommon("createNew")}
          </Button>
        </CreateSubCategoryDialog>
      </header>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder={t("searchSubcategories")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <SubCategoriesDataTable parentId={parentId} searchQuery={searchQuery} />
      </div>
    </>
  );
}
