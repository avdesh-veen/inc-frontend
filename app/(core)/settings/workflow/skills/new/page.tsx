import { CreateSkillContent } from "@/features/settings/components/skills/create-skill-content";

export const dynamic = "force-dynamic";

export default function NewSkillPage() {
  return (
    <div className="flex-1 border-t border-white/10 pt-6 mt-4">
      <CreateSkillContent />
    </div>
  );
}
 