/**
 * Work Categories Server Actions
 * 
 * Server actions for work category mutations.
 * Used for form submissions and data modifications.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import type { ApiResponse } from "@/lib/api/types";
import type { WorkCategory } from "../../types/work-category";
import type { WorkCategoryFormData } from "../../validations/work-category-schemas";
import { logger } from '@/lib/logger';

/**
 * Create new work category (server action)
 * 
 * @param data - Work category form data
 * @returns Promise with created work category
 */
export async function createWorkCategoryAction(
  data: WorkCategoryFormData
): Promise<ApiResponse<WorkCategory | undefined>> {
  try {
    const result = await fetchServer.post<ApiResponse<WorkCategory>>(
      API_ENDPOINTS.workCategories.create,
      data
    );

    if (!result.status) {
      return {
        status: false,
        statusCode: result.statusCode,
        data: result.data,
        message:
          typeof result.message === "string"
            ? result.message
            : result.message.join(", "),
      };
    }

    // Revalidate the work types page
    revalidatePath('/settings/workflow/work-types');

    return result;
  } catch (error) {
    logger(String(error), { error });
    return {
      status: false,
      message:
        error instanceof Error ? error.message : 'Failed to create work category',
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Update existing work category (server action)
 * 
 * @param id - Work category ID
 * @param data - Work category form data
 * @returns Promise with updated work category
 */
export async function updateWorkCategoryAction(
  id: string,
  data: Partial<WorkCategoryFormData>
): Promise<ApiResponse<WorkCategory | undefined>> {
  try {
    const result = await fetchServer.put<ApiResponse<WorkCategory>>(
      API_ENDPOINTS.workCategories.update(id),
      data
    );

    if (!result.status) {
      return {
        status: false,
        statusCode: result.statusCode,
        data: result.data,
        message:
          typeof result.message === "string"
            ? result.message
            : result.message.join(", "),
      };
    }

    // Revalidate the work types page
    revalidatePath('/settings/workflow/work-types');

    return result;
  } catch (error) {
    logger(String(error), { error });
    return {
      status: false,
      message:
        error instanceof Error ? error.message : 'Failed to update work category',
      statusCode: 500,
      data: undefined,
    };
  }
}

/**
 * Delete work category (server action)
 * 
 * @param id - Work category ID
 * @returns Promise with deletion result
 */
export async function deleteWorkCategoryAction(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const result = await fetchServer.delete<ApiResponse<void>>(
      API_ENDPOINTS.workCategories.delete(id)
    );

    if (!result.status) {
      return {
        status: false,
        statusCode: result.statusCode,
        data: result.data,
        message:
           typeof result.message === "string"
            ? result.message
            : result.message.join(", "),
      };
    }

    // Revalidate the work types page
    revalidatePath('/settings/workflow/work-types');

    return result;
  } catch (error) {
    logger(String(error), { error });
    return {
      status: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete work category',
      statusCode: 500,
      data: undefined,
    };
  }
}
