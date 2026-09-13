"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CategoriesOverview() {
  const t = useTranslations("Categories");

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("description")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jobs Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{t("jobCategories")}</CardTitle>
                <CardDescription>
                  {t("jobCategoriesHierarchy")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("jobCategoriesDescription")}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{t("structure")}</span>
                  <br />
                  {t("jobsStructure")}
                </div>
                <Button asChild>
                  <Link href="/dashboard/categories/jobs">
                    {t("manageJobs")}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professionals Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>{t("professionalServices")}</CardTitle>
                <CardDescription>
                  {t("professionalServicesHierarchy")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("professionalServicesDescription")}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{t("structure")}</span>
                  <br />
                  {t("servicesStructure")}
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/categories/professionals">
                    {t("manageServices")}
                    <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">10</div>
            <p className="text-xs text-muted-foreground">{t("jobMainCategories")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">16</div>
            <p className="text-xs text-muted-foreground">{t("jobDepartments")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">53+</div>
            <p className="text-xs text-muted-foreground">{t("jobPositions")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2+</div>
            <p className="text-xs text-muted-foreground">{t("serviceCategories")}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
