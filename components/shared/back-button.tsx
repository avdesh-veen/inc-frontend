import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  children?: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  iconOnly?: boolean;
}

export function BackButton({ href, children, variant = "ghost", iconOnly = true }: Readonly<BackButtonProps>) {
  return (
    <Link href={href}>
      <Button
        variant={variant}
        size={iconOnly ? "icon-sm" : "icon-xs"}
        className={iconOnly ? "p-2 rounded-[12px] size-9 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white" : "pl-0 gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent"}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="size-5"
          strokeWidth={2}
        />
        {!iconOnly && (children ?? "Back")}
      </Button>
    </Link>
  );
}
