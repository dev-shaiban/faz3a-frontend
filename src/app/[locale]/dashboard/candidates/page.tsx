"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { CandidatesDataTable } from "./DataTable";
import { CreateCandidateDialog } from "./CreateDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("Candidates");
  const tCommon = useTranslations("Common");

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <CreateCandidateDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {tCommon("createNew")}
          </Button>
        </CreateCandidateDialog>
      </header>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <CandidatesDataTable searchQuery={searchQuery}></CandidatesDataTable>
      </div>
    </>
  );
}
