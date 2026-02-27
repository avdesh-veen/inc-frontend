"use client";

import { Card } from "@/components/ui/card";
import { DecisionTableComponent } from "./decision-table";
import { DecisionTableInfoBanner } from "./decision-table-info-banner";
import { DecisionTableHeader } from "./decision-table-header";
import { exportDecisionTableCsvClient } from "@/features/settings/api/approvals/decision-table/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { logger } from "@/lib/logger";

export function DecisionTableTab() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDmn = async () => {
    try {
      setIsExporting(true);
      const blob = await exportDecisionTableCsvClient();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-table-dmn-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'Decision table has been exported',
      });
    } catch (error) {
      logger('Failed to export decision table CSV', { error });
      toast({
        title: 'Export failed',
        description: 'Failed to export decision table',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleTestSample = () => {
    toast({
      title: 'Test feature',
      description: 'Sample case testing will be available soon',
    });
  };

  return (
    <div className="space-y-6">
      <DecisionTableInfoBanner />

      <Card className="p-6">
        <DecisionTableHeader
          onTestSample={handleTestSample}
          onExportDmn={handleExportDmn}
          isExporting={isExporting}
        />
        <DecisionTableComponent />
      </Card>
    </div>
  );
}
