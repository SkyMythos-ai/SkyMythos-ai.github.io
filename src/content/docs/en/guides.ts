import type { DocPage } from "@/content/types";

/**
 * Operation guides.
 *
 * Where the concepts section explains structure, this section answers "what do I
 * do when". Each guide is organised around a decision the reader has to make, and
 * states the trade-offs of each option rather than prescribing one.
 */

export const guidesEn: DocPage[] = [
  {
    slug: "guides/create-a-task",
    section: "guides",
    title: "Create a task",
    summary:
      "Requirement sources, repository selection, flow mode and model freezing end to end — including the autofill behaviour and the order to triage a failed preflight in.",
    readingOrder: 1,
    body: `
## The creation form collects only what it must

Creating a task uses at most two or three main steps. The default form collects requirement sources, a task name, the repository and the base branch. Inputs specific to a flow appear only when you explicitly choose to use that flow.

Model, knowledge, capability and orchestration details are not required configuration for an ordinary user. That is deliberate: having to understand the whole domain model should not be the price of getting started.

## Requirement sources

A source is multi-line, and the lines together compose one requirement.

Every line uses the same two-segment interaction. The selector in the first segment only switches that line's type — choosing a source never fires a file picker or any other side effect. The second segment expands the input panel for that line alone.

The **Markdown** panel opens on an empty file-upload state and, once read, collapses to the filename, size, character count and a replace or remove action. The body is kept as a frozen payload and is not expanded into an editable block of text by default, because the requirement is an input to be reproduced, not a document to be rewritten in place.

An **online source** panel — Git issue, enterprise document, enterprise instant messaging — shows a single link input carrying the semantics of its source, plus a clear action.

Re-selecting the source a line already uses keeps the input it holds; only switching the line's type clears that line. Adding, deleting or reordering other source lines never corrupts the content of this one.

Which sources are visible is decided by the deployment rather than by a static fixture guessing at a company's tool stack. Markdown and Git issues are built-in sources the control plane always returns; enterprise documents and enterprise instant messaging are enabled explicitly by deployment configuration and exposed to the interface through an availability API.

One caveat matters here. The availability contract proves only that the entry point is enabled. Until the connector that fetches external bodies ships, the task context still freezes the source address and the platform-generated metadata, and does not pretend the body has been downloaded.

## Task name

The name field arrives with an editable default, which saves retyping. It picks the first available title in source-line order:

- **Markdown** — the first level-one heading that is not inside a code fence, falling back to the filename when there is none;
- **Git issue** — the real title, read through a connector the current user has already authorised; if that read fails, the placeholder is kept and creation continues.

The automatic value follows source replacements and asynchronous results only while the name has not been edited by hand. **Once a user has entered a non-empty name, later source changes must not overwrite it.** A non-empty name restored from rebuilding an original task or from a browser draft is treated as a confirmed manual value.

The name carries resource identification and acts as a list title, nothing more. The task requirement held in the task context is what the agent actually executes against.

## Repository and branch

The creation page does not accept a free-form repository address. The control plane works in this order:

1. Git services for which the current user has configured a personal token become the selectable services;
2. the server decrypts the current token and queries the repositories it can reach, live;
3. once a repository is chosen, branches are queried, with the provider's default branch suggested first.

Switching Git service or repository clears the downstream selections. A rejected token, a network failure and an empty repository each produce their own recoverable state.

The point of that order is that **token problems surface before execution does.** If a token is invalid or lacks permission on the repository, the task fails during preflight rather than halfway through a run.

Issue titles are read the same way: only server-side, using the current user's credentials, and only after validating that the link matches the address and path contract of a configured connector. The browser never talks to the provider API directly. The interface returns the connector identifier, provider, repository full name, clone and web addresses, default branch, private flag, branch names and protection flags, plus the issue's repository, number, title, web address and state — and nothing else. Access tokens, ciphertext and key references never cross out of the control plane.

## Flow modes

**Smart orchestration** is the default. After a task is submitted, preflight retrieves, evaluates and prefers to reuse an existing published version, generating a task-scoped temporary flow only when nothing fits.

The actual order on that path is: analyse the task goal, the supplied requirement, the constraints, deliverables and acceptance criteria; search the published flows visible to the current user against that requirement; for each candidate, read the complete contract of the exact version and compare inputs, outputs, nodes, dependencies and capabilities; reuse the exact version when one satisfies the task, and generate a new flow only when none does.

A directory read or a tool call that fails **does not mean** there is no suitable flow. The system must not hide the fault and then claim a match was found.

| Mode | Who chooses the flow | What happens |
| --- | --- | --- |
| Smart orchestration | The platform, during preflight | Reuses an exact published version when one fits; otherwise generates a task-scoped flow |
| Use an existing flow | The user, from a compact selector | Only the non-derivable dynamic fields of that version's input contract are collected |
| Create a flow | The user, on a separate authoring page | The flow is edited as a long-lived asset, kept out of the task form |

**Use an existing flow** lets the user pick a published version visible in the current workspace scope through a compact selector. Selecting one expands only the fields of that version's input contract that cannot be derived.

**Create a flow** moves to a separate authoring page. Editing a long-lived asset does not belong inside the task form.

## Models and capabilities

The creation page offers no task-level model selection. The model is fixed in each node's capability definition, and task creation freezes the exact version.

Knowledge access is handled by the control plane, which issues a minimal delegation scoped to the task principal, the Organization and the workspace, and force-injects the system knowledge recall skill. A user does not choose or need to understand knowledge when creating a task.

## Triage order when preflight fails

A failed preflight leaves the task with structured check results. Working through them in this order is usually fastest:

1. **Personal token** — is one configured, has it expired, does it have permission on this repository;
2. **Repository and branch** — does the branch still exist, is the default branch restricted by a protection rule;
3. **Capability visibility** — are the skills or extensions the chosen flow declares available in your current workspace;
4. **Model gateway** — is the gateway reachable, is the selected model on the catalogue;
5. **Flow contract** — if you are using an existing flow, are all its required input fields filled.

A failure creates no run resources at all, so resubmitting after a fix leaves nothing behind to clean up.
`,
  },
  {
    slug: "guides/observe-execution",
    section: "guides",
    title: "Observe execution",
    summary:
      "How to read a task: the two-column structure, the disclosure order in node detail, the code and artefact evidence surface, and what a live connection actually means.",
    readingOrder: 2,
    body: `
## The structure of task detail

Task detail is not a four-column layout. The header carries task identity, status and task-level controls; below it the page holds a stable two-column relation between the agent session on the left and the evidence rail on the right.

The header itself is a three-layer hierarchy: task identity and title on the mainline, status with progress and branch on the subline, and the task actions alongside. A long goal truncates to a single line in the flexible content area and is read in full through the task context, while the lifecycle markers stay horizontal and never shrink.

## The evidence rail is a single-level state machine

The right rail shows the full dependency graph by default. Selecting a node **replaces the whole rail** with that node's overview, from which you switch between code, artefacts, lineage and agent.

Topology and detail are never on screen at the same time, which lets the file reader use the entire height of the right rail. The detail state allows the rail to widen moderately, and the session on the left stays visible throughout.

The top of a detail view must offer an explicit way back, and returning restores the full dependency graph.

The reason for this design is that trying to hold the dependency graph and a file body side by side in one narrow column makes both of them unusable. Replacing is more honest than compressing.

## Disclosure order in node detail

Node detail follows **conclusion → contract → evidence → source**.

**Overview** leads with a scannable execution conclusion, then presents the input and output contract, the task context, the frozen code and the artefact evidence.

One caveat applies: attempt counts, durations and rework facts may appear only if the task snapshot already provides them. The front end must not fill the gaps with demo constants. So when a field is absent, that usually means the data does not exist rather than that the interface dropped it.

**Code** shows the code revision frozen when that attempt completed, together with the full code tree, and **does not read the final task branch**. The distinction matters: the final branch is the merge of every node's commits, and it does not represent the state any intermediate node was in at the time.

**Artefacts** shows the frozen result summary, the artefact manifest and the declared handoff artefacts. It does not open arbitrary runtime files.

**Lineage** shows a node invocation summary and deep-links to the task's full-width observability page.

**Agent** shows the runtime, model and capabilities together with their versions and lock information.

## Reading a result summary

The result summary is the single user-visible summary authority for each successful node. Its structure is fixed: result, files, links, verification, risks and follow-ups.

The files section enumerates the relative paths of artefacts the runner has validated, one by one. That is what makes the summary trustworthy — its file list corresponds one-to-one with the frozen artefacts, rather than being the agent's own description of what it did.

The links section records only external addresses this node actually created or discovered. It does not dress a relative artefact path up as a web address.

By default the summary shows only the short excerpt extracted from the frozen body, and the full content loads once the user expands it explicitly. The reason is to keep the list scannable.

## Reading the dependency graph

Graph nodes carry order, title and status only. The attempt count is not repeated on every node as a fixed property.

Node numbering and the execution queue come from a **deterministic topological sort of the frozen dependencies**, not from the index of an array in configuration. The canvas hides only those transitive edges that another path already implies, and keeps the true dependency direction with arrows — independent branches must not be drawn as if they were serial.

## Live connection state

Task execution state and physical connection state must be kept separate.

Only a running task shows live, reconnecting, offline and active states. A completed or failed task uses the stable terminal state, read-only semantics and a final dependency graph.

Historical backlog backfills session records only; it must not roll the current snapshot back to an older node state. Once the terminal subscription has finished replaying, reconnection stops.

It follows that seeing "reconnecting" on a completed task is a defect rather than normal behaviour. If you observe it, it is worth reporting.

## The file reader

Code and artefacts share one full-width file workspace, its filters, a raw file reader and a download action.

The file tree is given a usable width. Filenames, metadata and body are set at a readable reading scale, rather than squeezed into the side rail in a microscopic font.

The reader shows the raw path, byte size, media type and either the code object identifier or the content digest. Text is read page by page while preserving encoding boundaries; binary content is offered as a raw file download only.

An older task with no frozen revision shows an explicit compatibility note, rather than exposing a runner method error or a blank panel to the user.

## Observability

The resource dashboard presents in-cluster platform telemetry, observability runs and task associations. An empty state must not fabricate capacity or health data.

Observation should be entered from the original business object, and the way back to that object should be preserved. A trace is execution evidence; a span is an operation within that evidence; the runtime session identifier is shown as technical information only when it is needed for diagnosis.

Conversation, turn, task, automation run, observability run and trace identifiers must not collapse into a single identity just because their display names have been unified. A flow started from a conversation is linked to it by a persistent proposal receipt — the completion state of the background task is not the same thing as the state of the turn that started it.
`,
  },
  {
    slug: "guides/handle-failures",
    section: "guides",
    title: "Handle failures and recovery",
    summary:
      "Telling execution-level retry, semantic rework and manual rerun apart — what bounds each one, how far it reaches, and when to rebuild a task instead of recovering it.",
    readingOrder: 3,
    body: `
## Three kinds of recovery, not interchangeable

The platform separates three responses because they address problems of different natures.

**Retry** handles execution faults: a model gateway timeout, a runtime crash, a command timeout, a missing node protocol. Retry prefers to recover the original session, and creates a new session when the original cannot be recovered reliably. Retry **does not create a new attempt**.

**Rework** handles semantic defects: a downstream node has established that an upstream artefact is wrong in substance. Rework **always creates a new session, a new attempt and a new artefact version**.

**Manual rerun** handles a single node inside a task that has already failed terminally. Rerun rewrites the failure record by appending the current attempt to history, not by erasing it.

| Path | Handles | What it creates | Counted against |
| --- | --- | --- | --- |
| Retry | Execution faults — gateway timeout, runtime crash, command timeout, missing node protocol | A recovered session, or a new session; never a new attempt | Attempt budget |
| Rework | Semantic defects — a downstream node has proven an upstream artefact wrong | Always a new session, attempt and artefact version | Rework budget |
| Manual rerun | One failed node in a terminally failed task | A new attempt appended to history | Attempt budget |

The reason for keeping them apart is that they are counted and bounded differently. Only a downstream node confirming a semantic defect in an upstream artefact increments the rework count; a gateway hiccup never consumes rework budget.

## How failures are classified

The coding driver normalises raw errors into platform types: transient fault, driver crash, timeout, contract violation, authentication failure, permission denied, budget exceeded, cancelled and semantic failure.

The supervisor **does not parse the runtime's natural-language error text** to decide a state transition. That restriction matters: if state transition depended on a model's reading of an error string, the same error worded two ways would produce two different behaviours.

## Choosing the rework target

A downstream node that cannot repair a semantic problem itself returns a structured failure. The supervisor validates the target and the quota, then produces a normalised failure report whose metadata carries at least the failing node, the rework target, the artefact identity and version, the failure code and whether it is retryable.

**The rework target must be a legitimate producing node of the relevant artefact**, not mechanically the previous node in execution order. That constraint is what stops rework being pointed at a node with nothing to do with the artefact in question.

Once upstream has produced a new artefact version, the supervisor invalidates every derived node that consumed the old version along the dependency relation and **reruns only the affected subgraph**. Unrelated branches are left alone.

## Limits

Rework is bounded by three limits at once: the maximum attempts per node, the maximum reworks per target, and the total rework count. Along with the gate-repair limit per attempt, all of them are frozen explicitly by the flow and cannot be overridden by a node.

When any limit trips, the task fails. That is intentional: a rework loop that has slipped out of control costs far more than one failure.

The nodes downstream of a failed node do not run; independent branches with no dependency on it keep executing.

## Rerunning a single node manually

A terminally failed task lets the user re-execute one failed node on its own.

Rerun does not rewrite the failure record. It appends the current attempt to history and then creates a new attempt. Artefacts and code revisions from completed upstream nodes are reused as frozen evidence rather than recomputed.

Once the target node succeeds, the runner goes on to execute the downstream nodes that have not yet run and whose dependencies are now satisfied.

A rerun re-resolves the latest revisions of the current global Git connector and of personal credentials, against the task creator and repository permissions, and then refreshes the published configuration held in the sandbox supervisor's memory through an authenticated internal interface. **Tokens do not enter the agent, the prompt, the execution specification, a snapshot or routing data.** The task top level keeps the snapshot taken at creation, and each attempt separately records the non-secret revisions resolved for it.

## Empty responses

When a model repeatedly returns no text, no tool activity and zero input and output tokens, the runner classifies it as an empty model response and starts a bounded number of recovery sessions under a backoff policy.

Once those are exhausted, an explicit node failure is retained, so the user can rerun it individually after updating the model or the connector. **An empty response is never disguised as completion.** The reason is that a silent empty response would otherwise yield a node that looks successful and contains nothing.

## Replanning mid-run

When the plan turns out not to hold while a task is running, the agent may propose a new flow revision, which goes back through compilation, permission and risk assessment.

The initial specification stays as it was. Later revisions are written to an append-only plan log, which retains the old topology, the reason for the change, its initiator and the approval record in full.

A completed node may be reused only when its invocation contract, inputs, upstream artefacts, node template and capability summary are all still compatible. Otherwise it is explicitly marked invalid and rerun.

Replanning must not delete historical evidence, and must not present not-yet-executed nodes as though they had been part of the initial plan.

## Waiting for human input

An agent question marks only the current attempt as waiting for input. Dependent downstream waits, while independent parallel branches keep running.

A reply binds to the node, the attempt and the question identifier. **Stale questions belonging to an invalidated attempt are closed automatically** — otherwise a question already superseded by a new attempt would go on drawing attention.

A question waits for a configured period by default. On timeout the default is to fail the task, though it can be configured to continue on an assumption or to fail that node alone.

When a user sends a message unprompted and the agent is busy, the message enters a pending queue. An explicit forced insertion prefers the runtime's native insert capability, and otherwise interrupts the current turn and resumes. A runtime that cannot reliably resume must refuse forced insertion outright rather than silently queueing.

A pending message can be edited or withdrawn before it is delivered, and the input area always shows the target node, attempt and session.

## Cancellation

A user can cancel a single attempt and rerun it by hand, or cancel the whole task.

**Permanently skipping a required node and letting the dependency graph carry on automatically is not supported.** The limitation is deliberate: skipping a required node breaks the integrity of the artefact contract, leaving downstream to consume something that was never produced.

Cancellation acceptance, process exit, durable terminal state and business success are distinct state facts. A side effect with no exit evidence stays unknown and is not replayed automatically.

## When to rebuild rather than recover

A rebuild reads the original task's business inputs and creates a new task under the current operator's identity, re-freezing models and credentials, capability locks and runtime, and re-issuing the knowledge access policy. The old task is kept in full.

Rebuilding is the better choice when:

- the requirement itself has changed;
- you need to change the model or the gateway;
- the flow version the original task used has been deprecated and you want the newer one;
- you want the work carried out under another person's identity and permissions.

Recovery suits a plan that still holds and an execution that was merely interrupted. Rebuilding suits inputs or an environment that have already changed.
`,
  },
  {
    slug: "guides/flows-and-marketplace",
    section: "guides",
    title: "Flows and the capability marketplace",
    summary:
      "Authoring, publishing and reusing flows and skills, how asset ownership is promoted, and why the runtime is never allowed to pull floating content.",
    readingOrder: 4,
    body: `
## Three resource types, not one

The marketplace is a single entry point, but flows, skills and MCP use independent resource types, lists, detail views and publish contracts. They must not be collapsed into one untyped catalogue.

A **Skill** is a set of versioned instructions, reference material, scripts and supporting files that an agent can assemble and use.

**MCP** is an external tool connection a model can call, in two forms: a remote configuration template and a local immutable image.

A **Flow** is a dependency graph of node invocations. It is not a capability package, and cannot be published as a skill or an extension.

## The skill supply chain

Skills come from three sources, each with a different content authority.

A **Git-linked skill** takes the specified repository, ref and directory path as its sole content authority. The platform handles discovery, preview, manual or scheduled synchronisation, validation and automatic publishing, and **never writes back to Git**. One source can discover many skills in bulk through a discovery root, include paths and exclude patterns. A Git path that disappears only marks the source as missing; historical releases are neither deleted nor automatically withdrawn.

If you need to edit such a skill online, you must copy it into a new platform-owned skill.

A **ZIP upload** keeps the original digest as source evidence. Once extracted it becomes a platform-owned draft that can be inspected, edited and published explicitly. An upload is not a continuing external authority, and offers no reverse synchronisation.

A **platform-owned skill** takes the platform draft as its content authority. File edits autosave, and revision concurrency control prevents silent overwrites. Only explicit publishing is supported.

The three sources share the package contract at the publish boundary and nowhere else — they do not share a persistence model.

## Release and immutability

Every source must satisfy the structural, security, determinism and materialisability constraints at the publish boundary. The root directory mandates only the skill description file, and stays compatible with legacy manifest files.

A release carries an immutable semantic version, a package digest, a source snapshot and audit information.

When Git content changes, each skill publishes automatically and independently; the batch summarises what was published, unchanged, failed and removed, and one failing item does not block the rest.

**Tasks still resolve only exact versions and digests from the local registry, and the sandbox does not pull from Git at runtime.**

That is the central constraint of the supply chain: the sandbox is forbidden from fetching capability code from the public internet through a package manager at start-up. A cache hit does not excuse skipping content digest verification either.

## Asset ownership and promotion

An asset starts in personal scope and can be promoted one way only: personal → workspace → public.

A promotion creates the release at the target tier, migrates asset authority and closes the old scope's write entry in a single atomic state transition. **It is not a copy.** At any moment an asset has exactly one editable authority.

Maintainers can publish new versions directly. Ordinary members can only view, add, derive or propose changes.

A new asset derived from a fixed release gets a new identity, a new draft and a new version sequence, and retains its immutable upstream source. Upstream synchronisation is an **explicit maintenance operation** — a three-way merge of the fixed baseline, the target upstream version and the derivation's current draft — not an automatic overwrite or a track-the-latest relationship.

## Solidifying a task flow

Any generated flow revision can be saved as a draft, and a failed revision remains available for later correction, but a generated revision cannot be published directly.

Solidifying creates a new flow draft identity and retains the source task, the snapshot revision, the original digest and the execution results.

The solidification wizard must sort the content into three classes — **retain, parameterise, delete**:

- task-specific values such as repository, branch, requirement, paths and connectors are extracted into flow inputs wherever possible;
- secrets, temporary tokens, user identity and private bodies are **deleted without exception**, and the user is given no option to retain them.

The parameterised final draft acquires a new digest. The source task's success is therefore provenance information only and **cannot stand in for validating the final content**.

Before publishing, the final digest must pass deterministic compilation, schema validation, capability visibility, security policy and a representative dry run. Publishing defaults to workspace-private; entering the public marketplace requires additional security, quality, licence and operational review.

## Visibility is not installation

Once live authorisation passes, a capability enters the capability set of sandboxes, flows and collaboration directly, with **no extra installation, subscription, copy or workspace binding required**.

The design removes "installation state", a concept that is easy to get out of sync. It also means that if you lack permission the capability will not appear among the candidates — and that is not because the other side failed to publish it.

## Permissions

A system administrator configures Git services and the platform read-only token, and manages public skills.

A workspace administrator manages private skills, Git sources, archives, platform drafts and publishing.

An ordinary member browses, previews and references.

Platform Git tokens are never echoed back, and never enter the browser, a task snapshot, a sandbox or a log.

## The lifecycle of a published release

A release that a task has already referenced can only be deprecated or withdrawn — never overwritten or physically deleted.

A deprecated version can still be used by new tasks, but creation warns. A withdrawn version is refused to new task resolution, while running and historical tasks are unaffected.

A tag alias points only at a normally published version, and moves to the latest non-withdrawn version after a withdrawal.

Publishing, withdrawal, tag moves, task resolution, sandbox materialisation, connection readiness and rework refresh all enter the security audit. Secrets, full prompts and session bodies must not.
`,
  },
];
