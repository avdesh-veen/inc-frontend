import * as React from "react";


import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:bg-input/50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 disabled:select-none transition-colors flex field-sizing-content min-h-16 w-full outline-0 py-2 px-3 text-sm rounded-[12px] bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none text-white placeholder-white/30",
  {
    variants: {
      size: {
        sm: "rounded-md py-1.5 px-2",
        default: "",
        lg: "rounded-xl text-base py-3 px-4 min-h-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);


export type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants> & {
    size?: "sm" | "default" | "lg";
  };

function Textarea({ className, size = "default", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
