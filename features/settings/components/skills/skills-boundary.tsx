import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queries/query-keys";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { getCategoriesWithSkillsServer, getUsersWithSkillsServer } from "../../api/skills/server";

type SkillsBoundaryProps = {
  children: React.ReactNode;
};

const DEFAULT_USERS_WITH_SKILLS_REQUEST = { page: 1, limit: 10 };

export async function SkillsBoundary({ children }: SkillsBoundaryProps) {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.skills.categoriesWithSkills(),
      queryFn: () => getCategoriesWithSkillsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.skills.usersWithSkills(DEFAULT_USERS_WITH_SKILLS_REQUEST),
      queryFn: () => getUsersWithSkillsServer(DEFAULT_USERS_WITH_SKILLS_REQUEST),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
