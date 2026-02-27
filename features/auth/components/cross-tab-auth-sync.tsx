"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/lib/constants/navigation";
import { queryKeys } from "@/lib/queries/query-keys";

const AUTH_CHANNEL_NAME = "auth_sync";

type AuthEventType = "login" | "logout";

interface AuthMessage {
  type: AuthEventType;
  sourceTabId: string;
}

/** Unique ID for this tab, stable across re-renders but unique per tab. */
const TAB_ID =
  typeof crypto !== "undefined"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * CrossTabAuthSync - Synchronizes authentication state across browser tabs
 *
 * Listens for auth events broadcast from other tabs via BroadcastChannel.
 * Ignores events originating from the current tab (via sourceTabId) to
 * prevent duplicate side-effects.
 *
 * - On logout: awaits query cancellation, clears cache, redirects to login.
 * - On login: invalidates auth queries and triggers a router refresh so
 *   Next.js server layout re-evaluates auth.
 */
export function CrossTabAuthSync() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const tabIdRef = useRef(TAB_ID);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

    channel.onmessage = async (event: MessageEvent<AuthMessage>) => {
      const data = event.data;

      if (
        !data ||
        typeof data !== "object" ||
        typeof data.type !== "string" ||
        typeof data.sourceTabId !== "string"
      ) {
        return;
      }

      const { type, sourceTabId } = data;

      if (sourceTabId === tabIdRef.current) return;

      if (type === "logout") {
        await queryClient.cancelQueries();
        queryClient.clear();
        router.replace(appRoutes.auth.login);
      }

      if (type === "login") {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.auth.all,
        });
        router.refresh();
      }
    };

    return () => {
      channel.close();
    };
  }, [queryClient, router]);

  return null;
}

/**
 * Broadcasts an auth event to all other open tabs.
 * Includes the current tab's ID so receivers can ignore self-messages.
 */
function broadcastAuthEvent(type: AuthEventType) {
  if (typeof BroadcastChannel === "undefined") return;

  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
  const message: AuthMessage = { type, sourceTabId: TAB_ID };
  channel.postMessage(message);
  channel.close();
}

/**
 * Broadcasts a logout event to all other open tabs.
 * Should be called during the logout flow after the API call succeeds.
 */
export function broadcastLogout() {
  broadcastAuthEvent("logout");
}

/**
 * Broadcasts a login event to all other open tabs.
 * Should be called during the login flow after the API call succeeds.
 */
export function broadcastLogin() {
  broadcastAuthEvent("login");
}
