/** Layout calls getCurrentUser() which needs API_BASE_URL; skip static prerender for all (core) routes. */
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { MainContent } from "@/components/layout/main-content";

import { getCurrentUser } from "@/features/auth/api/login/server";
import { CurrentUserHydration } from "@/features/auth/components/current-user-hydration";

import { appRoutes } from "@/lib/constants/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function CoreLayout(props: LayoutProps) {
  const { children } = props;

  // Server-side auth check
  const { data: userData } = await getCurrentUser();
  if (!userData?.id) redirect(appRoutes.auth.login);

  // Get sidebar state from cookies
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen =
    sidebarState?.value === "true" || sidebarState?.value === undefined;

  return (
    <CurrentUserHydration>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </SidebarProvider>
    </CurrentUserHydration>
  );
}
