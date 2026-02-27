"use server";

import {
  createFollowUpRuleServer,
  updateFollowUpRuleServer,
  deleteFollowUpRuleServer,
  toggleFollowUpRuleStatusServer,
} from "./server";
import type { CreateFollowUpRulePayload } from "@/features/settings/types";

export type CreateFollowUpRuleResult =
  | { success: true }
  | { success: false; error: string };

export async function createFollowUpRuleAction(
  data: CreateFollowUpRulePayload,
): Promise<CreateFollowUpRuleResult> {
  try {
    await createFollowUpRuleServer(data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create follow-up rule";
    return { success: false, error: message };
  }
}

export type UpdateFollowUpRuleResult =
  | { success: true }
  | { success: false; error: string };

export async function updateFollowUpRuleAction(
  id: string,
  data: CreateFollowUpRulePayload,
): Promise<UpdateFollowUpRuleResult> {
  try {
    await updateFollowUpRuleServer(id, data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update follow-up rule";
    return { success: false, error: message };
  }
}

export type DeleteFollowUpRuleResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteFollowUpRuleAction(
  id: string,
): Promise<DeleteFollowUpRuleResult> {
  try {
    await deleteFollowUpRuleServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete follow-up rule";
    return { success: false, error: message };
  }
}

export type ToggleFollowUpRuleStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function toggleFollowUpRuleStatusAction(
  id: string,
  isActive: boolean,
): Promise<ToggleFollowUpRuleStatusResult> {
  try {
    await toggleFollowUpRuleStatusServer(id, isActive);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to toggle follow-up rule status";
    return { success: false, error: message };
  }
}
