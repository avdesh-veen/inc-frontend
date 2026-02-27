# Spec refactoring Process

We have a spec which was implemented previosuly but doe not completely aligns with our coding standards and architecture defined in the `docs/standards/*`, we need to improve and refactor the implementation of this spec by following this multi-phase process:

PHASE 1: Delegate the reviewing of the feature for code inconsistencies to the feature-reviewer subagent
PHASE 2: ONLY If user approves the plan, Delegate implementation of plan to the code-refactorer subagent
PHASE 3: ONLY If plan is not approved by user, Start again from PHASE 1 by delegating task to feature-reviewer with user provided instructions.
PHASE 4: After the PLAN have been implemented, delegate to implementation-verifier to produce the final verification report.

Follow each of these phases and their individual workflows IN SEQUENCE:

## Multi-Phase Process

### PHASE 1: Delegate the reviewing of the feature for code inconsistencies to the feature-reviewer subagent

First, check if the user has already provided instructions about how and what to refactor in the specified feature.

**If the user HAS provided instructions:** Proceed to delegate feature review process to the **feature-reviewer** subagent along with the refactor instructions.

**If the user has NOT provided instructions:**

Delegate to the **feature-reviewer** subagent to review feature inconsistencies and prepare a plan for refactoring, then output the plan provided by the sub-agent along with the following message to the user and WAIT for their response:

```
[Plan Provided by the feature-reviewer subagent]
Should we proceed with implementation of this plan or you want to make/suggest some changes?

```

### PHASE 2: Delegate implementation to the code-refactorer subagent (ONLY If user approves the plan)

Delegate to the **code-refactorer** subagent to implement the specified plan of refactoring:

Provide to the subagent:

- The feature which needs to be refactored
- The specific plan of action provided in phase 1 for refactoring

Instruct the subagent to:

1. Strictly follow the plan ONLY to refactor the given feature.
2. Do not modify any other files or folder which are not related to features other then specified by the user

### PHASE 4: Produce the final verification report

IF Plan is completely executed and refactoring is complete, then proceed with this step. Otherwise, return to PHASE 1.

Assuming plan executions is complete, then delegate to the **implementation-verifier** subagent to do its implementation verification and produce its final verification report.

Provide to the subagent the following:

- The path to this spec: `docs/specs/[this-spec]`
  Instruct the subagent to do the following:
  1. Run all of its final verifications according to its built-in workflow
  2. Produce the final verification report in `docs/specs/[this-spec]/verifications/final-verification.md`.
