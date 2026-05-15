import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   Skeleton — Shimmer loading placeholder
   ═══════════════════════════════════════════ */

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-lg", className)}
      {...props}
    />
  );
}

/** Card skeleton for hairdresser listings, bookings, etc. */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Row skeleton for booking/table items */
export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-stone-800 bg-stone-900">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

/** Stats card skeleton */
export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}
