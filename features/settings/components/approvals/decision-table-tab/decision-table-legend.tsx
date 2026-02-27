import { getApprovalPathColor } from "./decision-table-helpers";

export function DecisionTableLegend() {
  const selfColor = getApprovalPathColor("self");
  const teamLeadColor = getApprovalPathColor("team lead");
  const managerColor = getApprovalPathColor("manager");
  const teamLeadManagerColor = getApprovalPathColor("team lead manager");
  return (
    <div className="text-xs text-text-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <span>* = Any value</span>
      <span>
        <span className={selfColor}>Self</span>= No approval needed
      </span>
      <span>
        <span className={teamLeadColor}>Team Lead</span>= Single approval
      </span>
      <span>
        <span className={managerColor}>Manager</span>= Higher approval
      </span>
      <span className="col-span-2">
        <span className={teamLeadManagerColor}>Team Lead Manager</span>= Higher
        approval
      </span>
    </div>
  );
}
