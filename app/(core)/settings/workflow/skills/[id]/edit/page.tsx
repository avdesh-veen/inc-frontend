import { CreateSkillContent } from "@/features/settings/components/skills/create-skill-content";

export const dynamic = "force-dynamic";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: Readonly<EditSkillPageProps>) {
  const { id } = await params;

  return (
    <div className="flex-1 border-t border-white/10 pt-6 mt-4">
      <CreateSkillContent skillId={id} />
    </div>
  );
}
