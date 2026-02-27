'use client';

import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Link01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSkillSets } from '@/features/settings/hooks/use-assignment';
import type { SkillSet } from '@/features/settings/types/assignment';

export function SkillSetsList() {
  const router = useRouter();
  const { data, isLoading, error } = useSkillSets();

  const handleAddSkill = () => {
    router.push('/settings/workflow/skills/new');
  };

  // Use API data - data.data contains the array of skill sets
  const skillSets = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return <SkillSetsListSkeleton />;
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">Error loading skill sets: {error.message}</p>
      </Card>
    );
  }

  if (skillSets.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-text-50">No skill sets found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Skill Sets */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground">Skill Sets</h3>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleAddSkill} 
              aria-describedby="add-skill-help"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-settings-active-bg text-settings-active-text text-sm hover:bg-settings-active-bg-hover"
            >
              <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" aria-hidden="true" />
              Add Skill
            </Button>
            <span id="add-skill-help" className="text-xs text-text-50">→ Opens Skills Configuration</span>
          </div>
        </div>

        {/* Skill Sets List */}
        <div className="space-y-3">
          {skillSets.map((skillSet: SkillSet) => (
            <div
              key={skillSet.id}
              className="p-4 rounded-xl bg-card border border-border-5 flex items-center gap-4 hover:border-border-10 transition-colors"
            >
              {/* Skills Count Badge */}
              <div className="w-10 h-10 rounded-xl bg-settings-active-bg flex items-center justify-center">
                <span className="text-settings-active-text font-bold text-sm">
                  {skillSet.skills?.length ?? 0}
                </span>
              </div>

              {/* Skill Set Info */}
              <div className="flex-1">
                <p className="font-medium text-foreground">{skillSet.name}</p>
                <p className="text-xs text-text-50">
                  {skillSet.skills?.map((skill) => skill.name).join(' • ') ?? '—'}
                </p>
              </div>

              {/* Manage Button */}
              <Button
                onClick={() => router.push('/settings/workflow/skills')}
                variant="ghost"
                size="sm"
                className="text-text-50 hover:text-foreground"
              >
                Manage
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Linked: Skills Configuration */}
      <div className="p-4 rounded-xl bg-settings-active-bg border border-settings-active-bg-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              icon={Link01Icon}
              className="w-5 h-5 text-settings-active-text"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-settings-active-text">Linked: Skills Configuration</p>
              <p className="text-xs text-text-50">
                Manage detailed skill definitions, certifications, and user assignments
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/settings/workflow/skills')}
            variant="ghost"
            size="sm"
            className="text-settings-active-text hover:text-foreground"
          >
            View Skills Config →
          </Button>
        </div>
      </div>
    </div>
  );
}

function SkillSetsListSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}
