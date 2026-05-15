"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="luxury-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
      <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Dashboard error</p>
      <h2 className="mt-4 font-heading text-3xl font-semibold text-stone-100">
        Something went wrong while loading this page.
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-stone-400">
        {error.message || "Please retry. If this keeps happening, sign in again and try once more."}
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
