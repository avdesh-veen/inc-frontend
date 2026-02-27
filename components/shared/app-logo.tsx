import * as React from "react";
import Image from "next/image";

export function AppLogo() {
  return (
    <div className="flex justify-center items-center gap-3">
      <Image
        src="/logo.webp"
        alt="InCredibly Logo"
        priority
        width={44}
        height={44}
      />
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
        InCredibly
      </span>
    </div>
  );
}
