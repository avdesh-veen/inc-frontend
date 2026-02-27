"use client";

import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { updateTeamAction } from "../../actions/team-actions";
import { toast } from "sonner";
import type { Team, UpdateTeamPayload } from "../../types/team-tab";
import { TeamLeadAutoComplete } from "./team-lead-auto-complete";

const editTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  teamLeadId: z.string().nullable().optional(),
  focusArea: z.string().optional(),
  isActive: z.boolean(),
});

type EditTeamFormValues = z.infer<typeof editTeamSchema>;

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onSuccess?: () => void;
}

export function EditTeamModal({
  open,
  onOpenChange,
  team,
  onSuccess,
}: EditTeamModalProps) {
  const form = useForm<EditTeamFormValues>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: "",
      teamLeadId: null,
      focusArea: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open && team) {
      form.reset({
        name: team.name ?? "",
        teamLeadId: team.teamLead?.id ?? null,
        focusArea: team.focusArea ?? "",
        isActive: team.isActive ?? true,
      });
    }
  }, [open, team, form]);

  /** Returns only form fields that differ from the current team (for update payload). */
  function getChangedFields(
    values: EditTeamFormValues,
  ): Partial<UpdateTeamPayload> {
    if (!team) return {};

    const original: EditTeamFormValues = {
      name: team.name ?? "",
      teamLeadId: team.teamLead?.id ?? null,
      focusArea: team.focusArea ?? "",
      isActive: team.isActive ?? true,
    };

    const changed: Partial<UpdateTeamPayload> = {};
    if (values.name !== original.name) changed.name = values.name;
    if (values.teamLeadId !== original.teamLeadId)
      changed.teamLeadId = values.teamLeadId ?? undefined;
    if (values.focusArea !== original.focusArea)
      changed.focusArea = values.focusArea || undefined;
    if (values.isActive !== original.isActive) changed.isActive = values.isActive;

    return changed;
  }

  async function onSubmit(values: EditTeamFormValues) {
    if (!team) return;
    const changedData = getChangedFields(values);
    if (Object.keys(changedData).length === 0) {
      onOpenChange(false);
      return;
    }
    const result = await updateTeamAction(team.id, changedData);
    if (result.success) {
      toast.success("Team updated");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  }

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-md gap-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="mb-6">
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-team-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Team Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Credentialing Team Alpha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamLeadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Lead</FormLabel>
                  <FormControl>
                    <TeamLeadAutoComplete
                      value={field.value ?? null}
                      onValueChange={(user) => field.onChange(user?.id ?? null)}
                      placeholder="Select Team Lead..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="focusArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Area</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Large Clients, PSV"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="rounded border-white/20 bg-white/5 p-3 flex items-center justify-between gap-2">
                  <div>
                    <FormLabel className="text-sm text-white/80 font-medium m-0">Active</FormLabel>
                    <p className="text-xs text-white/40">
                      Inactive teams are hidden from default views.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter showCloseButton={false}>
          <Button
            type="button"
            variant="muted"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-team-form" variant="secondary">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
