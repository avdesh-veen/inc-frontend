"use server";

import {
  createWorkTypeServer,
  updateWorkTypeServer,
  toggleWorkTypeStatusServer,
  deleteWorkTypeServer,
  deleteWorkflowStageServer,
  deleteGateRequirementServer,
} from "./server";
import { WorkTypeFormData } from "../../types/work-types";

export type CreateWorkTypeResult =
  | { success: true }
  | { success: false; error: string };

export async function createWorkTypeAction(
  data: WorkTypeFormData,
): Promise<CreateWorkTypeResult> {
  try {
    await createWorkTypeServer(data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create work type";
    return { success: false, error: message };
  }
}

export type UpdateWorkTypeResult =
  | { success: true }
  | { success: false; error: string };

export async function updateWorkTypeAction(
  id: string,
  data: Partial<WorkTypeFormData>,
): Promise<UpdateWorkTypeResult> {
  try {
    await updateWorkTypeServer(id, data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update work type";
    return { success: false, error: message };
  }
}

export type ToggleWorkTypeStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function toggleWorkTypeStatusAction(
  id: string,
  isActive: boolean,
): Promise<ToggleWorkTypeStatusResult> {
  try {
    await toggleWorkTypeStatusServer(id, isActive);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to toggle work type status";
    return { success: false, error: message };
  }
}

export type DeleteWorkTypeResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteWorkTypeAction(
  id: string,
): Promise<DeleteWorkTypeResult> {
  try {
    await deleteWorkTypeServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete work type";
    return { success: false, error: message };
  }
}

export type DeleteWorkflowStageResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteWorkflowStageAction(
  id: string,
): Promise<DeleteWorkflowStageResult> {
  try {
    await deleteWorkflowStageServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete workflow stage";
    return { success: false, error: message };
  }
}

export type DeleteGateRequirementResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteGateRequirementAction(
  id: string,
): Promise<DeleteGateRequirementResult> {
  try {
    await deleteGateRequirementServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete gate requirement";
    return { success: false, error: message };
  }
}
