import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:bg-input/50 transition-colors outline-0 w-full min-w-0 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 disabled:select-none flex-1 py-2 px-3 text-sm bg-white/5 border border-white/10 rounded-[12px] bg-white/5 border border-white/10 text-white",
  {
    variants: {
      variant: {
        default: "focus:border-violet-500/50 focus:outline-none",
        primary: 'focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-emerald-500 focus-visible:outline-offset-2 focus-visible:ring-0 aria-invalid:ring-[3px]',
        outline: "",
      },
      size: {
        sm: "rounded-md",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    size?: "sm" | "default" | "lg";
  };

function Input({
  className,
  type,
  variant,
  size = "default",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size }), "text-white placeholder-white/30", className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
