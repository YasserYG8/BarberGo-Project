import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-amber-600 text-stone-950 hover:bg-amber-500 glow-gold font-semibold shadow-lg shadow-amber-900/20",
        outline:
          "border border-stone-700 bg-transparent text-stone-300 hover:bg-stone-800 hover:text-stone-100 hover:border-stone-600",
        secondary:
          "bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700",
        ghost:
          "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50",
        destructive:
          "bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 hover:text-red-300",
        link: "text-amber-500 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
