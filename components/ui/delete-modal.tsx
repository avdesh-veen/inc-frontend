import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  name: string;
  description?: string;
  onConfirm: () => void;
  isPending?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function DeleteModal({
  open,
  onOpenChange,
  title,
  name,
  description,
  onConfirm,
  isPending = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: Readonly<DeleteModalProps>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#181C24] border border-[#23283a] shadow-2xl rounded-xl p-6">
        <AlertDialogHeader className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center size-12 rounded-full bg-red-500/10 mb-2 mx-auto">
            <svg className="size-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-foreground mx-auto">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground text-center mx-auto mt-1">
            {description ? (
              <>{description}</>
            ) : (
              <>
                Are you sure you want to delete <span className="font-semibold text-red-400 block">{name}?</span>
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-4 mt-6 -mx-6 -mb-6">
          <Button
            variant='muted'
            className="flex-1"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button variant='destructive' className="flex-1"
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
