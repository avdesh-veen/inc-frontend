"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { appRoutes } from "@/lib/constants/navigation";

interface TriggerEvent {
  id: string;
  code: string;
  label: string;
  type: "Workflow" | "Submission" | "Document" | "Case";
  description: string;
}

const TRIGGER_EVENTS: TriggerEvent[] = [
  {
    id: "1",
    code: "gate.approval_required",
    label: "gate.approval_required",
    type: "Workflow",
    description: "Workflow gate requires approval before proceeding",
  },
  {
    id: "2",
    code: "submission.ready",
    label: "submission.ready",
    type: "Submission",
    description: "External submission is ready to be sent",
  },
  {
    id: "3",
    code: "stage.completed",
    label: "stage.completed",
    type: "Workflow",
    description: "A workflow stage has been completed",
  },
  {
    id: "4",
    code: "document.verified",
    label: "document.verified",
    type: "Document",
    description: "PSV or document verification completed",
  },
  {
    id: "5",
    code: "case.complexity_high",
    label: "case.complexity_high",
    type: "Case",
    description: "Case complexity score exceeds threshold",
  },
  {
    id: "6",
    code: "case.revenue_threshold",
    label: "case.revenue_threshold",
    type: "Case",
    description: "Estimated revenue exceeds configured amount",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Workflow: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Submission: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Document: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Case: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function ApprovalTriggerEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Approval Trigger Events
        </CardTitle>
        <CardDescription>
          Events that can require approval before proceeding:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {TRIGGER_EVENTS.map((event) => (
            <TriggerEventCard key={event.id} event={event} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TriggerEventCardProps {
  event: TriggerEvent;
}

function TriggerEventCard({ event }: Readonly<TriggerEventCardProps>) {
  return (
    <div className="border border-white/10 rounded-lg p-3 hover:bg-white/2 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge
          variant="outline"
          className={`text-xs font-mono ${TYPE_COLORS[event.type]}`}
        >
          {event.code}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {event.type}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{event.description}</p>
    </div>
  );
}

export function ApprovalWaitReasonsAlert() {
  return (
    <Alert variant="primary">
      <AlertTitle className="flex items-center gap-1">
        <HugeiconsIcon icon={Link01Icon} className="size-4 text-primary" />
        <span className="font-semibold text-sm">Linked: Wait Reasons</span>
      </AlertTitle>
      <AlertDescription>
        When approval is required, case enters &quot;Pending Approval&quot; wait
        state
      </AlertDescription>
      <AlertAction className="flex justify-end">
        <Button
          variant="link"
          size="sm"
          className="text-primary hover:text-primary/80"
          asChild
        >
          <Link href={appRoutes.settings.workflow.waitReasons}>
            View Wait Reasons →
          </Link>
        </Button>
      </AlertAction>
    </Alert>
  );
}
