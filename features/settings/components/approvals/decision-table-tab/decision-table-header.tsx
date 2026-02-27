import { Button } from "@/components/ui/button";

type DecisionTableHeaderProps = {
  onTestSample: () => void;
  onExportDmn: () => void;
  isExporting: boolean;
};

export function DecisionTableHeader({
  onTestSample,
  onExportDmn,
  isExporting,
}: DecisionTableHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Approval Routing Decision Table
        </h3>
        <p className="text-xs text-text-50">
          Hit Policy: <code className="text-cyan-400">FIRST</code> (First matching rule wins)
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onTestSample}
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer"
        >
          Test with Sample Case
        </Button>
        <Button
          onClick={onExportDmn}
          disabled={isExporting}
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer"
        >
          {isExporting ? 'Exporting...' : 'Export DMN'}
        </Button>
      </div>
    </div>
  );
}
