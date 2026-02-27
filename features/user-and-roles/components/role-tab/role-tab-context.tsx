"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface RoleTabContextValue {
  openCreateModal: () => void;
  openEditModal: (roleId: string) => void;
  isModalOpen: boolean;
  editRoleId: string | null;
  closeModal: () => void;
}

const RoleTabContext = React.createContext<RoleTabContextValue | null>(null);

export function useRoleTabContext() {
  const context = React.useContext(RoleTabContext);
  if (!context) {
    throw new Error("useRoleTabContext must be used within RoleTabProvider");
  }
  return context;
}

interface RoleTabProviderProps {
  children: React.ReactNode;
  initialEditRoleId?: string;
}

export function RoleTabProvider({
  children,
  initialEditRoleId,
}: Readonly<RoleTabProviderProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL if editRoleId is present
  const [isModalOpen, setIsModalOpen] = React.useState(!!initialEditRoleId);
  const [editRoleId, setEditRoleId] = React.useState<string | null>(
    initialEditRoleId ?? null
  );

  // Sync modal state when URL changes (e.g., when navigating with editRoleId)
  React.useEffect(() => {
    const urlEditRoleId = searchParams.get("editRoleId");
    if (urlEditRoleId) {
      setEditRoleId(urlEditRoleId);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const openCreateModal = React.useCallback(() => {
    setEditRoleId(null);
    setIsModalOpen(true);
  }, []);

  // Navigate to URL with editRoleId to trigger server-side prefetch
  const openEditModal = React.useCallback(
    (roleId: string) => {
      router.push(`/administration/users-roles?tab=roles&editRoleId=${roleId}`);
    },
    [router]
  );

  // Close modal and remove editRoleId from URL
  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    setEditRoleId(null);
    // Remove editRoleId from URL to clean up
    router.push("/administration/users-roles?tab=roles");
  }, [router]);

  const value = React.useMemo(
    () => ({
      openCreateModal,
      openEditModal,
      isModalOpen,
      editRoleId,
      closeModal,
    }),
    [openCreateModal, openEditModal, isModalOpen, editRoleId, closeModal]
  );

  return (
    <RoleTabContext.Provider value={value}>{children}</RoleTabContext.Provider>
  );
}
