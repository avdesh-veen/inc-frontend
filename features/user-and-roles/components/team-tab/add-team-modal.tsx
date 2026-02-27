"use client";

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
import { createTeamAction } from "../../actions/team-actions";
import { toast } from "sonner";
import { TeamLeadAutoComplete } from "./team-lead-auto-complete";

const addTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  teamLeadId: z.string().min(1, "Team lead is required"),
  focusArea: z.string().optional(),
  isActive: z.boolean(),
});

type AddTeamFormValues = z.infer<typeof addTeamSchema>;

interface AddTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddTeamModal({
  open,
  onOpenChange,
  onSuccess,
}: AddTeamModalProps) {
  const form = useForm<AddTeamFormValues>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: { name: "", teamLeadId: "", focusArea: "", isActive: true },
  });

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset({ name: "", teamLeadId: "", focusArea: "", isActive: true });
    }
    onOpenChange(isOpen);
  }

  async function onSubmit(values: AddTeamFormValues) {
    const payload = {
      name: values.name,
      teamLeadId: values.teamLeadId,
      focusArea: values.focusArea,
      isActive: values.isActive,
    };
    const result = await createTeamAction(payload);
    if (result.success) {
      toast.success("Team created");
      handleOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton className="max-w-md gap-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="mb-6">
          <DialogTitle>Add Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-team-form"
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
                  <FormLabel>
                    Team Lead <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <TeamLeadAutoComplete
                      value={field.value || null}
                      onValueChange={(user) => field.onChange(user?.id || "")}
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
            onClick={() => handleOpenChange(false)}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-team-form" variant='secondary'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
