import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

/* ═══════════════════════════════════════════
   Badge — Status badges for bookings
   ═══════════════════════════════════════════ */

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  ON_WAY: {
    label: "On Way",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  ARRIVED: {
    label: "Arrived",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  DONE: {
    label: "Done",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
  className?: string;
}) {
  const variants = {
    default: "bg-stone-800 text-stone-300 border-stone-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    destructive: "bg-red-500/10 text-red-400 border-red-500/20",
    outline: "bg-transparent text-stone-400 border-stone-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
