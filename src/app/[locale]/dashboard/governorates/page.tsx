"use client"

import { useState } from "react";
import { DataTable } from "./DataTable";
import { SearchInput } from "@/components/ui/search-input";
import { useTranslations } from "next-intl";

export default function GovernoratesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("Governorates");

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold -font">{t("title")}</h1>
      </header>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <SearchInput
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>
        
        <DataTable searchQuery={searchQuery} />
      </div>
    </>
  );
}
