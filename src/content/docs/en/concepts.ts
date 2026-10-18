import type { DocPage } from "@/content/types";

export const conceptsEn: DocPage[] = [
  {
    slug: "concepts/tasks-and-specs",
    section: "concepts",
    title: "Tasks and execution specs",
    summary: "Separate employees, conversations and individual tasks, then understand frozen inputs and later execution revisions.",
    readingOrder: 1,
    body: `
## Employees, conversations and tasks

An **employee** is a continuing collaboration identity with responsibilities, a role version, work records and experience. A **conversation** holds ongoing interaction. A **task** executes a defined goal and records its inputs, process, evidence and delivery.

Discuss work in Chat, begin more work from employee detail, or create a repository task directly. These objects are related; one chat transcript cannot replace all execution evidence.

## What the spec records

At creation, the platform resolves identity, workspace, repository baseline, requirement sources, flow and node capabilities. It records resolved versions and content digests in the execution spec. Plaintext credentials do not belong in the spec.

Freezing lets you explain which inputs and configuration produced a result. Moving a tag or publishing a new role does not silently rewrite established history.

Knowledge reads and credential authorization have their own time boundaries. Frozen inputs do not grant permanent access or turn a knowledge base into an unchanging attachment.

## Recording later changes

Flow revisions, resume directives and execution generations require separate records. They do not overwrite the initial spec. Reused results retain their provenance; invalidated results must be produced again.

Where session model changes are supported, they must remain compatible with the existing environment, gateway, credentials and protocol. They do not replace the Harness, the initial flow model or past evidence.

## Where to inspect it

Open **Context** in task detail to check requirements and sources. Review node changes, files and execution information for the corresponding evidence.

Create a new task when requirements, the baseline or configuration must be chosen again. See [Create a task](../../guides/create-a-task/) and [Handle failures and resume](../../guides/handle-failures/).
`,
  },
  {
    slug: "concepts/flows-and-worknodes",
    section: "concepts",
    title: "Flows and work nodes",
    summary: "Define reusable work in nodes and connect handoffs through dependencies. Keep models, Harnesses and responsibilities separate.",
    readingOrder: 2,
    body: `
## A work node defines a unit of work

A work node defines its goal, instructions, endpoint, model, capabilities, inputs, outputs and checks. It is a reusable execution definition, separate from an employee identity or a position on a diagram.

A model provides reasoning. A Harness manages sessions, tools and execution. Responsibilities describe the work; models and Harnesses describe the means. The same responsibility can use different combinations where adapters and authorization permit.

## A flow connects nodes

A flow combines node calls, dependencies and data handoffs. Downstream work receives the required input after upstream work produces its contracted output. Independent branches can run in parallel.

For planning, implementation, review and validation, a concrete review issue should return to the producer of the affected output before the revision is validated. A list of brands does not establish collaboration.

## Drafts and releases

Drafts support maintenance; releases support stable reuse. Task creation resolves actual versions and digests. A movable tag is not sufficient historical evidence.

Review processes in **Flow Template** and reusable assets in **Marketplace**. Task creation can use intelligent orchestration or a published flow.

## Results establish completion

A node must meet its output contract and checks. A model saying “done” is insufficient. Downstream work consumes the artifact version from a particular execution.

See [Reuse roles, flows and capabilities](../../guides/flows-and-marketplace/) or [Artifacts and quality gates](../artifacts-and-gates/).
`,
  },
  {
    slug: "concepts/sandbox",
    section: "concepts",
    title: "Sandboxes and execution",
    summary: "Understand the control plane, runtime boundaries, execution generations and conditional snapshot recovery.",
    readingOrder: 3,
    body: `
## A managed execution boundary

Agents, tools and worktrees execute in a managed environment. Independent nodes can have separate sessions and attempts, with a supervisor scheduling dependencies.

The control plane handles identity, authorization, configuration, lifecycle and delivery references. The runtime handles sessions, tools, node state and artifact handoffs.

## Three distinct identities

| Object | Purpose |
| --- | --- |
| Task | A work goal and its continuing historical identity |
| Execution generation | A new execution sequence from an explicit starting point |
| Runtime generation | Replacement of the environment bound to the same logical task |

A logical task is not a container that can never be replaced. **Fusion Resume** creates an execution generation from an explicit node inside the current environment. Runtime recovery addresses replacement of the physical instance.

## Runtime recovery is conditional

After an instance is deleted, a complete, verifiable logical runtime snapshot in a ready state can support a new runtime generation for the same task. Recovery checks identity, current authorization, credentials and runtime, along with frozen toolchain and artifact configuration.

This does not guarantee lossless recovery after every container loss. Missing, invalid or incompatible snapshots cannot be reported as successfully restored.

## Archives and recovery snapshots differ

An archive for reading historical results is not automatically a recoverable runtime snapshot. Recovery requires materials satisfying its runtime contract, rather than only a summary and a few output files.

## Resources, network and credentials

Deployment policies, resource limits and connection authorization constrain execution. Model and tool credentials follow managed paths; employee instructions and Skills are not security boundaries.

Retention and cleanup depend on deployment policy. Confirm that required artifacts, code evidence and delivery references have been preserved.

See [Handle failures and resume](../../guides/handle-failures/).
`,
  },
  {
    slug: "concepts/preflight",
    section: "concepts",
    title: "Preflight and freezing",
    summary: "Resolve inputs and check permissions and contracts before allocating execution resources.",
    readingOrder: 4,
    body: `
## A task record comes first

Submitting a task creates a record before visible creation checks run. The record's existence does not mean an Agent or sandbox has started.

## What is checked

1. Resolve identity, workspace, requirements, sources, repository and baseline.
2. Select an existing flow, or match, adapt and generate one for the task.
3. Validate dependencies, input and output contracts, capabilities and resources.
4. Check the current subject's authorization, compatibility and risk policy.
5. Form the initial execution snapshot, exact versions and digests.
6. Prepare runtime resources after checks pass.

A model's plan is not an authorization result. Discovering a capability does not establish that the current member holds credentials for its external service.

## When checks fail

Open **Progress** in task detail to find the phase and reason. Missing Git authorization, an inaccessible branch, invalid flow inputs and unavailable runtime resources need different fixes.

Preflight failure does not silently broaden access. Correct the cause before using the available creation retry action.

## Freezing is not copying everything

The spec holds resolved inputs, versions, digests and references. It does not place every external document and capability package into one file, and it does not contain plaintext secrets.

Knowledge reads use current access and effective document versions. Bounded session model selection does not allow silent replacement of the initial execution configuration.

For the actual form, see [Your first task](../../getting-started/first-task/).
`,
  },
  {
    slug: "concepts/artifacts-and-gates",
    section: "concepts",
    title: "Artifacts and quality gates",
    summary: "Hand off immutable results and use actual checks to establish completion. Review intermediate evidence and final delivery separately.",
    readingOrder: 5,
    body: `
## Handoffs need an explicit object

Plans, code changes and validation reports can be formal artifacts between nodes. An artifact identifies its node, execution attempt, name, path and content.

A later attempt produces a new artifact version. Downstream work references a specific version and should not modify frozen upstream results.

## Gates check the result

Quality gates are deterministic node checks, such as tests, builds or static analysis. The runner executes the commands and records their exit results.

Within configured limits, a failed check can return to the Agent for repair and another check. Exhaustion remains a failure. A successful external tool call does not establish acceptance of the delivered work.

## Code and artifact evidence

**Code evidence** identifies the revision and changes frozen by an execution. **Artifact evidence** identifies its result summary, manifest and outputs.

Use **Changes** and **Workspace** to inspect code. Use output-file entries to read handoffs. The final task branch cannot stand in for an intermediate node's frozen result.

## Final delivery

An engineering task may produce a PR or MR. Actual provider data and a returned link establish remote delivery. Task completion, a change request, human approval, merge and deployment remain separate facts.

An archive supports historical reading. It does not automatically contain the complete state required for runtime recovery; see [Sandboxes and execution](../sandbox/).

For the console workflow, see [Observe execution and review results](../../guides/observe-execution/).
`,
  },
  {
    slug: "concepts/knowledge-and-memory",
    section: "concepts",
    title: "Knowledge, memory and employee experience",
    summary: "Separate published team documents, personal and employee experience, and evidence actually consumed by a task.",
    readingOrder: 6,
    body: `
## Different content, different entries

| Content | Purpose | Console entry |
| --- | --- | --- |
| Knowledge documents | Facts and methods the team can maintain, publish and share | Knowledge |
| Personal instructions and memory | Identity, goals, preferences and reusable understanding | Relevant personal and memory entries in Staff |
| Employee experience | Methods, evidence and validation accumulated by an employee | Employee detail → Memory and experience |

Conversations, logs and files can be sources. Saving them does not automatically turn them into long-term knowledge.

## Documents publish independently

A knowledge base organizes directories, maintainers and access. Each document has its own draft, release and index status. Saving a draft does not replace the published content.

There is no whole-base release. Runtime reads choose effective documents accessible at that moment and check authorization again. Referencing a base does not preserve revoked access indefinitely.

## Memory retains scope and provenance

Personal memory can include temporary work context, experience across conversations and resident identity preferences. Consumption is constrained by scope, budget and revision. Updated personal configuration should not silently change a historical task.

Memory does not replace task instructions, project evidence or tool authorization. Agents cannot bypass platform governance to write directly to the underlying memory store.

## Employees form from work

**Create employee from work experience** starts with authorised, reusable saved experience and an analysed responsibility and Skill plan. Human confirmation precedes Skill, role and employee creation. Analysis is not creation. Employee detail retains work records, source evidence and validation gaps; partial and unvalidated outputs need further work.

Hiring from Agent Hub creates a personal employee identity from a fixed role version. Later work continues under that identity; personal experience and the shared role definition are maintained separately.

## Correct rather than accumulate blindly

Inspect sources, correct experience or exclude it. Edit knowledge drafts, publish versions and review history. Both paths require evidence and applicability checks; one successful task does not establish a rule for all work.

See [Train and hire digital employees](../../guides/digital-employees/) and [Publish and use a knowledge base](../../guides/knowledge-base/).
`,
  },
];
