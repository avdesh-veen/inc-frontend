"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/hooks/use-auth";

interface UserMenuProps {
  children: React.ReactNode;
}

/**
 * UserMenu - Dropdown menu component for user actions
 *
 * Provides a dropdown menu with user-related actions including Profile,
 * Settings, Switch User, and Logout. Features glass morphism styling.
 *
 * Renders the dropdown only after mount to avoid Radix useId hydration
 * mismatch between server and client.
 */
export function UserMenu({ children }: UserMenuProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const router = useRouter();
  const { mutateAsync: logout } = useLogout();

  const handleProfileClick = () => router.push("/profile");
  const handleSettingsClick = () => router.push("/settings");
  const handleLogoutClick = () => logout();

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className={cn(
          "bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto p-0",
        )}
      >
        <DropdownMenuLabel className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-5 py-2.5">
          My Account
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <div className="px-2 py-1">
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem
            onClick={handleProfileClick}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer transition-all duration-200 [&>svg]:text-sidebar-foreground/50 hover:[&>svg]:text-sidebar-foreground"
          >
            <HugeiconsIcon icon={UserIcon} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSettingsClick}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer transition-all duration-200 [&>svg]:text-sidebar-foreground/50 hover:[&>svg]:text-sidebar-foreground"
          >
            <HugeiconsIcon icon={Settings01Icon} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogoutClick}
          variant="destructive"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-200 [&>svg]:text-destructive"
        >
          <HugeiconsIcon icon={Logout01Icon} />
          Logout
        </DropdownMenuItem>
      </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
