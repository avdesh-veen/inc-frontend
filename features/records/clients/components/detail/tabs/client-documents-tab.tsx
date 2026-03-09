/**
 * Client Documents Tab
 *
 * Displays and manages client documents with upload capability.
 */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteModal } from "@/components/ui/delete-modal";
import {
  PlusSignIcon,
  MoreVerticalIcon,
  Download01Icon,
  Delete02Icon,
  FileAttachmentIcon,
  UploadIcon,
} from "@hugeicons/core-free-icons";
import { ClientDocument, DocumentType } from "@/features/records/clients/types";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  getDocumentTypeBadgeClass,
  formatFileSize,
  formatDateShort,
} from "@/features/records/clients/utils/helpers";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FILE_TYPE_EXTENSIONS: Record<string, DocumentType> = {
  ".pdf": DocumentType.CONTRACT,
  ".doc": DocumentType.CONTRACT,
  ".docx": DocumentType.CONTRACT,
  ".xls": DocumentType.BAA,
  ".xlsx": DocumentType.BAA,
  ".jpg": DocumentType.W9,
  ".jpeg": DocumentType.W9,
  ".png": DocumentType.W9,
  ".gif": DocumentType.OTHER,
};

function getDocumentTypeFromFileName(fileName: string): DocumentType {
  const ext = fileName.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
  return FILE_TYPE_EXTENSIONS[ext] || DocumentType.OTHER;
}

interface ClientDocumentsTabProps {
  clientId: string;
}

export function ClientDocumentsTab({
  clientId,
}: Readonly<ClientDocumentsTabProps>) {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const isLoading = false;
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<ClientDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF, Word, Excel, or image files.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum file size is 10MB.";
    }
    return null;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDoc: ClientDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: getDocumentTypeFromFileName(file.name),
        uploadedAt: new Date(),
        uploadedBy: "Current User",
        size: file.size,
        url: "#",
      };

      setDocuments((prev) => [newDoc, ...prev]);
      toast.success("Document uploaded successfully");
    } catch {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (doc: ClientDocument) => {
    try {
      toast.info("Downloading document...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Document downloaded");
    } catch {
      toast.error("Failed to download document");
    }
  };

  const handleDeleteClick = (doc: ClientDocument) => {
    setDocumentToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setIsDeleting(documentToDelete.id);
    try {
      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentToDelete.id),
      );
      toast.success("Document deleted successfully");
      setDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={ALLOWED_FILE_TYPES.join(",")}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">Client Documents</h3>
        <Button
          size="default"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Content */}
      {documents.length === 0 ? (
        <div className="p-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon
                  icon={FileAttachmentIcon}
                  className="h-12 w-12 text-muted-foreground"
                />
              </EmptyMedia>
              <EmptyTitle>No documents uploaded yet</EmptyTitle>
              <EmptyDescription>
                Upload contracts, BAA, W-9 and other client documents
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="mt-4"
              >
                <HugeiconsIcon icon={UploadIcon} className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "+ Upload"}
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">DOCUMENT NAME</TableHead>
                <TableHead className="w-[140px]">TYPE</TableHead>
                <TableHead className="w-[120px]">SIZE</TableHead>
                <TableHead className="w-[140px]">UPLOADED</TableHead>
                <TableHead className="w-[180px]">UPLOADED BY</TableHead>
                <TableHead className="w-[80px] text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  {/* Document Name Column */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={FileAttachmentIcon}
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>

                  {/* Type Column */}
                  <TableCell>
                    <Badge className={getDocumentTypeBadgeClass(document.type)}>
                      {document.type}
                    </Badge>
                  </TableCell>

                  {/* Size Column */}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatFileSize(document.size)}
                  </TableCell>

                  {/* Uploaded Column */}
                  <TableCell className="text-sm">
                    {formatDateShort(document.uploadedAt ?? null)}
                  </TableCell>

                  {/* Uploaded By Column */}
                  <TableCell className="text-sm">
                    {document.uploadedBy}
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting === document.id}
                        >
                          <HugeiconsIcon
                            icon={MoreVerticalIcon}
                            className="h-4 w-4"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(document)}
                        >
                          <HugeiconsIcon
                            icon={Download01Icon}
                            className="h-4 w-4 mr-2"
                          />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(document)}
                          className="text-destructive"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="h-4 w-4 mr-2"
                          />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Document"
        name={documentToDelete?.name || ""}
        description={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting !== null}
      />
    </div>
  );
}
