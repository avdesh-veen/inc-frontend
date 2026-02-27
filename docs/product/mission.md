# Product Mission

## Problem

Healthcare credentialing, enrollment, and licensing are operationally critical processes that are currently executed through fragmented, manual, and inconsistent systems. Work is spread across spreadsheets, emails, shared drives, payer portals, and individual analyst knowledge, with no single system enforcing how work should progress.

This fragmentation causes slow provider onboarding, repeated payer rejections, missed follow-ups, silent SLA breaches, and high operational cost. Organizations often do not know where cases are stuck, why submissions fail, or how much revenue is being delayed. Compliance with NCQA, payer, and state requirements depends heavily on human memory rather than system enforcement, increasing audit risk.

## Target Users

InCredibly is designed for organizations and teams responsible for managing healthcare provider credentialing, enrollment, and licensing at scale.

**Primary Users – Internal Operations Teams**
These users perform day-to-day work inside the platform and drive operational outcomes. They include credentialing analysts, enrollment analysts, verification coordinators, team leads, managers, schema or knowledge analysts, and quality control analysts. The product supports them by providing structured workflows, clear task ownership, automated follow-ups, enforced SLAs, compliance guardrails, and reduced rework.

**Secondary Users – Client Stakeholders**
These users require visibility but do not perform operational work. They include MSO leadership, practice administrators, operations managers, and executive stakeholders at client organizations. The product serves them through read-only access, real-time status visibility, SLA transparency, and performance insights without relying on manual status updates.

**Tertiary Users – Healthcare Providers**
These users act as contributors rather than operators. They include physicians, advanced practice providers, and other clinicians undergoing credentialing or enrollment. The product supports them through self-service document uploads, clear action requests, reduced redundant data collection, and visibility into their credentialing and enrollment progress.

InCredibly is built primarily for credentialing and enrollment operations teams, while also enabling transparency for clients and reducing friction for providers without compromising operational control.

## Solution

InCredibly solves this by converting credentialing and enrollment into a structured, workflow-driven operational system. It standardizes work through defined work types, stages, and tasks; enforces SLAs, wait states, and follow-ups automatically; captures rejection reasons to improve first-pass success; embeds compliance and auditability into daily execution; and provides real-time visibility into performance, bottlenecks, and revenue impact.

**Key Differentiators:**

- **Workflow-First, Not Record-First**: The platform treats credentialing and enrollment as active workflows with defined stages, transitions, wait states, and ownership. Records exist to support execution, not the other way around. Every case always has a clear state and next action.

- **Quality Embedded Into Execution**: First Pass Rate is a core operational metric, not a retrospective report. Rejection reasons are captured at the moment of failure and fed back into workflows, analyst performance, and payer insights to continuously reduce rework.

- **Time as a First-Class Concept**: SLAs, wait reasons, countdowns, and escalation rules are built directly into the workflow engine. Time does not pass silently. Cases either progress, wait for an explicit reason, or escalate automatically.

- **Compliance by System Design**: NCQA, payer, and state requirements are enforced through workflow rules, required verification steps, audit logging, and PII protection. Compliance is achieved through system behavior rather than relying on training or memory.

- **Configurable Without Being Chaotic**: Administrators define work types, stages, approval rules, routing logic, skills, and follow-ups using structured configuration. Analysts execute within guardrails, ensuring flexibility without inconsistency.

- **Operational and Executive Visibility From the Same System**: The same system that analysts use to do the work generates real-time insights for managers and executives. Bottlenecks, capacity issues, payer delays, and revenue risk are visible without separate reporting systems.

InCredibly's unique approach is turning credentialing and enrollment from a reactive, manual process into a controlled, measurable, and continuously improving operational system. The product eliminates operational chaos, reduces rework, protects compliance, and enables healthcare organizations to onboard providers faster and more predictably at scale.

## Configuration as a Core Capability

The **Settings Module** is central to InCredibly's configurability and adaptability. Unlike rigid credentialing systems that require vendor customization or code changes, InCredibly empowers administrators to define and modify operational logic through structured configuration interfaces.

### Why Settings Matter

Healthcare organizations operate with vastly different work types, client requirements, payer rules, team structures, and compliance mandates. The Settings Module enables each organization to configure the platform to match their specific operational reality without requiring engineering intervention.

**The Settings Module transforms operational flexibility into a competitive advantage:**

- **Workflow Configuration**: Administrators define work types, stages, transitions, SLA rules, approval workflows, assignment logic, and follow-up sequences that match their organization's specific credentialing and enrollment processes.

- **Operational Consistency**: Once configured, the system enforces these rules uniformly across all analysts, clients, and cases, eliminating process variance and ensuring compliance with organizational standards.

- **Continuous Improvement**: As organizations learn what works and what doesn't, they can refine SLA targets, assignment rules, follow-up frequencies, and approval thresholds without development cycles or vendor dependencies.

- **Client-Specific Customization**: Different clients may require different work types, approval chains, or notification preferences. The Settings Module allows organizations to configure client-specific rules while maintaining operational control.

- **Compliance and Auditability**: Configuration changes are logged, versioned, and auditable. Organizations can demonstrate to NCQA auditors or clients exactly how their processes are structured and when changes were made.

### Settings Module Architecture

The Settings Module is organized into focused configuration domains:

**Workflow Configuration** (Primary Focus)
The Workflow tab contains the operational engine that drives how work progresses through the platform. It includes:

- **Work Types**: Defines categories of work (credentialing, enrollment, licensing, maintenance, etc.) with stages, complexity, duration estimates, and required skills
- **Skills**: Establishes competency requirements that determine who can perform specific work types
- **SLA Rules**: Sets enforceable service level agreements by work type, priority, and client
- **Approvals**: Configures multi-level approval workflows for quality control and compliance
- **Assignment**: Defines routing logic (skill-based, round-robin, load-balanced, manual assignment)
- **Trigger Events**: Establishes automated actions based on status changes, field updates, or time-based conditions
- **Follow-Up Rules**: Configures automated chase sequences for pending external actions (payer responses, provider documents, etc.)
- **Wait Reasons**: Defines valid reasons for pausing SLA timers and enforces explicit accountability

**Notifications**
Configures email, in-app, and external notification rules for analysts, managers, clients, and providers.

**Integrations**
Manages API connections, SFTP configurations, EMR/EHR integrations, and external system credentials.

**Security**
Controls authentication methods, session policies, IP restrictions, audit logging, and PII protection rules.

**System**
Defines global platform settings, feature flags, maintenance windows, and performance tuning parameters.

**Workspace Modules - Users & Roles**
Manages internal users, external client portal users, role definitions, permission matrices, and access scopes.

### Configuration Philosophy

InCredibly's configuration system is **structured, not chaotic**. It provides flexibility within guardrails:

- **Guided Configuration**: Complex settings like SLA Rules and Trigger Events use form-based interfaces with validation to prevent invalid configurations.
- **Visual Clarity**: Work Types, Skills, and Approvals are displayed as cards, tables, and visual flows rather than raw data entry.
- **Dependency Awareness**: The system prevents breaking changes (e.g., deleting a skill that's required by active work types) and highlights impacted entities.
- **Role-Based Access**: Not all administrators can modify all settings. Security and System settings may be restricted to Super Admins, while Team Leads may configure assignment rules for their teams.
- **Testing and Rollback**: Configuration changes can be previewed, tested in isolated scopes, and rolled back if issues arise.

The Settings Module is not an afterthought—it is a core product capability that enables healthcare organizations to operate InCredibly as a platform rather than a fixed application. It ensures the system adapts to operational reality rather than forcing operations to adapt to the system.
