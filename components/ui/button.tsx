import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[12px] border border-transparent bg-clip-padding text-sm [&_svg:not([class*='size-'])]:size-4 inline-flex items-center gap-2 justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none outline-0 has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot=input-group-control]:focus-visible]:outline-emerald-500 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 enabled:cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "text-white h-9 font-semibold bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_8px_24px_rgb(16_185_129_/_0.25)] hover:scale-[1.02]",
        "ghost-primary": "text-emerald-400 hover:text-emerald-300",
        "ghost-destructive": "text-destructive hover:text-destructive/80 hover:bg-destructive/10",
        submit:
          "bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium hover:from-violet-600 hover:to-blue-600 bg-clip-border",
        secondary: 'bg-violet-500 text-white hover:bg-violet-600',
        secondaryMuted: 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30',
        primary: 'text-white bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_8px_24px_rgb(16_185_129_/_0.25)] hover:from-emerald-600 hover:to-teal-600',
        tertiary: 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30',
        tertiaryMuted: 'bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600',
        muted: "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
        ghost: 'bg-none hover:bg-white/10 text-white/50 hover:text-white',
        outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground border",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        xs: "px-2 py-1 text-xs font-normal hover:scale-none",
        sm: "px-3 py-1.5",
        md: "px-3 py-1.5 rounded-md",
        lg: "px-5 py-2.5 text-base h-10",
        xl: "px-6 py-2",
        icon: "size-10 p-0",
        "icon-sm": "size-9 p-0",
        "icon-xs": "size-7 rounded-md flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
