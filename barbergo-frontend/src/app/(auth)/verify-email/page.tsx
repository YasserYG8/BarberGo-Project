"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetchAPI<{ message: string }>(`/auth/verify-email?token=${token}`, {
          method: "GET",
        });
        setStatus("success");
        setMessage(res.message || "Your email has been verified successfully. You can now log in.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to verify email. The link may have expired or is invalid.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85 shadow-2xl shadow-black/35 text-center">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <CardHeader className="space-y-4 pt-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-stone-900 border border-stone-800">
            {status === "loading" && <Loader2 className="size-8 animate-spin text-amber-400" />}
            {status === "success" && <CheckCircle2 className="size-8 text-green-500" />}
            {status === "error" && <XCircle className="size-8 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription className="text-stone-400">{message}</CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          {status !== "loading" && (
            <Button onClick={() => router.push("/login")} className="w-full h-12">
              Go to Login
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
