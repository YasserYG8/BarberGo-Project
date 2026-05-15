"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Scissors,
  UserRound,
} from "lucide-react";
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

const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "HAIRDRESSER"]),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    role: "CLIENT" as const,
    title: "Client account",
    description: "Book at-home appointments and track your grooming history.",
    icon: UserRound,
  },
  {
    role: "HAIRDRESSER" as const,
    title: "Professional account",
    description: "Manage services, availability, and booking updates from one dashboard.",
    icon: BriefcaseBusiness,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CLIENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const requestBody = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        role: data.role,
      };

      const response = await fetchAPI<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      // No token is returned upon registration because email verification is required.
      toast("Account created successfully. Please check your email to verify your account.", "success");
      
      // Redirect to login page instead of auto-logging in
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast(message, "error");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85 shadow-2xl shadow-black/35">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <CardHeader className="space-y-5 px-6 pb-3 pt-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <Scissors className="size-5 text-amber-300" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-stone-400">
              <CheckCircle2 className="size-3.5 text-amber-300" />
              Unified onboarding
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl sm:text-4xl">Create your BarberGo account</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-relaxed text-stone-400">
              Start as a client or professional now. You will land in the dashboard that matches your role.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-4 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {roleOptions.map((option) => {
                const selected = selectedRole === option.role;
                return (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setValue("role", option.role, { shouldValidate: true })}
                    className={`rounded-3xl border p-4 text-left transition-all ${
                      selected
                        ? "border-amber-400/40 bg-amber-500/10 shadow-lg shadow-amber-950/15"
                        : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-2xl p-2.5 ${
                          selected ? "bg-amber-400/15 text-amber-200" : "bg-stone-800 text-stone-300"
                        }`}
                      >
                        <option.icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-200">
                          {option.title}
                        </p>
                        <p className="text-sm leading-relaxed text-stone-400">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full name</Label>
                <Input
                  id="reg-name"
                  placeholder="Ahmed Ben Ali"
                  autoComplete="name"
                  {...register("fullName")}
                  className={errors.fullName ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
                />
                {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
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
                <Label htmlFor="reg-confirm">Confirm password</Label>
                <Input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input id="reg-phone" type="tel" placeholder="+216 XX XXX XXX" {...register("phone")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-address">Address</Label>
                <Input id="reg-address" placeholder="Tunis, Tunisia" {...register("address")} />
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Selected role</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                {selectedRole === "HAIRDRESSER"
                  ? "You will create a professional account and land in the service and availability dashboard."
                  : "You will create a client account and land in the booking and appointment dashboard."}
              </p>
            </div>

            <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-stone-950/25 border-t-stone-950 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-3 border-t border-stone-800/80 px-6 py-5 sm:px-8">
          <p className="text-sm text-stone-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-300 transition-colors hover:text-amber-200">
              Sign in
            </Link>
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
            Registration stores only the fields required by the current backend API.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
