"use client";

import { useUserInfo } from "@/hooks/data/use-user-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Shield, Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function Page() {
  const { data: user, isLoading, isError } = useUserInfo();
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">{t("errorTitle")}</CardTitle>
            <CardDescription>
              {t("errorDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("welcome", { name: user.firstName ?? "" })} 👋
        </h1>
        <p className="text-muted-foreground">
          {t("overview")}
        </p>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profileInformation")}</CardTitle>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photo?.path} alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{fullName}</h3>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("phone")}</p>
                <p className="text-sm">{user.phone || t("notProvided")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("role")}</p>
                <p className="text-sm font-semibold">{user.role?.name || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("status")}</p>
                <p className="text-sm">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.status?.name === "active" 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                      : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}>
                    {user.status?.name || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("memberSince")}</p>
                <p className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            {user.provider && (
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("provider")}</p>
                  <p className="text-sm capitalize">{user.provider}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Dashboard Content */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("quickStats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{t("comingSoon")}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{t("comingSoon")}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{t("comingSoon")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
