"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/services/auth.service"
import { ILoginPayload } from "@/services/auth.service"
import { zodResolver } from "@hookform/resolvers/zod";
import { setAccessToken, setRefreshToken } from "@/lib/utils/tokens";
import { redirect, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginPayload>({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter();
  const t = useTranslations("Login");


  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.token);
      setRefreshToken(data.refreshToken);
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error("Login failed", error)
    }
  })

  const onSubmit = (data: ILoginPayload) => {
    mutation.mutate(data)
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("description")}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">{t("email")}</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">{t("password")}</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t("loggingIn") : t("login")}
        </Button>
      </div>
    </form>
  )
}
