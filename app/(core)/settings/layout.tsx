"use client";

import * as React from "react";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 p-8 flex-1">
      <SettingsSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Configuration Center
          </h2>
          <p className="text-sm text-white/50">
            Manage system preferences, integrations, and security
          </p>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
}
