/**
 * Add Client Affiliation Modal
 *
 * Dialog for affiliating a client with a payer.
 * Payload: POST /api/v1/payers/{payerId}/client-affiliations
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useClientsList } from "@/features/records/clients/hooks/use-clients";
import { useCreateClientAffiliation } from "@/features/records/payer/hooks/use-client-affiliations";
import type { ClientListItem } from "@/features/records/clients/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DELEGATION_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "delegated", label: "Delegated" },
  { value: "non_delegated", label: "Non-Delegated" },
  { value: "pending", label: "Pending" },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const addClientAffiliationSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  delegationStatus: z.string().min(1, "Delegation status is required"),
  contractExpiry: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)")
    .refine(
      (val) => !val || !isNaN(new Date(val).getTime()),
      "Must be a valid calendar date",
    )
    .optional()
    .or(z.literal("")),
});

type AddClientAffiliationFormData = z.infer<typeof addClientAffiliationSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddClientAffiliationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payerId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddClientAffiliationModal({
  open,
  onOpenChange,
  payerId,
}: Readonly<AddClientAffiliationModalProps>) {
  const { data: clientsData, isLoading: clientsLoading } = useClientsList({
    limit: 100,
  });
  const clients = clientsData?.data?.items ?? [];

  const { mutate: createAffiliation, isPending } =
    useCreateClientAffiliation(payerId);

  const form = useForm<AddClientAffiliationFormData>({
    resolver: zodResolver(addClientAffiliationSchema),
    defaultValues: {
      clientId: "",
      delegationStatus: "",
      contractExpiry: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ clientId: "", delegationStatus: "", contractExpiry: "" });
    }
  }, [open, form]);

  const handleSubmit = (data: AddClientAffiliationFormData) => {
    createAffiliation(
      {
        clientId: data.clientId,
        payerId,
        delegationStatus: data.delegationStatus,
        ...(data.contractExpiry ? { contractExpiry: data.contractExpiry } : {}),
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 w-full sm:max-w-md mx-4 gap-0 bg-[#0e1019] backdrop-blur-xl border-white/10 max-h-[85vh] flex flex-col"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-6 space-y-0 shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-white">
              Add Client Affiliation
            </DialogTitle>
            <DialogDescription className="sr-only">
              Affiliate a client with this payer
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
            aria-label="Close dialog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-1 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* Client */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Client <span className="text-rose-400">*</span>
                    </FormLabel>
                    <Combobox<ClientListItem>
                      items={clients}
                      itemToStringValue={(item) =>
                        item
                          ? `${item.organizationName}${item.dbaName ? ` (${item.dbaName})` : ""}`
                          : ""
                      }
                      value={clients.find((c) => c.id === field.value) ?? null}
                      onValueChange={(item) => field.onChange(item?.id ?? "")}
                      disabled={clientsLoading}
                    >
                      <FormControl>
                        <ComboboxInput
                          placeholder={clientsLoading ? "Loading clients…" : "Search clients…"}
                          showClear={!!field.value}
                          disabled={clientsLoading}
                        />
                      </FormControl>
                      <ComboboxContent>
                        <ComboboxEmpty>No clients found</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              {item.organizationName}
                              {item.dbaName ? ` (${item.dbaName})` : ""}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Delegation Status */}
              <FormField
                control={form.control}
                name="delegationStatus"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Delegation Status <span className="text-rose-400">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus:ring-0">
                          <SelectValue placeholder="Select delegation status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DELEGATION_STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Contract Expiry */}
              <FormField
                control={form.control}
                name="contractExpiry"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-white/60">
                      Contract Expiry
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="w-full px-4 py-2.5 h-auto rounded-xl bg-white/5 border-white/10 text-white text-sm focus:border-emerald-500/50 focus-visible:ring-0 focus-visible:border-emerald-500/50 [color-scheme:dark]"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10 shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="px-4 py-2 h-auto rounded-xl bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white/70"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 h-auto rounded-xl bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                {isPending ? "Adding…" : "Add Affiliation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
