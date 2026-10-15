import type { DocPage } from "@/content/types";

export const referenceEn: DocPage[] = [
  {
    slug: "reference/glossary",
    section: "reference",
    title: "Glossary",
    summary: "Place employees, roles, models, Harnesses, tasks, knowledge and execution evidence within their own boundaries.",
    readingOrder: 1,
    body: `
## Organization and scope

**Organization**: the enterprise governance boundary within a deployment.

**User**: a human account and stable identity in the organization.

**Workspace**: a collaboration scope carrying member authorization and shared capabilities.

**Project**: a continuing goal organizing repositories, tasks, knowledge and decisions.

**Repository**: an independently versioned codebase, separate from a project or workspace.

## Employees and capabilities

**Employee**: a member-owned continuing collaboration identity with responsibilities, a role version, work records and experience.

**Agent Role**: a published, reusable definition of responsibilities, methods and execution configuration. Hiring creates an employee identity; personal experience and shared role definitions are maintained separately.

**Model**: an invocation target providing reasoning or other capabilities through a gateway.

**Agent Harness**: the endpoint managing sessions, tools and execution loops. Models and Harnesses occupy separate layers; compatibility is checked for specific combinations.

**Skill**: reusable instructions, methods, reference material and supporting files.

**MCP**: a tool-connection protocol and its associated resource configuration. Tool use may require additional member authorization.

**Release**: a reusable asset version with fixed content, distinct from an active draft.

## Execution

**Conversation**: continuing interaction that can relate to employees, tasks and other work objects.

**Task**: an execution record for a defined goal, including inputs, process, evidence and delivery.

**TaskSpec**: initially resolved task inputs, versions, references and digests. Later execution revisions do not overwrite that history.

**Flow**: a reusable process organizing node calls, dependencies and handoffs.

**WorkNode**: a maintainable, versioned Agent execution definition.

**Flow Invocation**: a specific node call with input bindings, outputs and dependencies.

**Attempt**: one execution version of a node, with its own results and evidence.

**Sandbox**: a managed execution isolation boundary, distinct from the task's continuing logical identity.

**Execution Generation**: a new execution sequence from an explicit starting point.

**Runtime Generation**: the record of runtime-instance replacement for the same logical task.

**Resume Directive**: correction notes and material attached to a new execution, without overwriting old inputs.

## Handoff and delivery

**Artifact**: formal handoff data from an identified execution, with a path, content identity and provenance.

**Quality Gate**: a deterministic command check, such as tests or a build.

**Code Change Artifact**: code evidence bound to an execution, starting baseline and resulting revision.

**Artifact Archive**: materials for historical reading, not automatically a recoverable runtime snapshot.

**Runtime Snapshot**: state satisfying a recovery contract, requiring integrity, identity and configuration checks before use.

## Knowledge and memory

**Knowledge Base**: a scope organizing documents, maintainers and access. Documents publish independently; there is no whole-base release.

**Knowledge Document**: content with a draft, published versions and retrieval state.

**Source**: original evidence for a fact or experience, such as documents, code, task artifacts or interactions.

**Memory**: reusable personal understanding constrained by identity, scope, revision and budget.

**Employee Experience**: employee-linked instructions or learned outputs with source and validation state.

**Decision**: human-confirmed knowledge changing direction or constraints, distinct from a temporary Agent inference.

## Access and environments

**Connector**: connection configuration and authorization entry for a model, Git or external service.

**User Runtime Credential**: a member's service authorization; sharing a role does not share its plaintext.

**Personal Development Environment**: a member's continuing development environment identity, distinct from a task execution boundary.

**Managed Development Service**: a standard service entry governed by the platform, separate from arbitrary container ports.

**Development Port Forward**: explicit authorization mapping a user application service to a controlled access entry.
`,
  },
  {
    slug: "reference/faq",
    section: "reference",
    title: "Frequently asked questions",
    summary: "Practical answers about employee training, open collaboration, recovery, knowledge versions and acceptance evidence.",
    readingOrder: 2,
    body: `
## Where do I start?

Open **Chat** for everyday work after signing in. For a defined repository goal, use **Tasks → Create task**. See [Start in the workbench](../../getting-started/overview/).

## Is a digital employee just a saved prompt?

An employee has an independent identity, responsibilities, a fixed role version, work records and experience. Train from accessible everyday sources or hire a published role from Agent Hub, then continue working with that identity.

Review source coverage and validation state. Submitting training does not establish readiness. See [Train and hire digital employees](../../guides/digital-employees/).

## Is collaboration limited to Claude and Codex?

The product manages models and Harnesses separately. Collaboration is not intended to be bound to one brand combination. Actual models, endpoints, gateway protocols and tools depend on the deployment.

Claude, Kimi, GLM, DeepSeek and Grok are model examples. Claude Code, Codex and Kimi Code are execution-tool examples. Open integration does not establish verified compatibility for every possible combination.

## Can I change models when creating a task?

The current creation drawer has no general model selector. Execution resolves models from the relevant configuration and node capabilities.

Supported later session model changes are limited to options compatible with the current environment, gateway, credentials and protocol. They do not replace the Harness, initial flow model or historical evidence.

## Does a shared role grant access to someone else's Git or tools?

No. Members complete their own authorization in **Connections & access**. Shared role access does not confer another member's private credentials, and resource access remains subject to authorization.

## Does a completed task mean changes are merged or deployed?

Task completion, a PR or MR, human approval, merge and deployment are separate facts. Review actual links, diffs and validation records through your team's process.

## Can execution continue from a node after failure?

When runtime conditions allow, use **Fusion Resume** to select a started node, review downstream effects, add corrections and create a new execution generation. Previous attempts and evidence remain. An existing PR or MR requires a side-effect review.

## What if the original runtime instance has been deleted?

A complete, verifiable logical runtime snapshot in a ready state can support a new runtime generation for the same task. Recovery checks current identity, authorization, credentials and runtime, along with the frozen toolchain.

This differs from Fusion Resume within an existing environment. Recovery cannot be promised without a valid snapshot. A historical artifact archive is not automatically a runtime checkpoint.

## How do knowledge bases differ from employee experience?

Knowledge bases contain publishable, shared documents. Employee experience belongs to a particular employee and carries scope, source and validation state, with correction and exclusion actions. Saving complete chat history does not automatically make it either one.

## Can running tasks read updated knowledge?

Documents publish independently. Runtime reads select effective versions accessible at that moment and check authorization again. A task does not freeze a whole knowledge base or permanently retain revoked access.

Personal memory snapshots have separate consumption rules; do not confuse them with live knowledge-document reads.

## Why is a saved document missing from retrieval?

Check publication, parsing and index readiness, current permissions, and query relevance. Saving a draft is not publishing, and a directory entry does not establish retrieval availability.

## What do website screenshots prove?

Screenshots show the actual Console with example data to explain the interface. They do not establish production model, Git or retrieval connectivity.

For acceptance, test each workflow with real identities and services and record the exact version and combination. See [Verification boundaries](../../operations/verification/).
`,
  },
];
