"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await fetchAPI<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIsSent(true);
      toast("If an account exists, a reset link has been sent to your email.", "success");
    } catch (err: any) {
      toast(err.message || "Failed to send reset link. Please try again.", "error");
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85 shadow-2xl shadow-black/35">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <CardHeader className="space-y-5 px-6 pb-4 pt-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <Mail className="size-5 text-amber-300" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-stone-400">
              <ShieldCheck className="size-3.5 text-amber-300" />
              Account Recovery
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl sm:text-3xl">Forgot password</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-stone-400">
              {isSent
                ? "Check your email inbox for a link to reset your password. It may take a few minutes to arrive."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-2 sm:px-8">
          {!isSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500/50 focus-visible:ring-red-500/30" : ""}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <Button type="submit" className="h-12 w-full text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 rounded-full border-2 border-stone-950/25 border-t-stone-950 animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          ) : (
            <div className="flex justify-center pt-2 pb-4">
               <Button variant="outline" className="w-full border-stone-800" onClick={() => setIsSent(false)}>
                 Didn't receive it? Try again
               </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-stone-800/80 px-6 py-5 sm:px-8">
          <Link href="/login" className="flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-amber-300">
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
