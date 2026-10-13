import type { DocPage } from "@/content/types";

/**
 * Getting started.
 *
 * Written as an operational sequence, not a feature tour. Each page ends with the
 * observable result of the step, so a reader can tell whether it worked before
 * moving on — the most common failure mode in platform documentation is that a
 * reader only discovers a misconfiguration three steps later.
 *
 * The English tree carries the same three slugs in the same reading order as the
 * Chinese source, so the sitemap and the static-params generators can read either
 * corpus. The prose is written for an overseas evaluator: same system, same
 * constraints, more of the reasoning stated explicitly.
 */

export const gettingStartedEn: DocPage[] = [
  {
    slug: "getting-started/overview",
    section: "getting-started",
    title: "Overview",
    summary:
      "What you need in place, the two ways to bring the platform up, and how to choose between them. Read this page first.",
    readingOrder: 1,
    body: `
SkyMythos offers two ways to get started, and which one you pick depends on what you are trying to verify.

The **local runtime** brings up the control plane and a task runtime on your development machine with a single command. It suits a first contact with the platform, confirming that a model gateway is reachable, and walking the domain model through one complete task. It needs a machine that can run containers, and a reachable model gateway.

A **local Kubernetes deployment** installs the control plane, the Agent Runner, the Sandbox Provider and the runtime into a cluster through one unified Helm install. It suits verifying the isolated execution boundary and the behaviour of the Agent Sandbox and network policy.

Both paths assume the infrastructure underneath is already in place. The Kubernetes path additionally requires the Agent Sandbox Controller, a RuntimeClass and a network policy enforcer to be installed beforehand; none of those are part of the Helm install.

## What you need in place

The platform is designed private-first: every critical path runs inside your own network without depending on an external managed service. Before starting, have the following ready.

| Component | What it is for | Required |
| --- | --- | --- |
| Container runtime | Hosts the control plane and the task execution environment | Yes |
| Model gateway | Serves chat and reasoning model calls | Yes |
| PostgreSQL | The authoritative store for the control plane's structured business state | Required in production |
| S3-compatible object storage | Large objects — runtime snapshots, frozen requirements, capability packages | Required in production |
| Kubernetes cluster | Isolated execution boundary and sandbox lifecycle | Kubernetes path only |
| Git service credentials | Clone repositories, read issues, open change requests | Required once you create tasks |

You can start without configuring Git or the knowledge data plane. As soon as you create a real task, though, the runner needs to be able to reach a repository.

## Choosing a path

If your first goal is to understand how the product works, pair the **Core concepts** section of this manual with a local run, reading and watching side by side.

If you have already decided to evaluate isolated execution and the cluster deployment shape, go straight to the Kubernetes deployment and come back to the concepts afterwards.

If what you need to confirm is that the platform interoperates with your existing model gateway and code hosting system, configure the model gateway and the enterprise connectors first, then create a task.

## Reading order for this section

The three pages in this section are meant to be read in order: confirm the requirements and versions, complete the deployment, then create your first task. The third page walks all the way through preflight, execution, artefacts and delivery, and it is the fastest way to understand the whole product.

## One caveat, stated up front

This manual distinguishes between what is **implemented** and what is a **target shape**. The repository today contains a working vertical slice covering the domain model, the control plane, real agent sessions, isolated sandboxes, dependency-graph scheduling, artefact handoff, knowledge recall, runtime snapshot and resume, observability and the console. That is not the same as a complete production release: the highly available control plane, enterprise single sign-on and audit, production installation and upgrade, and full end-to-end acceptance against real enterprise gateways and code hosting systems are all still under construction.

Wherever a description is marked as a target, do not treat it as a verified capability.
`,
  },
  {
    slug: "getting-started/deployment",
    section: "getting-started",
    title: "Deployment",
    summary:
      "Complete steps for both deployment paths — local runtime and local Kubernetes — including prerequisites, private configuration and post-deployment verification.",
    readingOrder: 2,
    body: `
## Local runtime

The local runtime starts the control plane with a single command and has the control plane create a process-level execution environment for each task. It is the fastest way to verify the domain model.

\`\`\`bash
make run-local
\`\`\`

Once it is up, open \`http://127.0.0.1:8080\` and complete the configuration on the model gateway page under settings. Those steps are in the next section. The model a task uses is chosen when the task is created.

The local runtime is the right way to verify the domain model, the control plane, the task runtime and artefact handoff. It does not provide the resource isolation or the network policy boundary of Kubernetes.

## Local Kubernetes deployment

The Kubernetes path deploys the full isolated execution boundary. Before you start, the Agent Sandbox prerequisites must be in place — the Agent Sandbox Controller, the RuntimeClass and the network policy enforcer are not covered by the unified Helm install.

The prerequisite steps are documented under \`deploy/prerequisites/agent-sandbox\` in the repository.

### Generate the private configuration

The Helm install needs a private values file carrying the database credentials, the object storage credentials and the initial administrator configuration. Generate it first and store it safely; do not commit it to version control.

### Run the install

\`\`\`bash
FUSION_HELM_VALUES=/absolute/path/helm-private.yaml make deploy-local
\`\`\`

This performs the unified local Helm install. It does not build images, and it does not take over cluster resources already managed by an existing manifest. You can also pass the private values path as the first argument to \`deploy/helm/deploy-local.sh\`.

### What a successful install does not prove

A successful install proves only that the Helm release completed and the basic health checks pass. It does not prove any of the following:

- that the control plane can reach the model gateway and complete a real inference call;
- that the runner can clone the target repository;
- that the sandbox imposes the execution boundary as intended;
- that a task can go from creation all the way to delivery.

Each of those has to be verified separately. The four verification levels are set out in the platform operations section.

## Configure the model gateway

Whichever path you took, no task can run without a usable model gateway.

1. Open the model gateway page in platform settings.
2. Enter the gateway address.
3. Save the API key. The key is encrypted with the platform master key and is never echoed back, by either the page or the API.
4. Add the models you want to offer, with their provider and model identifier.
5. Select a model when you create a task.

The platform manages gateways by capability class. A gateway carrying chat and reasoning and a gateway carrying embeddings keep separate addresses, capability catalogues, health states and credential revisions; they do not merge into one domain identity even when a deployment points both of them at the same underlying gateway.

Credentials come in two tiers. Platform credentials are configured by an administrator and used by the platform itself; user credentials are stored by each member and used for the work scopes that member is entitled to. Ordinary members can neither read nor write platform credentials, and an agent inside a workspace never falls back to user credentials.

## Configure enterprise identity and document ingestion

Enterprise single sign-on, or pulling requirement text from an enterprise document system, requires the PostgreSQL identity mode.

After signing in as a system administrator, open the enterprise identity and documents page in settings, fill in the region, application ID, application secret and public base URL, and enable single sign-on and document authorisation separately. Changes take effect immediately on save; no restart is required. The application secret can only be written or rotated, and is never echoed back by the page or the API.

The environment variables below are for first start-up or disaster recovery only. When the database has no administrator configuration yet, they create the initial record; when a configuration already exists, they do not overwrite the administrator's revision.

\`\`\`bash
FUSION_LARK_APP_ID=cli_xxx
FUSION_LARK_APP_SECRET=***
FUSION_PUBLIC_BASE_URL=https://example.internal
FUSION_LARK_AUTO_PROVISION=true
\`\`\`

Two callback URLs must be registered in the application: one for sign-in, and a separate one for document authorisation. Content authorisation needs document read and offline access permissions. At present only an explicit document URL entered by an administrator is supported, and only Markdown is pulled — the platform does not scan an entire knowledge space, and it makes no claim to inherit the source system's access control.

## Verify the installation

\`\`\`bash
make verify
\`\`\`

The aggregate check covers the protocol authority and retirement gates, static analysis, tests and builds for each independent module, and front-end type checking and the production build.

Features that involve sandboxes, browsers or external storage should also be put through their corresponding live-run acceptance. A passing compile or a basic health check is no substitute for running it for real.
`,
  },
  {
    slug: "getting-started/first-task",
    section: "getting-started",
    title: "Your first task",
    summary:
      "A complete walkthrough from submitting a requirement to receiving a change request: what preflight does, what happens inside the sandbox, how artefacts are handed off, and how to confirm delivery succeeded.",
    readingOrder: 3,
    body: `
This page walks one real task end to end. Each step says what you should see, and where to look when something goes wrong.

## Before you start

Three things need to be true: the model gateway is configured and usable, your account has membership rights in the current workspace, and you have saved a personal access token for the Git service you are targeting.

The task creation page will not let you type a repository URL by hand. The platform lists the Git services you have configured a personal token for, then has the server query — using your decrypted token — the repositories you are entitled to. Once you pick a repository it queries the branches, and prefers the default branch the provider reports.

The point of this indirection is that an invalid token, or one without repository access, fails the task during preflight rather than halfway through execution.

## Step 1: Submit the requirement

Task creation is requirement-first, in that order, and the ordering is deliberate.

**Requirement sources** is a multi-line field, and the lines together make up one requirement: Markdown documents, Git issues, enterprise document links, enterprise messaging links. Each line is independent — switching the source type of one line affects only that line, and editing one line does not rewrite the content of another.

Online sources need a URL. The platform reads the issue title server-side using the current user's credentials and validates the link against the configured connector. The browser never talks to the provider's API directly.

**Task name** is filled in automatically to cut down on repeated typing. The name walks the source lines in order and takes the first usable title: for Markdown it extracts the first level-one heading that is not inside a code fence, falling back to the file name; for an issue it reads the real title through the provider, and keeps a placeholder while continuing the creation flow if that fails. The automatic value follows your sources only while you have not edited the name yourself; once you have typed a non-empty name, later source changes will not overwrite it.

**Flow mode** defaults to smart orchestration. On submit, preflight retrieves, evaluates and prefers to reuse an existing flow, and generates a task-scoped temporary flow only when nothing fits.

Advanced users can switch to using an existing flow, choosing from a compact selector a published version visible in the current workspace. Doing so expands only those dynamic fields of that version's input contract that cannot be derived.

Creating a flow opens a separate authoring page; long-lived asset editing is deliberately kept out of the task form.

## Step 2: Read the preflight

On submit, the task is persisted and an identifier returned first, after which it enters the user-visible preflight stage. At this point **no sandbox resource has been created**.

Preflight does the following, in order:

1. resolves identity, workspace, requirement, repository, branch and available capabilities;
2. freezes the existing version you chose, or runs retrieval, evaluation, adaptation and generation;
3. normalises the flow through the shared deterministic compiler, validating the dependency graph, schemas, artefacts, capabilities, permissions and risk;
4. persists the risk, confidence and approval-required assessment;
5. freezes the initial execution flow snapshot, the execution specification and the exact capability lock;
6. creates a sandbox only if everything above passed.

While preflight runs you can watch flow retrieval, generation, risk and freezing progress. On failure the task keeps its structured check results and a repair entry point: no runtime resource is created, and there is no silent fallback to broader permissions.

The most common causes of a preflight failure are an unreachable repository or branch, a missing or expired personal token, and a flow declaring a capability that is unavailable in your current workspace.

## Step 3: Watch execution

Once preflight passes, provisioning begins: repository clone, requirement materialisation, runtime preparation and agent start-up, in that order.

The task detail view keeps a stable two-column relationship, with the agent session on the left and the evidence rail on the right. The rail is a single-level state machine: by default it shows the whole dependency graph, and selecting a node replaces the entire rail with that node's overview, from which you switch between code, artefacts, trace and agent. The top of the detail view gives you an explicit way back to the flow.

Node detail discloses progressively, in the order **conclusion → contract → evidence → source**:

- **Overview** leads with a skimmable execution conclusion, then shows the input and output contract, the task context, and the frozen code and artefact evidence;
- **Code** shows the code revision and the full code tree as frozen when that attempt completed; it does not read the final task branch;
- **Artefacts** shows the frozen result summary, the artefact manifest and the declared handoff artefacts; it does not expose arbitrary runtime files;
- **Trace** shows a summary of the node's calls;
- **Agent** shows the runtime, model and capabilities with their versions and lock information.

The file reader shows the original path, byte size, media type and content identifier. Text is read page by page with encoding boundaries preserved; binary content is offered only as an original-file download.

## Step 4: Confirm the artefacts

Whether a node succeeded is deterministic, and does not rest on a natural-language claim:

- every required artefact declared by the flow has been produced;
- the artefact manifest exists, is non-empty, and can enumerate the actual artefacts;
- the result summary exists with valid content;
- every unit gate passes.

A unit gate is a shell command you declare on the node — a build, a test, a static check. The runner executes it only in this attempt's own worktree and judges the result by exit code. On failure it first sends the command, the exit code and the controlled output back to the current agent session, and runs a bounded number of repair reruns within the same attempt.

Every successful attempt freezes its own code revision under a dedicated ref. After the worktree is released, that revision can still be listed and read page by page.

## Step 5: Take delivery

Once the delivery node's artefact contract and all upstream gates have passed, the runner enters a controlled completion step: it pushes the final checkpoint branch and idempotently creates or resolves a change request keyed by task identifier.

The node is marked complete only after the real provider, number, branch and URL have been written into its result. **The Git credentials used by this step are never visible to the agent session, the prompt, the tool environment or the artefacts.**

If the change-request creation response is lost, a retry must look up the original change request rather than create a second one. A branch of the same name that lacks the matching task marker is refused instead of overwritten.

The delivery summary aggregates the final result, the tests and the change request. It reports the outcome of artefact verification; it does not restate lifecycle state.

## Failure and recovery

Failures come in several kinds, and they are handled differently.

**Execution-level failures** — gateway timeouts, process crashes, command timeouts, a missing protocol — count towards retry. The platform prefers to resume the original session, and creates a new one only when reliable resumption is not possible.

**Semantic rework** deals with an upstream artefact defect that a downstream node has confirmed. Rework always creates a new session, a new attempt and a new artefact version, and its target must be a legitimate producer node of the artefact in question — it cannot be chosen mechanically as the previous node in execution order.

**A terminally failed task** can be rerun for a single failed node. A rerun does not rewrite the failure record: it appends the current attempt to history and creates a new one. Artefacts and code revisions from completed upstream nodes are reused as frozen evidence rather than recomputed.

**When the model returns an empty response**, the runner classifies it by type and starts a bounded number of recovery sessions. Once those are exhausted it keeps an explicit node failure, so you can rerun that node on its own after updating the model or the connector; an empty response is never dressed up as a completion.

Every limit — maximum attempts per node, maximum reworks per target, total reworks, maximum gate repairs per attempt — is frozen explicitly by the flow, and nodes cannot override them. Once any limit trips, the task fails.
`,
  },
];
