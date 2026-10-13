import type { DocPage } from "@/content/types";

/**
 * Reference.
 *
 * The glossary uses the same "avoid these words" discipline the product's own
 * domain document uses, because most misuse of this vocabulary is a reader
 * substituting a familiar word from a different system — "job", "thread",
 * "deployment" — and then reasoning about the product as if it were that system.
 * Naming the forbidden synonyms is the cheapest way to stop that.
 */

export const referenceEn: DocPage[] = [
  {
    slug: "reference/glossary",
    section: "reference",
    title: "Domain glossary",
    summary:
      "The canonical vocabulary for the platform's domain objects. Each entry gives a definition and the words that should not be used in its place, for aligning discussion, review and documentation.",
    readingOrder: 1,
    body: `
This page fixes the canonical vocabulary of the product domain. Each entry gives a definition and **the words that should not be used instead** — those usually arrive as habits carried over from another system, and mixing them in blurs the discussion exactly where precision matters.

## Organization and scope

**Organization**
The single enterprise and team governance boundary in one deployment. A deployment has exactly one Organization, which may contain several Workspaces.

*Avoid*: tenant, customer account, organisation switcher, cross-organisation membership.

**User**
A human member with a stable identity inside the single Organization. A member cannot join or switch to another Organization.

*Avoid*: global cross-organisation account, tenant user.

**Workspace**
The logical collaboration scope inside the Organization that carries membership authorisation and shared capabilities.

*Avoid*: project, repository group.

**Project**
A long-lived scope inside a Workspace that organises repositories, tasks, knowledge and decisions around one sustained engineering goal.

*Avoid*: repository, task collection.

**Repository**
One independently versioned codebase associated with a project.

*Avoid*: project, workspace.

## Execution

**Task**
One work instance that executes an R&D goal against frozen inputs.

*Avoid*: project, job history.

**TaskSpec**
The set of inputs and versions resolved before task creation and immutable while it runs.

*Avoid*: task context, runtime state.

**Flow**
A reusable R&D process asset maintained by a user or by the platform. Its definition describes node invocations, dependencies and data contracts; the dependency graph is a visual projection of that same content.

*Avoid*: visual-only flowchart, canvas document.

**WorkNode**
A reusable agent execution definition that can be maintained and versioned independently.

*Avoid*: flow invocation, node position in a graph.

**Flow Invocation**
One work node invocation inside a flow, carrying a node identifier, dependencies, input bindings, outputs and artefact routing.

*Avoid*: work node, standalone task.

**Attempt**
One immutable execution version of a work node. A successful attempt freezes its artefacts.

*Avoid*: retry count, task rerun.

**Sandbox**
The isolated runtime boundary of one task. One task corresponds to one sandbox.

*Avoid*: container, pod, runtime environment pool.

**Execution Generation**
The identifier of a new execution sequence created by one resume action. Cancellation acceptance, process exit, durable terminal state and business success are distinct facts.

*Avoid*: restart, rollback.

## Handoff and delivery

**Artefact**
Data formally handed off between nodes. Identified by name, path, size and digest. A downstream node cannot modify an upstream version.

*Avoid*: output file, temporary file, build output directory.

**Unit Gate**
A deterministic check command declared by the user on a work node, judged by its exit code.

*Avoid*: test suite, CI step.

**AgentExecutionManifest**
The single execution configuration of a task, secret-free and digests fixed, containing the repository, the requirement source locations and the complete execution definition of every node.

*Avoid*: collection of configuration files, runtime configuration.

**Code Change Artefact**
The immutable code change produced by one invocation, identifying the repository it belongs to, the starting code version, the result version and the originating attempt.

*Avoid*: working tree directory, moved branch pointer.

## Knowledge and memory

**Knowledge**
Formal cognition that is synthesised within an explicit scope, reusable and sourced.

*Avoid*: raw material, conversation transcript, retrieval result.

**Knowledge Space**
A body of knowledge with its own authoritative source, version history and access boundary. Split into repository knowledge and project knowledge.

*Avoid*: search index, vector database.

**Decision**
A special kind of knowledge, confirmed by a person, that changes a project's direction, constraints or trade-offs.

*Avoid*: agent inference, chat message.

**Source**
Raw evidence that can support or contradict a piece of cognition — code, a document, an artefact, an interaction, a commit or a change request.

*Avoid*: knowledge, memory.

**Memory**
The ongoing mechanism that captures, consolidates, recalls and forgets cognition out of execution.

*Avoid*: session archive, task log, knowledge record.

**Memory Snapshot**
An immutable, verifiable projection of the configuration and memory revisions one turn or task actually consumed.

*Avoid*: live memory, latest configuration.

**Memory Contribution**
Memory evidence and source references submitted by a successful task through a version-constrained structured artefact. The subject, the task, the execution generation, the status and the revision are bound by the control plane.

*Avoid*: writing to memory directly, task log.

**Working Memory**
Situational summaries, observations, decisions or open items confined to one conversation or task, carrying an expiry and traceable to their sources.

*Avoid*: prompt buffer, conversation archive.

**Semantic Memory**
Experience or factual cognition a user can reuse across conversations, requiring an explicit authoritative state.

*Avoid*: project knowledge, raw fragment, vector.

**Resident Memory**
User identity, goals, preferences, behavioural rules and agent configuration that reside in context by default within the context budget.

*Avoid*: system policy, task instruction, project knowledge.

## Capability supply chain

**Marketplace Asset**
A flow, node, skill or extension with a stable identity, a single editable authority and a continuous release history.

*Avoid*: per-scope copy, catalogue card, installation state, runtime selection.

**Asset Promotion**
A one-way promotion that creates the release at the target tier, migrates asset authority and closes the old scope's write entry in a single atomic state transition.

*Avoid*: copy, installation, publishing an image.

**Skill**
A set of versioned instructions, reference material, scripts and supporting files that an agent can assemble and use.

*Avoid*: prompt, installed runtime dependency.

**Skill Release**
An immutable version formed from a deterministic package that passed package contract validation.

*Avoid*: draft, live Git path.

**Capability Visibility**
The discoverable-and-usable relation between one release and the current invoking principal. Once live authorisation passes, the capability enters the execution capability set directly, with no extra installation, subscription, copy or binding required.

*Avoid*: installation, subscription, personal favourite, user-installed flag.

**User Runtime Credential**
A member's private authorisation for Git, a model gateway, an extension or an external connector. A Workspace only constrains which resources and capabilities that credential may reach; it cannot own, copy or persist a personal secret.

*Avoid*: workspace credential, capability visibility, marketplace asset.

## Organization and roles

**Platform Assistant**
A deployment-level platform AI assistant for all authorised members. It explains the platform, queries state, forms proposals and bridges to governed execution entry points, but does not carry out a user's R&D work itself.

*Avoid*: workspace-owned agent, task agent, execution agent.

**Personal Development Environment**
A member's single personal development machine runtime identity in the current deployment. It can start, stop or exit on idle, but those run states do not change its persistent workspace identity.

*Avoid*: workspace machine, one-off task sandbox.

**Managed Development Service**
A standard capability entry point that the platform provides and governs inside a personal development environment, with a stable service identity, an access scope and an independent health state.

*Avoid*: open port, container port, auto-discovered port.

**Development Port Forward**
An authorisation relation a member creates explicitly, mapping a user application service inside their personal development machine to a governed access entry point.

*Avoid*: port open by default, automatic exposure.
`,
  },
  {
    slug: "reference/faq",
    section: "reference",
    title: "Frequently asked questions",
    summary:
      "Common questions about product positioning, deployment shape, security boundaries and maturity, grouped by the kind of question asked.",
    readingOrder: 2,
    body: `
## Product positioning

**How is this different from a chat-style coding assistant?**

A chat assistant optimises the quality of a single interaction. SkyMythos optimises whether **one piece of R&D work can be explained, audited, replayed and handed off by an organisation.**

The difference is concrete. Execution inputs are frozen rather than drifting with the session. Multiple nodes are independent sessions rather than one long conversation. Completion is proven by artefacts and unit gates rather than asserted in natural language. A failure keeps its lineage and can be recovered from a defined boundary. Long-lived cognition enters a reviewable knowledge space instead of scattering across session history.

**Is it a CI/CD system?**

No. It covers the span from requirement and design to code delivery, and works alongside existing code hosting, CI/CD and release systems. It does not take over build clusters, and it does not take over production release.

**Is it an agent framework?**

No. It is a control plane: it owns identity, versions, policy, sandbox lifecycle and delivery. The agent runtime is a replaceable component, integrated through versioned adapters.

**Why not a large DAG canvas?**

Because running tasks and their sessions are the primary working surface. The dependency graph exists to explain the process, and is expanded on demand. Making the canvas the centre of the product would suggest that orchestration is itself the goal, when the goal is a deliverable engineering result.

## Deployment shape

**Is there a SaaS option?**

The product is designed on the premise of **private deployment only**. The core control plane, sandbox, model access, artefacts and telemetry paths all run independently inside the customer environment, with no dependency on an external managed service.

That means every state authority must be deployed inside the customer network.

**What is the minimum required?**

A container runtime, a model gateway, and PostgreSQL and S3-compatible object storage for production. The Kubernetes path additionally needs a cluster and the agent sandbox prerequisites installed in advance.

**Can we use our own model gateway?**

Yes — that is the design goal. The platform manages gateway addresses and model catalogues by capability class, and supports multiple providers and protocols. Model fallback is a capability internal to the gateway and is transparent to a flow.

**Does it need internet access?**

The critical path has no dependency on the public internet. Model calls egress to the gateway you configured yourself. Skills and extensions can come only from the local registry, and the sandbox is forbidden from fetching capability code from the public internet at start-up.

**Can it be used without a model?**

No. The platform ships no built-in model and provides no rule-based fallback.

## Security and governance

**Can a prompt or a skill serve as a security boundary?**

No, and that is an explicit architectural position. Credentials, tools, network access and high-risk side effects must be constrained by **platform policy**.

Concretely: a task receives only the credentials injected by a minimal recipient; the main agent process does not hold extension credentials directly; task secrets are deleted as soon as the components that need them are ready; the sandbox is forbidden from pulling code from the public internet at start-up; and an agent running in a Workspace does not fall back to personal credentials.

**Are code and credentials sent anywhere?**

Code is processed only inside the task sandbox, and artefacts are archived to object storage you configure yourself. Credentials are stored encrypted and injected at runtime by reference through environment variables; plaintext is never written to a configuration file, a specification, an event or a log. Session bodies exist only for the lifetime of the sandbox by default, and do not enter the business database.

An enterprise can enable separately encrypted session archiving and retain it under policy.

**Can an administrator see my personal credentials?**

No. Access tokens and secrets are stored encrypted; an administrator cannot read them in plaintext and the API does not echo them.

**What do audit records contain?**

Publishing, withdrawal, tag moves, task resolution, sandbox materialisation, connection readiness and rework refresh enter the security audit. **Secrets, full prompts and session bodies do not.**

## Running and failures

**Can a task continue from where it was interrupted?**

It can be resumed, within a defined boundary. Inside an available sandbox, a new execution generation can be created from an already-started node that the user or a gate decision selects.

**What happens if the whole sandbox is lost?**

The task fails. **There is no cross-sandbox recovery** — dependency graph state, sessions, artefacts and Git worktrees live in the same failure domain, and that is a deliberate design trade. The alternative would require a distributed state machine, and at this stage the complexity does not pay for itself.

**Why is the sandbox not released while waiting for user input?**

Because the dependency graph state lives inside the sandbox. Releasing it would lose the execution lineage. This limitation is known, and changing it would require a new architectural decision.

**What happens when a model returns an empty response?**

A bounded number of recovery sessions is started under a backoff policy. Once those are exhausted, an explicit node failure is retained, so it can be rerun individually after the model or connector is updated. **An empty response is never disguised as completion.**

**Can a required node be skipped?**

No. Skipping a required node breaks the integrity of the artefact contract, leaving downstream to consume something that was never produced. That is precisely the class of problem this product exists to remove.

## Knowledge and memory

**Does conversation history automatically become long-term knowledge?**

No. Content entering a knowledge space must be traceable, reviewable and backed by an explicit authoritative source. A complete conversation is source material, not knowledge.

**Can a knowledge update change a task already in flight?**

No. A task freezes its knowledge snapshot at creation, and an in-flight task does not drift with personal configuration or knowledge updates. Knowledge recall during execution does read the latest effective content live and re-checks authorisation — so revoking a permission takes effect immediately.

**What happens to tasks if the retrieval service goes down?**

A snapshot that has already been frozen does not depend on an online index and can be replayed deterministically. Task preflight fails closed when the retrieval service is configured but unavailable; a conversation degrades to relational database retrieval and marks the reason.

**Does a knowledge base update require a re-publish?**

A knowledge base does not produce a whole-corpus release. Each document has its own draft and published version, and each read selects, live, the effective version the reader is authorised for at that moment.

## Maturity and procurement

**Can it be used in production today?**

That needs a distinction. The repository already contains a working vertical slice covering the full path from the domain model to the console experience. But a highly available control plane, enterprise single sign-on and audit, production installation and upgrade, and full end-to-end acceptance against real external systems are still under construction.

A procurement evaluation should confirm each item against the four verification levels, and should not accept "it deploys" or "it ran one task successfully" in place of business acceptance.

**How do I confirm a capability really works?**

Ask for level-four evidence for that capability: a real signed-in principal completing the corresponding read and write path against a real model gateway, Git service, connector or data plane.

The first three levels — implemented, passing gates, deployed — cannot substitute for it.

**What if there is no level-four evidence?**

Describe the target shape, and mark explicitly that it is not yet verified. This manual's usage rule governs the product itself, not only the documentation.

**Can I contribute?**

Source, deployment instructions and architecture documentation are in the project repository. Licence and contribution terms are governed by the actual statement in that repository.
`,
  },
];
