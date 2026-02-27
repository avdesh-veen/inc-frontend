"use client";

import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { TopNav } from "./top-nav/top-nav";
import { Footer } from "./footer";

interface MainContentProps extends React.ComponentProps<typeof SidebarInset> {
  children: React.ReactNode;
}

export function MainContent({
  children,
  className,
  ...props
}: MainContentProps) {
  return (
    <SidebarInset
      className={cn(
        "flex flex-1 flex-col h-screen overflow-hidden",
        "transition-all duration-200 ease-linear",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <TopNav />
      <main
        id="main-content"
        className="flex flex-1 flex-col overflow-auto"
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      <Footer />
    </SidebarInset>
  );
}
