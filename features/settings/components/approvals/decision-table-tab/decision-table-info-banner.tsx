import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { appRoutes } from "@/lib/constants/navigation";

export function DecisionTableInfoBanner() {
  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <div className="flex items-start gap-3">
        <HugeiconsIcon
          icon={AlertCircleIcon}
          className="w-5 h-5 text-amber-400 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-300">
            DMN Decision Table (Read-Only)
          </p>
          <p className="text-xs text-text-70 mt-1">
            This table shows the approval routing logic using DMN (Decision Model and Notation) format. 
            Rules are evaluated top-to-bottom; first matching rule wins. Edit via Approval Workflows tab.
          </p>
          <Link 
            href={appRoutes.settings.workflow.approvals('approvals')}
            className="text-xs text-amber-400 hover:text-amber-300 underline mt-1 inline-block"
          >
            Extensions
          </Link>
        </div>
      </div>
    </div>
  );
}
