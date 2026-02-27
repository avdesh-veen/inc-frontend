/**
 * Auth hooks barrel export
 */

// Authentication hooks
export { useLogin, useLogout, useCurrentUser } from "./use-auth";
export { useForgotPsw } from "./use-forgot-psw";
export { useResetPsw } from "./use-reset-psw";

// Permission hooks
export {
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
} from "./use-has-permission";
export {
  useRequirePermission,
  useRequireAnyPermission,
} from "./use-require-permission";
