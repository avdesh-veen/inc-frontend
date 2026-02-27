"use server";

import {
  createWaitReasonServer,
  updateWaitReasonServer,
  deleteWaitReasonServer,
} from "./server";
import type {
  CreateWaitReasonPayload,
  UpdateWaitReasonPayload,
} from "@/features/settings/types/wait-reasons-api";

export type CreateWaitReasonResult =
  | { success: true }
  | { success: false; error: string };

export async function createWaitReasonAction(
  data: CreateWaitReasonPayload,
): Promise<CreateWaitReasonResult> {
  try {
    await createWaitReasonServer(data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create wait reason";
    return { success: false, error: message };
  }
}

export type UpdateWaitReasonResult =
  | { success: true }
  | { success: false; error: string };

export async function updateWaitReasonAction(
  id: string,
  data: UpdateWaitReasonPayload,
): Promise<UpdateWaitReasonResult> {
  try {
    await updateWaitReasonServer(id, data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update wait reason";
    return { success: false, error: message };
  }
}

export type DeleteWaitReasonResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteWaitReasonAction(
  id: string,
): Promise<DeleteWaitReasonResult> {
  try {
    await deleteWaitReasonServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete wait reason";
    return { success: false, error: message };
  }
}
