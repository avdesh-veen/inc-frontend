"use server";

import { logger } from "@/lib/logger";
import { createSkillServer, deleteSkillServer, updateSkillServer } from "./server";
import type { CreateSkillPayload, UpdateSkillPayload } from "@/features/settings/types";

export type CreateSkillResult =
  | { success: true }
  | { success: false; error: string };

export type UpdateSkillResult =
  | { success: true }
  | { success: false; error: string };

export type DeleteSkillResult =
  | { success: true }
  | { success: false; error: string };

export async function createSkillAction(
  data: CreateSkillPayload,
): Promise<CreateSkillResult> {
  try {
    await createSkillServer(data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create skill";
    return { success: false, error: message };
  }
}

export async function updateSkillAction(
  id: string,
  data: UpdateSkillPayload,
): Promise<UpdateSkillResult> {
  try {
    await updateSkillServer(id, data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update skill";
    return { success: false, error: message };
  }
}

export async function deleteSkillAction(id: string): Promise<DeleteSkillResult> {
  logger("[deleteSkillAction] payload:", { id });
  try {
    await deleteSkillServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete skill";
    return { success: false, error: message };
  }
}
