"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserInfo } from "@/hooks/data/use-user-info"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/utils/axios"
import { endpoints } from "@/lib/api/endpoints"
import { removeAccessToken, removeRefreshToken } from "@/lib/utils/tokens"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: user, isLoading } = useUserInfo()
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("NavUser")

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(endpoints.auth.logout)
      return response.data
    },
    onSuccess: () => {
      // Remove tokens from localStorage
      removeAccessToken()
      removeRefreshToken()
      
      // Clear all queries
      queryClient.clear()
      
      // Show success message
      toast.success(t("loggedOutSuccess"))
      
      // Extract locale from current path and redirect to login
      const locale = pathname.split('/')[1] || 'en'
      router.push(`/${locale}/login`)
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      toast.error(t("logoutFailed"))
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  if (isLoading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.photo?.path} alt={fullName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.photo?.path} alt={fullName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut />
              {logoutMutation.isPending ? t("loggingOut") : t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
