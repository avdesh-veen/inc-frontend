/**
 * Auth components barrel export
 */

// Permission components
export { PermissionGuard } from "./permission-guard";
export { PermissionDeniedPlaceholder } from "./permission-denied-placeholder";
export { PermissionDeniedPage } from "./permission-denied-page";

// Auth forms
export { LoginForm } from "./login-form";
export { ForgotPswForm } from "./forgot-psw-form";
export { ResetPswForm } from "./reset-psw-form";

// Hydration
export { CurrentUserHydration } from "./current-user-hydration";

// Cross-tab sync
export { CrossTabAuthSync, broadcastLogin, broadcastLogout } from "./cross-tab-auth-sync";
