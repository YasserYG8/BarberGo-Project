"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/* ═══════════════════════════════════════════
   Select — Simple native select styled for dark theme
   ═══════════════════════════════════════════ */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-lg border border-stone-700 bg-stone-800/50 px-3 py-2 pr-10 text-sm text-stone-100 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:border-amber-600/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onChange={handleChange}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
