"use server";

import {
  createTriggerEventServer,
  updateTriggerEventServer,
  toggleTriggerEventStatusServer,
  deleteTriggerEventServer,
} from "./server";
import { TriggerEventFormData } from "../../validations/trigger-events-schemas";

export type CreateTriggerEventResult =
  | { success: true }
  | { success: false; error: string };

export async function createTriggerEventAction(
  data: TriggerEventFormData,
): Promise<CreateTriggerEventResult> {
  try {
    await createTriggerEventServer(data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to create trigger event";
    return { success: false, error: message };
  }
}

export type UpdateTriggerEventResult =
  | { success: true }
  | { success: false; error: string };

export async function updateTriggerEventAction(
  id: string,
  data: Partial<TriggerEventFormData>,
): Promise<UpdateTriggerEventResult> {
  try {
    await updateTriggerEventServer(id, data);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update trigger event";
    return { success: false, error: message };
  }
}

export type ToggleTriggerEventStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function toggleTriggerEventStatusAction(
  id: string,
  isActive: boolean,
): Promise<ToggleTriggerEventStatusResult> {
  try {
    await toggleTriggerEventStatusServer(id, isActive);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to toggle trigger event status";
    return { success: false, error: message };
  }
}

export type DeleteTriggerEventResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteTriggerEventAction(
  id: string,
): Promise<DeleteTriggerEventResult> {
  try {
    await deleteTriggerEventServer(id);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete trigger event";
    return { success: false, error: message };
  }
}
