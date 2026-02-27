"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { findNavigationItemByHref } from "@/lib/constants/navigation";

export function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  const pathname = usePathname();

  const pageTitle = React.useMemo(() => {
    const navItem = findNavigationItemByHref(pathname);
    return navItem?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <h1
      className={cn("text-2xl font-semibold text-white", className)}
      {...props}
    >
      {pageTitle}
    </h1>
  );
}
