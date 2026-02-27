/**
 * Work Categories API
 * 
 * Exports server-side functions and client-side hooks for work categories
 */

// Server exports
export {
  getAllWorkCategoriesServer,
  getWorkCategoriesServer,
  getWorkCategoryByIdServer,
} from "./server";

// Client exports
export {
  getWorkCategoriesClient,
  getAllWorkCategoriesClient,
} from "./client";

// Actions exports
export {
  createWorkCategoryAction,
  updateWorkCategoryAction,
  deleteWorkCategoryAction,
} from "./actions";
