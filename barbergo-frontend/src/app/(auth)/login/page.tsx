"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff, Scissors, ShieldCheck } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthResponse } from "@/types";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetchAPI<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      login(
        { id: response.id, fullName: response.fullName, email: response.email, role: response.role },
        response.token
      );

      toast("Welcome back. Redirecting to your dashboard.", "success");

      if (response.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (response.role === "HAIRDRESSER") {
        router.push("/dashboard/hairdresser");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast(message, "error");
    }
  };

  return (
    <div className="w-full max-w-xl">
      <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85 shadow-2xl shadow-black/35">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <CardHeader className="space-y-5 px-6 pb-4 pt-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <Scissors className="size-5 text-amber-300" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-stone-400">
              <ShieldCheck className="size-3.5 text-amber-300" />
              Secure access
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl sm:text-4xl">Sign in to BarberGo</CardTitle>
            <CardDescription className="max-w-md text-sm leading-relaxed text-stone-400">
              Access your bookings, service settings, and operational dashboard from the same account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="login-password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-amber-300 transition-colors hover:text-amber-200">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={`pr-11 ${errors.password ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-500 transition-colors hover:text-stone-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-stone-950/25 border-t-stone-950 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Continue to dashboard
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-3 border-t border-stone-800/80 px-6 py-5 sm:px-8">
          <p className="text-sm text-stone-400">
            New to BarberGo?{" "}
            <Link href="/register" className="font-medium text-amber-300 transition-colors hover:text-amber-200">
              Create an account
            </Link>
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
            Clients, professionals, and admins sign in from the same entry point.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
