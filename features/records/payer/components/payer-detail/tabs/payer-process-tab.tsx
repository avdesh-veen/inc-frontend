"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { PayerDetail } from "@/features/records/payer/types";

// ─── Mock data ────────────────────────────────────────────────────────────────

const ENROLLMENT_STEPS = [
  {
    id: 1,
    name: "PECOS Registration",
    description: "Create or verify I&A account at PECOS portal",
    duration: "1-2 days",
    tip: "Use provider's personal email for I&A account",
  },
  {
    id: 2,
    name: "Complete CMS-855I",
    description: "Submit individual provider application via PECOS",
    duration: "1-2 hours",
    tip: "Have all license numbers and practice addresses ready",
  },
  {
    id: 3,
    name: "Link to Group (CMS-855R)",
    description: "Reassign benefits to billing group if applicable",
    duration: "30 min",
    tip: "Group must have active CMS-855B enrollment",
  },
  {
    id: 4,
    name: "MAC Processing",
    description: "Novitas reviews and processes application",
    duration: "30-45 days",
    tip: "Check status weekly via PECOS",
  },
  {
    id: 5,
    name: "PTAN Assignment",
    description: "Receive Provider Transaction Access Number",
    duration: "With approval",
    tip: "PTAN required before billing",
  },
];

const REQUIRED_DOCUMENTS = [
  "State medical license",
  "DEA certificate (if applicable)",
  "Board certification",
  "W-9",
  "Malpractice COI",
  "CV/Resume",
  "Photo ID",
];

const COMMON_ISSUES = [
  "I&A account locked — call I&A helpdesk",
  "Application returned for missing signatures",
  "Delayed due to license verification",
  "Reassignment issues with group NPI",
];

const PORTAL_TIPS = [
  "Clear cache if getting errors",
  "Session times out after 30 min",
  "Save work frequently",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function PayerProcessTab({ payer }: Readonly<{ payer: PayerDetail }>) {
  const portalUrl = `https://www.${payer.name
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")}-solutions.com`;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Enrollment Process Guide</h3>
          <p className="text-sm text-muted-foreground">Last updated Nov 15 by Nicole Golaub</p>
        </div>
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open Portal
        </a>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-2">
            <p className="text-xs text-muted-foreground uppercase mb-1">Total Time</p>
            <p className="text-lg font-bold text-emerald-400">45-60 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2">
            <p className="text-xs text-muted-foreground uppercase mb-1">Steps</p>
            <p className="text-lg font-bold text-foreground">{ENROLLMENT_STEPS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2">
            <p className="text-xs text-muted-foreground uppercase mb-1">Recred Cycle</p>
            <p className="text-lg font-bold text-foreground">5 years</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2">
            <p className="text-xs text-muted-foreground uppercase mb-1">Documents</p>
            <p className="text-lg font-bold text-foreground">{REQUIRED_DOCUMENTS.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Enrollment Steps timeline ── */}
        <Card className="lg:col-span-2">
          <CardContent className="p-2">
            <h4 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Enrollment Steps
            </h4>

            <div>
              {ENROLLMENT_STEPS.map((step, index) => {
                const isLast = index === ENROLLMENT_STEPS.length - 1;
                return (
                  <div key={step.id} className={`flex gap-4 ${isLast ? "" : "pb-6"}`}>
                    {/* Step indicator + connector */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {step.id}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-emerald-500/30 mt-2" aria-hidden="true" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pb-1">
                      <h5 className="font-semibold text-foreground">{step.name}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-3 h-3 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-muted-foreground">{step.duration}</span>
                      </div>

                      <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-200">
                          <span className="font-semibold">Tip:</span> {step.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Right: sidebar cards ── */}
        <div className="space-y-4">

          {/* Required Documents */}
          <Card>
            <CardContent className="p-2">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Required Documents
              </h4>
              <ul className="space-y-1.5">
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card>
            <CardContent className="p-2">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Common Issues
              </h4>
              <ul className="space-y-1.5">
                {COMMON_ISSUES.map((issue) => (
                  <li key={issue} className="text-xs text-rose-200/80 p-1.5 rounded bg-rose-500/10">
                    {issue}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Portal Info */}
          <Card>
            <CardContent className="p-2">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portal Info
              </h4>
              <div className="space-y-1 text-xs">
                <p className="font-medium text-foreground">
                  PECOS (Provider Enrollment, Chain, and Ownership System)
                </p>
                <p className="text-muted-foreground">Login: I&A (Identity &amp; Access Management)</p>
                <p className="text-muted-foreground">Browser: Chrome or Edge</p>
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                  {PORTAL_TIPS.map((tip) => (
                    <p key={tip} className="text-muted-foreground">&bull; {tip}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recredentialing */}
          <Card>
            <CardContent className="p-2">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recredentialing
              </h4>
              <p className="text-xs text-muted-foreground">
                Revalidation notice sent 6 months prior. Complete via PECOS.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
