/**
 * Skill Form Modal Component
 *
 * Modal wrapper for the SkillForm component.
 * Handles create and edit modes.
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SkillForm } from "./skill-form";
import { useCreateSkill, useUpdateSkill } from "../../hooks/use-skills";
import type { SkillApiItem, SkillCategory, WorkType } from "../../types";
import type { SkillFormData } from "../../validations/schemas";

export interface SkillFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler called when modal should close */
  onClose: () => void;
  /** Skill to edit (null for create mode) */
  skill?: SkillApiItem | null;
  /** Available categories from the API */
  categories: SkillCategory[];
  /** Available work types from the API */
  workTypes: WorkType[];
}

export function SkillFormModal({
  isOpen,
  onClose,
  skill,
  categories,
  workTypes,
}: Readonly<SkillFormModalProps>) {
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const isPending = skill ? updateSkill.isPending : createSkill.isPending;

  const handleSubmit = (data: SkillFormData) => {
    const payload = {
      ...data,
      certificationValidity: data.certificationValidity ?? null,
    };
    if (skill) {
      updateSkill.mutate(
        { id: skill.id, ...payload },
        { onSuccess: onClose },
      );
    } else {
      createSkill.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {skill ? "Edit Skill" : "Create New Skill"}
          </DialogTitle>
          <DialogDescription>
            {skill
              ? "Update the skill information below."
              : "Define a new skill with proficiency level and certification requirements."}
          </DialogDescription>
        </DialogHeader>

        <SkillForm
          skill={skill}
          categories={categories}
          workTypes={workTypes}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
