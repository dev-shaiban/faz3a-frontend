"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale, useTranslations } from "next-intl";

function generateBreadcrumbs(pathname: string) {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(
    new RegExp(`^/${routing.locales.join("|")}`),
    ""
  );
  const paths = pathWithoutLocale.split("/").filter(Boolean);

  return paths.map((path, index) => ({
    href: "/" + paths.slice(0, index + 1).join("/"),
    label: path.charAt(0).toUpperCase() + path.slice(1),
  }));
}

const BREADCRUMB_KEYS = [
  "dashboard",
  "professionals",
  "candidates",
  "categories",
  "governorates",
  "jobs",
  "overview",
] as const;

type BreadcrumbKey = (typeof BREADCRUMB_KEYS)[number];

function isBreadcrumbKey(key: string): key is BreadcrumbKey {
  return (BREADCRUMB_KEYS as readonly string[]).includes(key);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const t = useTranslations("Breadcrumb");
  const getBreadcrumbLabel = (item: { label: string; href: string }) => {
    const key = item.href.split("/").filter(Boolean).pop() ?? "";
    return isBreadcrumbKey(key) ? t(key) : item.label;
  };
  const isRTL = locale === "ar";
  
  return (
    <SidebarProvider>
      {/* <Toaster richColors></Toaster> */}
      <AppSidebar side={isRTL ? "right" : "left"} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className={isRTL ? "-mr-1" : "-ml-1"} />
            <Separator
              orientation="vertical"
              className={`${isRTL ? "ml-2" : "mr-2"} data-[orientation=vertical]:h-4`}
            />
            <Breadcrumb>
              <BreadcrumbList>
                {generateBreadcrumbs(usePathname()).map((item, index, arr) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      <Link href={item.href}>
                        {getBreadcrumbLabel(item)}
                      </Link>
                    </BreadcrumbItem>
                    {index < arr.length - 1 && (
                      <BreadcrumbSeparator>
                        {isRTL ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? "ml-4" : "mr-4"}`}>
            <LanguageSwitcher />
            <ModeToggle className="" />
          </div>
        </header>
        <div className="p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
