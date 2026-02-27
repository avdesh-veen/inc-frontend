/**
 * Client Documents Tab
 * 
 * Displays and manages client documents with upload capability.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusSignIcon, MoreVerticalIcon, Download01Icon, Delete02Icon, FileAttachmentIcon } from '@hugeicons/core-free-icons';
import { ClientDocument } from '@/features/records/clients/types';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { getDocumentTypeBadgeClass, formatFileSize, formatDateShort } from '@/features/records/clients/utils/helpers';

interface ClientDocumentsTabProps {
  clientId: string;
}

export function ClientDocumentsTab(props: Readonly<ClientDocumentsTabProps>) {
  void props;
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const isLoading = false;
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDownload = async (doc: ClientDocument) => {
    void doc;
    try {
      toast.info('Downloading document...');
      setTimeout(() => {
        toast.success('Document downloaded');
      }, 500);
    } catch {
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(documentId);
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch {
      toast.error('Failed to delete document');
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
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">Client Documents</h3>
        <Button size="default">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Content */}
      {documents.length === 0 ? (
        <div className="p-12">
          <Empty
            icon={<HugeiconsIcon icon={FileAttachmentIcon} className="h-12 w-12 text-muted-foreground" />}
            // icon={<HugeiconsIcon icon={FileAttachmentIcon} className="h-12 w-12 text-muted-foreground" />}
            title="No documents uploaded yet"
            description="Upload contracts, BAA, W-9 and other client documents"
          />
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
                      <HugeiconsIcon icon={FileAttachmentIcon} className="h-4 w-4 text-muted-foreground" />
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
                  <TableCell className="text-sm">{document.uploadedBy}</TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting === document.id}
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <HugeiconsIcon icon={Download01Icon} className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(document.id)}
                          className="text-destructive"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
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
    </div>
  );
}
