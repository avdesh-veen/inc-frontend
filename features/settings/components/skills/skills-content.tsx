"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { SkillDefinitionsTab } from "./skill-definitions-tab";
import { UserAssignmentsTab } from "./user-assignments-tab";
import { useCategoriesWithSkills, useDeleteSkill } from "../../hooks/use-skills";
import type { CategorySkillItem } from "../../types";

export function SkillsContent() {
  const router = useRouter();
  const { data, isLoading, isError } = useCategoriesWithSkills();
  const deleteSkill = useDeleteSkill();
  const categories = data?.data ?? [];

  const handleCreateSkill = () => {
    router.push("/settings/workflow/skills/new");
  };

  const handleEditSkill = (skill: CategorySkillItem) => {
    router.push(`/settings/workflow/skills/${skill.id}/edit`);
  };

  const handleDeleteSkill = (id: string) => {
    deleteSkill.mutate(id);
  };

  if (isLoading) {
    return <SkillsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">Failed to load skills. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="definitions">
      <TabsList variant="glass" className="gap-2">
        <TabsTrigger value="definitions" variant='secondary'>Skill Definitions</TabsTrigger>
        <TabsTrigger value="assignments" variant='secondary'>User Assignments</TabsTrigger>
      </TabsList>

      <TabsContent value="definitions" className="mt-4 border-t border-white/10 pt-6">
        <SkillDefinitionsTab
          categories={categories}
          onCreateSkill={handleCreateSkill}
          onEditSkill={handleEditSkill}
          onDeleteSkill={handleDeleteSkill}
        />
      </TabsContent>

      <TabsContent value="assignments" className="mt-6">
        <UserAssignmentsTab />
      </TabsContent>
    </Tabs>
  );
}

function SkillsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
          <Skeleton className="h-32 w-full rounded-[24px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-[24px]" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
