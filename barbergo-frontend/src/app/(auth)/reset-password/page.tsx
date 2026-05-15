"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast("Invalid or missing reset token.", "error");
      return;
    }

    try {
      await fetchAPI<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password }),
      });
      toast("Password reset successfully. You can now log in.", "success");
      router.push("/login");
    } catch (err: any) {
      toast(err.message || "Failed to reset password. The link may have expired.", "error");
    }
  };

  if (!token) {
    return (
      <div className="text-center text-stone-400 p-8 bg-stone-900 rounded-xl border border-stone-800">
        <p>Invalid or missing password reset token.</p>
        <Button variant="link" className="text-amber-400 mt-4" onClick={() => router.push("/forgot-password")}>
          Request a new link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85 shadow-2xl shadow-black/35">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <CardHeader className="space-y-5 px-6 pb-4 pt-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <KeyRound className="size-5 text-amber-300" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-stone-400">
              <ShieldCheck className="size-3.5 text-amber-300" />
              Secure Update
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl sm:text-3xl">Set new password</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-stone-400">
              Please enter your new password below for {email || 'your account'}.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-stone-950/25 border-t-stone-950 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
