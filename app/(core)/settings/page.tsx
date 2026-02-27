/**
 * Settings Root Page
 *
 * Redirects to the default settings page (Work Types).
 */

import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/settings/workflow/work-types");
}
