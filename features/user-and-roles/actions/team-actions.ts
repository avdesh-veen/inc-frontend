"use server";

import { createTeamServer, updateTeamServer } from "../api/team-tab/server";
import type { CreateTeamPayload, UpdateTeamPayload } from "../types/team-tab";

export type CreateTeamResult = { success: true } | { success: false; error: string };

export async function createTeamAction(
  payload: CreateTeamPayload
): Promise<CreateTeamResult> {
  try {
    await createTeamServer(payload);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create team";
    return { success: false, error: message };
  }
}

export type UpdateTeamResult = { success: true } | { success: false; error: string };

export async function updateTeamAction(
  teamId: string,
  payload: Partial<UpdateTeamPayload>,
): Promise<UpdateTeamResult> {
  try {
    await updateTeamServer(teamId, payload);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update team";
    return { success: false, error: message };
  }
}
