"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FooterProps extends React.ComponentProps<"footer"> {
  children?: React.ReactNode;
}

export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn("px-8 py-6 border-t border-white/5 shrink-0", className)}
      role="contentinfo"
      aria-label="Footer"
      {...props}
    >
      {children || (
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="InCredibly"
              width={20}
              height={20}
            />
            <span>InCredibly Platform</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <div className="flex items-center gap-1.5">
              <Image
                src="/images/neolytix.webp"
                alt="Neolytix"
                width={16}
                height={16}
              />
              <span className="text-white/50 font-medium">Neolytix</span>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
