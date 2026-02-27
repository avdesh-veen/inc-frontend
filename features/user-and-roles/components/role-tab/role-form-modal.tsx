"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useResources } from "../../hooks/use-resources";
import { useRoleCategories } from "../../hooks/use-role-categories";
import {
  useCreateRole,
  useRoleDetail,
  useUpdateRoleById,
} from "../../hooks/use-role-mutations";
import type {
  CreateRolePayload,
  UpdateRolePayload,
} from "../../api/roles-tab/roles-api";
import { RequiredSymbol } from "@/components/shared/required-symbol";

interface OptionItem {
  value: string;
  label: string;
}

/**
 * Helper to find an option by value
 */
function findOption(
  options: OptionItem[],
  value: string | undefined,
): OptionItem | null {
  if (!value) return null;
  return options.find((opt) => opt.value === value) || null;
}

/**
 * Get submit button label based on form state
 */
function getSubmitButtonLabel(
  isSubmitting: boolean,
  isEditMode: boolean,
): string {
  if (isSubmitting) {
    return isEditMode ? "Updating..." : "Creating...";
  }
  return isEditMode ? "Update Role" : "Create Role";
}

const roleFormSchema = z.object({
  name: z.string().min(3, "Role name must be at least 3 characters").max(50),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().max(200).optional(),
  permissions: z.record(z.string(), z.array(z.string())),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRoleId?: string | null;
}

export function RoleFormModal({
  open,
  onOpenChange,
  editRoleId,
}: RoleFormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditMode = !!editRoleId;

  // Fetch resources with permissions and categories
  const {
    data: resourcesResponse,
    isLoading: isLoadingResources,
    isError: isResourcesError,
    error: resourcesError,
  } = useResources();
  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
  } = useRoleCategories({
    page: 1,
    limit: 100,
    search: "",
  });

  // Fetch role details when in edit mode
  const {
    data: roleDetailResponse,
    isLoading: isLoadingRoleDetail,
    isFetching: isFetchingRoleDetail,
    isError: isRoleDetailError,
    error: roleDetailError,
  } = useRoleDetail(editRoleId ?? null);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRoleById();

  const isLoadingFormData = isLoadingResources || isLoadingCategories;
  const isLoadingPermissions = isEditMode && (isLoadingRoleDetail || isFetchingRoleDetail);
  const isLoading = isLoadingFormData;
  const isError = isResourcesError || isCategoriesError || isRoleDetailError;
  const error = resourcesError || categoriesError || roleDetailError;

  // Transform categories to Combobox options
  const categoryOptions = React.useMemo<OptionItem[]>(() => {
    if (!categoriesResponse?.data?.items) return [];
    return categoriesResponse.data.items.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categoriesResponse?.data?.items]);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      permissions: {},
    },
  });

  // Initialize permissions when resources are loaded OR populate with existing role data in edit mode
  React.useEffect(() => {
    if (resourcesResponse?.data && open) {
      const initialPermissions: Record<string, string[]> = {};

      // Initialize all resources with empty arrays
      resourcesResponse.data.forEach((resource) => {
        initialPermissions[resource.id] = [];
      });

      // If in edit mode and role detail is loaded, populate with existing permissions
      if (isEditMode && roleDetailResponse?.data) {
        const roleData = roleDetailResponse.data;

        // Set form values from role detail
        form.setValue("name", roleData.roleName);
        form.setValue("categoryId", roleData.roleCategoryId);
        form.setValue("description", roleData.description || "");

        // Populate permissions from role detail
        roleData.permissions.forEach((resourcePerm) => {
          const permissionIds = resourcePerm.permissions.map((p) => p.id);
          initialPermissions[resourcePerm.resourceId] = permissionIds;
        });
      }

      form.setValue("permissions", initialPermissions);
    }
  }, [resourcesResponse, open, form, isEditMode, roleDetailResponse]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        categoryId: "",
        description: "",
        permissions: {},
      });
    }
  }, [open, form]);

  /** Build original form values from role detail (for edit-mode diff). Uses same shape as form: all resources then filled from role. */
  const getOriginalFormValues = (): RoleFormValues | null => {
    const role = roleDetailResponse?.data;
    const resources = resourcesResponse?.data;
    if (!role || !resources) return null;
    const initialPermissions: Record<string, string[]> = {};
    resources.forEach((resource) => {
      initialPermissions[resource.id] = [];
    });
    role.permissions.forEach((resourcePerm) => {
      const permissionIds = resourcePerm.permissions.map((p) => p.id);
      initialPermissions[resourcePerm.resourceId] = permissionIds;
    });
    return {
      name: role.roleName,
      categoryId: role.roleCategoryId,
      description: role.description ?? "",
      permissions: initialPermissions,
    };
  };

  /**
   * Returns only changed fields as API payload (Partial<UpdateRolePayload>).
   * Compares form data to original; permissions use same key set as form so we only mark changed when values differ.
   */
  const getChangedFieldsAsPayload = (
    data: RoleFormValues,
  ): Partial<UpdateRolePayload> => {
    const original = getOriginalFormValues();
    if (!original) return {};

    const payload: Partial<UpdateRolePayload> = {};
    if (data.name !== original.name) payload.roleName = data.name;
    if (data.categoryId !== original.categoryId)
      payload.roleCategoryId = data.categoryId;
    if (data.description !== original.description)
      payload.description = data.description;

    // Deep compare permissions (same keys as form: all resources)
    const origKeys = Object.keys(original.permissions).sort((a, b) =>
      a.localeCompare(b),
    );
    const dataKeys = Object.keys(data.permissions).sort((a, b) =>
      a.localeCompare(b),
    );
    const keysMatch =
      origKeys.length === dataKeys.length &&
      origKeys.every((k, i) => k === dataKeys[i]);
    const permsChanged =
      !keysMatch ||
      origKeys.some((key) => {
        const a = [...(original.permissions[key] ?? [])].sort((x, y) =>
          x.localeCompare(y),
        );
        const b = [...(data.permissions[key] ?? [])].sort((x, y) =>
          x.localeCompare(y),
        );
        return JSON.stringify(a) !== JSON.stringify(b);
      });
    if (permsChanged) {
      payload.permissions = Object.entries(data.permissions)
        .filter(([, perms]) => perms.length > 0)
        .map(([moduleId, perms]) => ({ moduleId, permissions: perms }));
    }

    return payload;
  };

  const handleSubmit = async (data: RoleFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && editRoleId) {
        const updatePayload = getChangedFieldsAsPayload(data);
        if (Object.keys(updatePayload).length === 0) {
          onOpenChange(false);
          return;
        }
        await updateRoleMutation.mutateAsync({
          id: editRoleId,
          data: updatePayload,
        });
      } else {
        const permissionsPayload = Object.entries(data.permissions)
          .filter(([, perms]) => perms.length > 0)
          .map(([moduleId, perms]) => ({ moduleId, permissions: perms }));
        
        const createPayload: CreateRolePayload = {
          roleName: data.name,
          roleCategoryId: data.categoryId,
          description: data.description,
          permissions: permissionsPayload,
        };
        await createRoleMutation.mutateAsync(createPayload);
      }

      // Close modal on success (toast is handled in the hook)
      onOpenChange(false);
    } catch {
      // Error toast is handled in the hook's onError callback
      // Just stop the submitting state here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Map resources to module structure with standard permissions
  // Track expanded modules
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set(),
  );

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Toggle permission for a resource
  const togglePermission = (resourceId: string, permissionId: string) => {
    const currentPermissions =
      form.getValues(`permissions.${resourceId}`) || [];
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((p) => p !== permissionId)
      : [...currentPermissions, permissionId];
    form.setValue(`permissions.${resourceId}`, newPermissions);
  };

  const watchedPermissions = form.watch("permissions");

  const isPermissionSelected = (resourceId: string, permissionId: string) => {
    const permissions = watchedPermissions?.[resourceId] || [];
    return permissions.includes(permissionId);
  };

  const getSelectedCount = (resourceId: string) => {
    const permissions = watchedPermissions?.[resourceId] || [];
    return permissions.length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-6 flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? "Edit Role" : "Create Custom Role"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8" />
          </div>
        )}

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load resources: {error?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && resourcesResponse?.data && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6 scrollbar-thin">
                {isLoadingPermissions ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  </div>
                ) : (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Role Name <RequiredSymbol />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Analyst"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Category <RequiredSymbol />
                        </FormLabel>
                        <Combobox<OptionItem>
                          items={categoryOptions}
                          itemToStringValue={(item) => item?.label ?? ""}
                          value={findOption(categoryOptions, field.value)}
                          onValueChange={(item) => {
                            field.onChange(item?.value ?? "");
                          }}
                          disabled={isLoadingCategories}
                        >
                          <ComboboxInput
                            placeholder={
                              isLoadingCategories
                                ? "Loading..."
                                : "Select category"
                            }
                            showClear={!!field.value}
                            disabled={isLoadingCategories}
                          />
                          <ComboboxContent>
                            <ComboboxEmpty>No categories found</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item.value} value={item}>
                                  {item.label}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Brief description..."
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                )}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/70">
                    Permission Matrix
                  </h3>

                  <div className="border rounded-[24px] overflow-hidden bg-white/3 backdrop-blur-2xl">
                    {resourcesResponse.data.map((resource, index) => {
                      const isExpanded = expandedModules.has(resource.id);
                      const selectedCount = getSelectedCount(resource.id);
                      const totalPermissions = resource.permissions.length;

                      return (
                        <div
                          key={resource.id}
                          className={`${index !== resourcesResponse.data.length - 1 ? "border-b" : ""}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleModule(resource.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                            disabled={isSubmitting || isLoadingPermissions}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-white/80">
                                {resource.resourceName}
                              </div>
                              {isLoadingPermissions ? (
                                <Skeleton className="h-5 w-20 rounded-xl" />
                              ) : (
                                selectedCount > 0 && (
                                  <div className="text-xs text-muted-foreground bg-white/10 px-2 py-1 rounded-xl">
                                    {selectedCount}/{totalPermissions} selected
                                  </div>
                                )
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                {totalPermissions}{" "}
                                {totalPermissions === 1
                                  ? "permission"
                                  : "permissions"}
                              </span>
                              <svg
                                className={`size-4 text-muted-foreground transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-4 bg-muted/10 border-t">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {resource.permissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center gap-2.5"
                                  >
                                    <Checkbox
                                      id={`${resource.id}-${permission.id}`}
                                      checked={isPermissionSelected(
                                        resource.id,
                                        permission.id,
                                      )}
                                      onCheckedChange={() =>
                                        togglePermission(
                                          resource.id,
                                          permission.id,
                                        )
                                      }
                                      disabled={isSubmitting || isLoadingPermissions}
                                    />
                                    <label
                                      htmlFor={`${resource.id}-${permission.id}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {permission.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t shrink-0">
                <Button
                  type="button"
                  variant="muted"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant='secondary' disabled={isSubmitting || isLoadingPermissions}>
                  {getSubmitButtonLabel(isSubmitting, isEditMode)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
