import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva("text-xs px-2 py-1 inline-flex items-center gap-1", {
  variants: {
    size: {
      default: "rounded-md font-medium",
      sm: "rounded",
      xs: "rounded text-xxs px-1.5 py-0.5",
      md: "px-2 text-xxs py-0.5 rounded",
    },
    variant: {
      default: "bg-blue-500/20 text-blue-300",
      secondary:
        "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
      destructive:
        "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
      outline:
        " bg-slate-700/50 text-xs text-white/70",
      ghost:
        "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
      link: "text-primary underline-offset-4 hover:underline",

      primaryLight:
        "bg-primary/20 text-primary border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/30",
      secondaryLight: "bg-blue-500/20 text-blue-300",
      tertiaryLight: "bg-emerald-500/20 text-emerald-300",
      destructiveLight: "bg-rose-500/20 text-rose-300",

      // ROLE SPECIFIC BADGES
      superAdmin:
        "bg-rose-500/20 text-rose-300",
      manager:
        "bg-violet-500/20 text-violet-300",
      teamLead:
        "bg-amber-500/20 text-amber-300",
      caseAnalyst:
        "bg-blue-500/20 text-blue-300",
      verificationCoordinator:
        "bg-emerald-500/20 text-emerald-300",
      qcAnalyst:
        "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
      schemaAnalyst:
        "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
      clientAdmin:
        "bg-emerald-500/20 text-emerald-300",
      msoDirector:
        "bg-emerald-500/20 text-emerald-300",
      facilityManager:
        "bg-emerald-500/20 text-emerald-300",
      cxoFinance:
        "bg-emerald-500/20 text-emerald-300",
      recruiter:
        "bg-emerald-500/20 text-emerald-300",
      provider:
        "bg-emerald-500/20 text-emerald-300",
      providerSelfService:
        "bg-emerald-500/20 text-emerald-300",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
