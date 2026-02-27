import { Suspense } from "react";
import { SkillsBoundary } from "@/features/settings/components/skills/skills-boundary";
import { SkillsContent } from "@/features/settings/components/skills/skills-content";
import SkillsLoading from "./loading";

export default async function SkillsPage() {
  return (
    <Suspense fallback={<SkillsLoading />}>
      <SkillsBoundary>
        <SkillsContent />
      </SkillsBoundary>
    </Suspense>
  );
}
