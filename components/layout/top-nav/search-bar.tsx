"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function SearchBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle Cmd/Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "relative hidden md:flex items-center",
        "w-60 light:border light:border-white/10 light:rounded-lg",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="absolute left-3 w-4 h-4 text-white/50 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        className={cn(
          "w-full h-10 pl-9 pr-16",
          "bg-white/5 backdrop-blur-sm",
          "border border-white/10 rounded-lg",
          "text-sm text-white placeholder:text-white/50",
          "focus:outline-none focus:border-emerald-500/50",
          "transition-all duration-200 motion-reduce:transition-none",
        )}
        aria-label="Search the application. Press Command K or Control K to focus"
        role="searchbox"
      />
      <kbd
        className={cn(
          "absolute right-2 px-2 py-0.5",
          "text-[10px] font-semibold text-white/50",
          "bg-white/5 border border-white/10 rounded",
          "pointer-events-none",
        )}
        aria-hidden="true"
      >
        ⌘K
      </kbd>
    </div>
  );
}
