import type { DocPage } from "@/content/types";

/**
 * Core concepts.
 *
 * This is the section that makes the product usable rather than merely
 * evaluable. Each page answers one structural question and names the constraint
 * that follows from it, because in this system the constraints — not the
 * vocabulary — are what cause a task to behave unexpectedly.
 *
 * Same six slugs, in the same reading order, as the Chinese tree. The English
 * prose states the reasoning behind each constraint at the length an overseas
 * evaluator needs to argue about it internally.
 */

export const conceptsEn: DocPage[] = [
  {
    slug: "concepts/tasks-and-specs",
    section: "concepts",
    title: "Tasks and specifications",
    summary:
      "How one R&D execution is defined, what is immutable while it runs, and why that immutability is the foundation of the product's reproducibility.",
    readingOrder: 1,
    body: `
## What a task is

A task executes one R&D goal against a frozen input set. It binds a specification and a sandbox, then enters a running state machine asynchronously.

A task is not a conversation. A conversation is a long-lived container for interaction that can span any number of turns; a task is an execution with a definite start and end, frozen inputs and deliverables. One conversation can start several tasks.

## What the specification freezes

The specification is resolved before the task is created and is **immutable** while it runs. It freezes:

- the creator and the workspace;
- the repository reference and baseline branch;
- the initial flow snapshot;
- the exact capability version of every node — flow node, model, runtime, skill and extension;
- the member credential revision;
- the input references and their content digests.

The specification **contains no secrets at all**. Credentials are injected into the runtime environment by the control plane at run time and deleted as soon as each component is ready; they never reach an image, a repository, the specification, a log or an event.

## Why it is immutable

The specification is immutable so that an execution can be replayed and explained.

If the model version, skill version or knowledge version were free to drift mid-run, "why did this task produce that result" would stop being an answerable question. The same goes for failure: you would be unable to tell whether the cause was your code or a changed dependency.

Retry, rework, restart and resume therefore all reuse the same specification. While a task is running, no floating reference is permitted to refresh a flow, a node or a capability.

Concretely: if a published version is later deprecated, tasks already referencing it are unaffected; moving a tag to a new version changes neither published flows nor in-flight tasks. Emergency security revocation is a separate governance action, and it requires explicitly terminating the affected sandboxes.

## Preflight: where the specification comes from

When a task is created, the record is persisted and an identifier returned first, after which it enters the user-visible preflight stage. Preflight is the only place a specification is produced, and the point at which every authorisation check converges.

Preflight re-authorises the planning result against the **current user and the current workspace**. It does not trust the conclusions reached during planning: it re-checks the visibility and permissions of every reference under the same identity, then runs deterministic validation — the dependency graph is acyclic, every required input has exactly one legitimate source, artefact type contracts are compatible, and budgets and limits are frozen explicitly.

Only a successful preflight creates a sandbox. This is a fail-closed boundary: a failed preflight creates no half-built environment, and does not silently fall back to broader permissions.

## Three sources for a flow

Preflight needs a flow. There are three ways to get one.

**Smart orchestration** is the default. The platform analyses the task goal, the existing requirements, the constraints, the deliverables and the acceptance criteria; retrieves published flows visible to the current user; and for each candidate reads the full contract of the exact version, comparing inputs, outputs, nodes, dependencies and capabilities. A similar name is not a fit. When a flow satisfies the task, its exact version is reused; a task-scoped temporary flow is generated only when nothing fits.

**Using an existing flow** is an explicit choice of a published version by the user. This path skips model planning, but it still has to pass preflight and freezing.

**Creating a flow** opens a separate authoring page and produces a publishable long-lived asset.

Whichever path you take, the result goes through the same deterministic compiler and the same digest validation.

## Replanning while running

A frozen revision cannot be modified in place. If the plan turns out not to hold during execution, the agent can propose a new flow revision, which goes back through compilation, permission and risk assessment. The initial specification is left untouched; subsequent revisions are written to an append-only plan log that preserves the old topology, the reason for the change, the initiator and the approval record in full.

A completed node may only be reused when its invocation contract, inputs, upstream artefacts, node template and capability digests are all compatible; otherwise it is explicitly invalidated and rerun. Replanning cannot delete historical evidence, and cannot present a not-yet-executed node as though it had been part of the initial plan.

## Rebuilding a task

Rebuilding from the original task reads its business inputs and creates a new task **as the current operator**. It re-freezes the model and credentials, the capability lock and the runtime, and it re-issues the current knowledge access policy. The old task is preserved intact.

The point of this behaviour is that a rebuild is not a recovery — it is the same intent executed again under new conditions.
`,
  },
  {
    slug: "concepts/flows-and-worknodes",
    section: "concepts",
    title: "Flows and work nodes",
    summary:
      "How R&D process is described as a versionable asset, how drafts differ from published versions, and why a tag alias is not a basis for reproducibility.",
    readingOrder: 2,
    body: `
## Work nodes

A work node is a reusable, independently maintained and versioned definition of an agent execution. It describes what one node execution needs, and nothing about where it sits in any particular graph.

A work node fixes:

- one exact model and reasoning tier;
- a platform-independent runtime configuration with semantic runtime hooks;
- prompts, skills referenced by name and version, extension connection details, and sub-agents;
- the timeout, maximum turns, maximum tokens and maximum cost of a single attempt;
- human-in-the-loop defaults, describing questions and ordinary approvals separately;
- user-declared unit gate commands;
- the working directory, the repository clone location, non-sensitive environment variables and logical cache configuration references.

Model fallback is entirely an internal capability of the model gateway and never appears in a flow, a node or the execution manifest. High availability and degradation inside the gateway stay transparent to flows.

## Flows

A flow composes several work node invocations into a directed acyclic graph by dependency. Each invocation has its own node identifier, input sources, outputs, artefact paths and dependencies.

The flow's YAML definition is authoritative; the visual dependency graph is a projection of that same content onto a canvas, not a second definition.

Drafts are editable. Publishing produces an immutable version with a normalised content digest. Every published version fixes an exact node template version or tag alias policy, along with the invocation's input and output bindings and the dependency graph.

## A tag alias is not a basis for reproducibility

This is an easy place to go wrong, and it is worth stating on its own.

A tag alias — \`latest\`, for instance — is only a **movable alias** pointing at some published version. It is not guaranteed to be the numerically highest version. A flow draft may use aliases to make authoring more pleasant, but the deterministic compiler must resolve each one to an exact version immediately. Flow publication and task creation validate the concrete version and digest once more, and write the resolved result into the frozen lock.

So: a later tag move does not affect a published flow or a running task. But if your flow draft still carries an alias, the next time you edit it, it may point somewhere else.

## Completion conditions

Whether a node succeeded is deterministic:

- every required business artefact declared by the flow has been produced;
- the artefact manifest exists, is non-empty, and can enumerate the actual artefacts;
- the result summary exists and contains valid content;
- every unit gate passes.

The artefact manifest reports what actually happened; the flow's outputs are the required contract. Extra artefacts must be registered, and can only be handed to a legitimate downstream that already exists in the graph.

The result summary is the single user-visible authoritative summary for each successful node, and carries result, files, links, verification, risks and follow-ups in a fixed structure. The files section must list, one by one, the runner-validated relative paths of the artefacts, so the agent's self-reported result cannot drift away from the frozen artefacts. The links section records only external addresses that this node actually created or discovered.

The summary format is part of the platform's default execution policy, not of the user message body. The runner writes it into the task's private agent home according to the actual runtime, and the native instruction-discovery mechanism loads it when the session starts. These files are not written into the repository worktree, the artefacts or the task snapshot.

Be clear about one thing: **this instruction layer exists to guide runtime behaviour, and is not treated as a security boundary.** The runner still enforces summary format validation after artefact validation and before the read-only freeze; a malformed format or incomplete file coverage fails the node. A project's own instructions, or model drift, cannot bypass the completion contract.

## Human in the loop

A flow can explicitly enable questions or approvals, but human collaboration is a policy capability rather than a mandatory step on every task. The default policy aims for end-to-end autonomy.

An agent question only marks the current attempt as waiting for input; dependent downstream nodes wait, while independent parallel branches keep running. A reply is bound to the node, the attempt and the question identifier, and stale questions from an invalidated attempt are closed automatically.

When a user sends a message unprompted, it enters a pending queue if the agent is busy. An explicit forced insertion prefers the runtime's native insertion capability and otherwise interrupts the current turn and resumes. A runtime that cannot resume reliably must explicitly refuse forced insertion rather than silently queueing.

## Parallelism

A single supervisor runs nodes whose dependencies are satisfied, and applies backpressure according to sandbox CPU, memory and model quota. **Flow authors do not configure concurrency** — dependencies determine what can run in parallel, while sub-agents and the runtime determine parallelism within a node.

Commits from parallel coding nodes are merged by an explicit integration node in its own worktree. The integration node deals with code semantics and conflicts; the supervisor only provides the mechanism. Conflicts it cannot resolve go back to the relevant coding nodes as targeted rework.

The nodes downstream of a failed node do not run; independent branches with no dependency on it keep running.
`,
  },
  {
    slug: "concepts/sandbox",
    section: "concepts",
    title: "Sandboxes and the execution model",
    summary:
      "What one-sandbox-per-task means, how the control plane and the sandbox divide responsibility, where state authority sits, and what this model costs.",
    readingOrder: 3,
    body: `
## One task, one sandbox

Every task maps to one sandbox. Inside it there is exactly one supervisor, which is the authority for dependency graph state and scheduling, though several independent agent sessions may run in parallel.

The supervisor and the agent runtimes run inside the sandbox. Each attempt uses its own worktree and its own session, and never edits a shared workspace directly.

## Where the line falls

The control plane is responsible for:

- validating that the skills, models, extensions, coding drivers and base resources a flow references exist;
- creating, observing and cleaning up sandboxes;
- proxying connections from the web console into the sandbox's agents;
- persisting task-level lifecycle and the final delivery references;
- deciding that a task has failed once its sandbox is terminated, lost, or past the missed-connection grace period;
- providing the delivery node with controlled push and change-request tools.

The supervisor is responsible for: the dependency graph, attempts, node sessions, artefact references and UI event sequence numbers.

## State authority

This is the key to understanding the whole model.

**The control plane persists task-level state only**: the task identifier, task-level status and the tenant creator; the repository, baseline commit, task branch and frozen flow version; the sandbox identifier and the key timestamps; and the final artefact archive, code commit, remote branch and change request references.

**The control plane does not persist nodes, attempts, rework, sessions, messages or dependency graph checkpoints.** All of that is held by the supervisor inside the sandbox, in a local transactional log.

The consequence is that dependency graph state, sessions, artefacts and the code worktree sit in one failure domain. The model stays simple, and consistency is easy to guarantee.

## The cost this accepts

The design has explicit costs, and they should be stated plainly.

**Permanently losing a sandbox fails the whole task.** There is no recovery from a node checkpoint, and no restoring the dependency graph into a replacement sandbox. A brief agent disconnection does not immediately change the task outcome — the control plane may show a transient unreachable health state — but the task only enters failure once the sandbox provider confirms the instance is lost or the grace period has elapsed.

**Long tasks hold their sandbox continuously**, and do not release it while waiting for user input.

**If the sandbox disappears at the same time as a failure**, any artefacts not yet archived cannot be recovered.

**Requiring cross-sandbox recovery in future would need a new architectural decision**; the local transactional log cannot simply be promoted into a distributed state machine.

## Execution boundary

The sandbox provider owns creation, observation, binding and cleanup of the runtime environment. The default provider uses the Kubernetes Agent Sandbox; the runtime class is frozen by deployment policy, with the local environment omitting it and standalone isolation verification selecting a stronger execution boundary.

A task freezes the provider identity, plugin version, template reference, image digest and capability digest, and the provider is never hot-swapped while it runs.

Every production provider must pass the same contract tests: create, observe, renew, terminate, clean up, idempotency and lost-connection semantics.

## Credential boundary

The control plane creates a minimal private secret for the task, carrying the member model keys and controlled connector credentials that task needs.

Credentials use **least-recipient injection**: member model keys go only to the runner and the supervisor, local extension credentials go only to the corresponding sidecar, and remote extension credentials go only to the proxy sidecar. The agent main process never holds extension credentials directly.

The task secret is deleted once every sidecar and runtime is ready. Runtime configuration consumes secrets by environment variable reference; cleartext is never written into configuration files, the specification, events or logs.

Ordinary key rotation affects new tasks only; emergency revocation takes effect by terminating the affected sandboxes.

## Network and capabilities

The task runtime permits outbound traffic in order to reach the frozen model and Git targets directly. Fine-grained egress policy and proxy governance belong to later security design.

Skills and extensions can only come from the local registry. The sandbox forbids fetching capability code from the public internet through a package manager at start-up. Skills are downloaded from the registry by an init container, verified and unpacked onto a read-only shared volume; local extensions are pre-assembled as sidecars by image digest.

A task enters the running state only after all required skills have been materialised, the local extension sidecars are ready, remote extension connections are complete, the runtime and node configuration have validated successfully, and services are ready. A required capability that is missing must surface as a capability gap before the sandbox is created; a materialisation failure at run time ends in a structured failure.

## Lifecycle and retention

Images, Pod compute specifications and maximum retention belong to **deployment-level runtime policy**, not to a workspace, project, repository or personal setting. The control plane holds a singleton runtime policy configuration and applies the current revision when a task is created.

Each task freezes its revision, runner image, CPU and memory requests and limits, and maximum retention. Every node and rerun of that task reuses that same copy. A policy update affects later tasks only, and cannot drift an existing environment in place.

The retention window starts when a task is first observed as completed or failed. Within the window the environment, services, node files and agent sessions remain readable, and failed nodes remain rerunnable. Runtime resources may be deleted only when the user deletes the task, or when the expiry reclaimer confirms the lifecycle deadline has passed. Control plane recovery, orphan discovery, manual reclamation and recovery failures are not grounds for destruction.

After reclamation, the final task snapshot, node results, code revisions and change request metadata are still retained.
`,
  },
  {
    slug: "concepts/preflight",
    section: "concepts",
    title: "Preflight and freezing",
    summary:
      "Everything that happens between task creation and sandbox creation: re-authorisation, deterministic compilation, capacity and risk assessment, digest computation, and the fail-closed boundary.",
    readingOrder: 4,
    body: `
## Why preflight exists

Preflight solves one specific problem: a conclusion reached during planning cannot be treated as authorisation.

Planning is model-driven; it retrieves and evaluates the available flows and capabilities. But the model sees the candidates it is entitled to see, whereas what execution actually requires is the authorisation held by the **current user and current workspace** at the moment the sandbox is created. Those two can differ — permissions may have been revoked, a version withdrawn, a connector address changed.

So preflight does not "trust the planning result". It re-checks under the same identity and then fixes the outcome. That makes it both a security boundary and the source of reproducibility.

## The seven steps of preflight

**One, resolve the inputs.** Resolve identity, workspace, requirement sources, repository, baseline branch and currently available capabilities.

**Two, determine the flow.** Freeze the existing version the user chose, or run retrieval, evaluation, adaptation and generation.

**Three, deterministic compilation.** Normalise the flow through the shared compiler. The compiler checks at least that:

- every required input has exactly one legitimate source;
- there are no circular dependencies, duplicate node identifiers or illegal rework targets;
- artefact types and format contracts are compatible;
- inputs use qualified references and do not create implicit dependency edges.

**Four, risk assessment.** Assess and persist the risk classification, confidence and whether approval is required. This data serves explanation, audit, later policy analysis and reproduction; it is not itself a manual blocking condition on the flow plan, though a node requiring approval still has to be approved before that node executes.

**Five, re-authorisation and validation.** Re-authorise every exact reference against the current user and workspace, and validate repository and branch, compatibility, budget and risk. Preflight does not resolve floating tags again, does not substitute candidates by scope, and does not add any built-in capability.

**Six, freeze.** Freeze the initial execution flow snapshot, the execution specification and the exact capability lock. The snapshot records whether it came from an existing version or was generated by an agent.

**Seven, compute the digest.** Compute a normalised content digest over the whole specification. This is the proof of immutability at execution time.

## Re-validation inside the sandbox

Only after preflight completes is the specification passed to the runner. On start-up the runner re-validates the frozen plan against **the same compiler and the same digest**; it does not reinterpret natural language and does not resolve floating references.

Using the same logic in both places is deliberate: if preflight were the only check, problems introduced while passing the specification along would never be caught; if run time were the only check, failures would arrive after resources had already been created.

## Failing closed

When preflight fails:

- no runtime environment is created;
- no Pod, service or task secret is created;
- the task keeps structured check results and a repair entry point;
- there is no silent fallback to broader permissions.

The most common causes of failure were listed earlier. The preflight UI shows the progress of flow retrieval, generation, risk and freezing, so the point of failure can usually be located directly.

## The execution manifest

Preflight generates a secret-free execution manifest with a fixed digest for each task. It is the task's only execution configuration, and must contain in full the repository URL and baseline branch, the location information for every requirement source, the flow policy, and — for each node — the final prompt, skills, extensions, sub-agents, main agent model and runtime configuration.

The execution specification carries only content references into the manifest and its digest. The sandbox mounts it read-only, and the runner re-validates it.

**A single configuration does not mean inlining every external body.** The runner materialises requirements locally for each task from all the source location information, and each node uses that local result; skills, hooks and runtime files are materialised from configuration; credential environment variables are pre-injected into the sandbox. None of these payloads may form a second, parallel execution configuration, and none require the runner to recompute domain configuration.

All requirement sources are materialised exactly once per task. The runner preserves source identity and produces a unified requirement index, so retries, rework and every node reuse the same local result. This is a platform invariant, and no refresh policy is exposed in configuration. To refresh external requirements, create a new task or an explicit new execution revision, rather than letting an ordinary node read floating text mid-run.

## What is projected into the UI

When the control plane assembles a task snapshot, it projects each node's secret-free agent evidence from the same frozen manifest: the main agent model and runtime, the node prompt, sub-agent names and their inheritance relationships, and the exact skill and extension versions.

Gateway addresses, credential references, extension authentication and platform system prompts do not enter the snapshot. For system prompts the UI shows an explicit note about the private execution layer; it does not reverse-engineer them from session text, directories or test fixtures.
`,
  },
  {
    slug: "concepts/artifacts-and-gates",
    section: "concepts",
    title: "Artefacts and unit gates",
    summary:
      "How nodes hand off to one another, how artefact identity is composed, how unit gates decide, and why a downstream node cannot modify an upstream artefact.",
    readingOrder: 5,
    body: `
## Artefacts are the data plane

Nodes do not hand off through conversation; they hand off through artefacts. This is a central product choice: a conversation cannot be validated, cannot be referenced stably, and cannot be consumed safely downstream.

Every successful attempt freezes its own artefacts into an immutable version. What a downstream node reads is always the frozen version, never a temporary file in a runtime directory.

## Artefact identity

Artefact identity is composed of four parts: the node identifier, the output name, the attempt identifier and the content digest.

This means the artefact of the same name produced by the same node in different attempts is a different artefact, not a second write to one artefact. A downstream node cannot modify an upstream version, because what it references is one specific, already frozen combination.

The flow's output declarations are the required contract; the artefact manifest reports what actually happened. Extra runtime artefacts can satisfy a declared optional or collection input, but cannot add a dependency edge.

## The completion protocol

The core conditions for a node to succeed are:

- every required business artefact declared by the flow has been produced;
- the artefact manifest exists, is non-empty, and can enumerate the actual artefacts;
- the result summary exists and contains valid content;
- every unit gate passes.

The runner validates paths, file existence, size, format and digest, and then freezes the attempt.

Artefact validation happens before the read-only freeze, and summary format validation is mandatory. The evidence for every successful attempt is therefore complete and self-consistent.

## Unit gates

A unit gate is a shell command you declare. Deterministic builds, tests, static checks and scans are all carried by it; the runner executes it only in this attempt's worktree and judges the result by exit code.

The runner image provides Go, Node and Python toolchains at the same time, so those repositories can run native verification inside the sandbox.

When a gate fails, the supervisor first sends the command, the exit code and the controlled output back to the **current agent session**, and performs a bounded number of repair reruns within the same attempt. The limit is frozen explicitly by the flow, and nodes cannot override it.

This is an important design detail: a gate failure is not an immediate failure, because giving the agent a chance to fix it is exactly what a human developer would do. But the count is capped, so there is no unbounded loop.

## Code evidence and artefact evidence

The completion protocol freezes two kinds of reviewable evidence at once.

**Code evidence** binds the task, node, attempt and code revision. A caller may only submit normalised relative paths; the provider resolves objects from the frozen reference. Submitting a revision number, an object identifier or a physical repository path is not allowed, and the final task branch cannot be passed off as historical state.

**Artefact evidence** consists only of the artefact manifest, the result summary and the contract-declared outputs. After artefact contract validation the supervisor copies them atomically into a read-only snapshot outside the agent-writable directory. A later node modifying the runtime directory does not change the frozen content, and undeclared temporary files cannot be read through the interface.

Listings return only path, size, media type and digest metadata. Bodies are paged by bytes with an explicit per-page cap, supporting text or binary files of any size without resorting to enlarging connection message sizes.

## The execution tree layout

Every attempt uses its own immutable directory:

\`\`\`text
.fusion/
  state.db
  stages/<stage-id>/attempt-<n>/
    artifacts.json
    result.md
    outputs/
  worktrees/
\`\`\`

The canonical artefact manifest format is an object containing an \`artifacts\` array. The runner also accepts the top-level array that historical agents may have produced, but both formats go through the same field, path, file-existence and digest validation — compatibility parsing is not a downgrade to lenient acceptance.

## Data lifecycle

Node files and snapshots are sandbox lifecycle data and do not enter the control plane database. Once a sandbox is gone, historical archiving is the job of the separate artefact archive mechanism.

When a task ends, the system-level knowledge consolidation hook produces a knowledge increment from the task inputs, artefacts, code changes, verification results and authorised interactions. A successful task archives, for every successful attempt, the artefact manifest, the result summary, all declared artefacts, and the final graph and version manifest; it does not archive the source worktree or undeclared temporary files.

When a task fails or is cancelled while its sandbox is still reachable, the platform archives the declared artefacts of completed nodes, the last failed attempt, the failure report and the diagnostic manifest. If the sandbox is already gone, the material cannot be re-uploaded; the platform relies on the trace data that has already reached the telemetry system and on the control plane's task-level failure record.

The final manifest produced by archiving is a read-only execution report, **not a recoverable checkpoint**. After a task ends the UI can read that report to show history, but cannot use it to restore the original sandbox execution.
`,
  },
  {
    slug: "concepts/knowledge-and-memory",
    section: "concepts",
    title: "Knowledge and memory",
    summary:
      "Two independent authority boundaries: how project knowledge reaches execution through human governance, and how personal memory is layered and frozen when a task is created.",
    readingOrder: 6,
    body: `
## Two boundaries

Knowledge and memory are two independent authority boundaries, not two names for one system.

**Knowledge** is formal cognition that has been synthesised within an explicit scope, is reusable, and carries its sources. People maintain and review it. It enters the retrieval data plane, and tasks query it during execution under live authorisation.

**Memory** is the ongoing mechanism that captures, consolidates, recalls and forgets cognition. It is subject-centred, uses a separate database and account, and does not enter the knowledge retrieval data plane.

They are separate for governability: knowledge needs authoritative sources and review, while memory needs frequent reads and writes and personalised recall. Putting both in one store means either knowledge gets polluted by noise, or memory gets slowed down by governance.

## Knowledge spaces

Knowledge is divided into two spaces.

**Repository knowledge** describes what a repository can currently prove through its code, tests and configuration. It evolves along with the repository's own versions.

**Project knowledge** synthesises cross-repository cognition, engineering experience, constraints and decisions from many tasks and repositories. It is where compounding across tasks happens.

A decision is special knowledge that a person confirms and that changes project direction, constraints or trade-offs. Project knowledge is the sole authority for the body of a decision, and preserves supersede and revoke relationships.

## Live recall

Knowledge has to have both a governance plane and an execution plane. Storage and a UI with no execution-time consumption interface do not add up to a complete knowledge product.

When a task is created, the control plane issues a minimal knowledge access delegation based on the task subject, the organisation and the workspace, and forcibly injects the system knowledge recall skill into every node. The flow and node library neither displays nor allows removal of that system skill.

During execution the agent queries the latest effective content live through a read-only interface. **Every call re-checks subject, organisation, workspace, scope and authorisation, and stores retrieval evidence.** After a revocation, the next call is refused immediately.

A task binding does not create a continuing read right. An agent cannot widen the bound scope, and no write access, index management or raw machine credential is exposed. When authorisation has been revoked, the scope no longer permits it, the token has expired, or the organisation does not match, the operation must fail closed.

## Documents and versions

A knowledge space is a logical namespace responsible for structure, maintainers and the access boundary. What actually participates in parsing, indexing, retrieval and taking effect is the document.

Each document has at most one editable draft, and saving uses a monotonic revision for concurrency control, preventing silent overwrites. Publishing creates an immutable document version from the current draft, and switches that document's current searchable version once parsing and indexing succeed.

Restoring a historical version only copies the historical body into a new draft; it does not overwrite history and does not publish automatically. Shared parties can read only published bodies and historical versions, and cannot see unpublished drafts.

**A knowledge space does not produce a whole-space release, and tasks do not freeze a knowledge space or a document version.** Every read selects, in real time, the effective version of each document the reader is entitled to at that moment. This is deliberate: knowledge has to keep updating, while a task's reproducibility is guaranteed by the other parts of its execution specification.

## How personal memory is layered

The platform stores personal memory with the user as its subject, covering preferences, experience, identity, goals and agent configuration. It is not copied automatically from complete conversations.

Memory has three layers:

**Working memory** is confined to one conversation or task, carries an expiry, is traceable to its source, and holds episodic summaries, observations, decisions or open items.

**Semantic memory** is experience or factual cognition the user can reuse across conversations.

**Resident memory** is the user identity, goals, preferences, behavioural rules and agent configuration that are resident by default within the context budget.

Every recall preserves the scope, the budget, the revisions chosen, the fusion score and the reason for selection. Conversations and tasks continue to consume only immutable memory snapshots.

## How a task consumes memory

When a task is created it freezes a bounded snapshot from the current user, the task text and the default agent configuration. An in-flight task does not drift with personal configuration changes; only a rebuild resolves them again.

The runner writes the frozen configuration, goals and entries into a permission-restricted read-only semantic context, and states explicitly that it cannot substitute for task instructions, project knowledge, repository evidence or authorised tools. Tasks and nodes consume only the preflight snapshot and do not read live memory.

**An agent cannot write long-term memory directly.** Only a completed task can submit memory evidence, and what it submits is structured content; the subject, task, execution generation, status and revision are bound by the control plane. The sandbox has no memory database credentials and cannot call the memory write interface directly.

The task's terminal-state record and its memory contribution are committed in the same transaction. Delivery uses an idempotency identifier, failures use leases, exponential backoff and a dead-letter path, and a **completed task is never rolled back**.

## What never enters long-term memory

Complete prompts, replies, tool output, secrets, personal information and un-redacted external data must not enter knowledge automatically.

When no retrieval data plane is configured the contract is unchanged and the platform falls back to relational database retrieval; when one is configured but unavailable, conversation degrades to relational retrieval with the reason marked, and task preflight fails closed. **A frozen snapshot does not depend on an online index and can still be replayed deterministically.**

That is an important availability guarantee: a retrieval data plane outage does not make already-created tasks unexecutable.
`,
  },
];
