import type { DocPage } from "@/content/types";

/**
 * Platform operations.
 *
 * Aimed at the person who deploys and runs this inside an enterprise, not at the
 * developer writing a task. The role page leads the section because in this
 * product the governance model is the operative fact: what a role may do is
 * enforced server-side, and getting that wrong is the most common deployment
 * misunderstanding.
 */

export const operationsEn: DocPage[] = [
  {
    slug: "operations/roles",
    section: "operations",
    title: "Roles and permissions",
    summary:
      "What each of the four perspectives can do, where those rights come from, why switching perspective never widens them, and the distinction between management target and current workspace.",
    readingOrder: 1,
    body: `
## One deployment, one Organization

A deployment has exactly one Organization. There is no multi-organisation creation, switching or archiving semantic.

A member is a human account with a stable identity inside that single Organization. A member cannot join or switch to another one.

There are three Organization-level roles: administrator, operations and member. Administrator and operations hold exactly the same platform operations capabilities; the administrator governs organisation team members, platform roles and workspace assignments on top of them, and nothing else.

## Workspace

A Workspace is the logical collaboration scope inside the Organization that carries membership authorisation and shared capabilities. It is not bound to a code repository, and may contain several.

There are three Workspace roles: administrator, member and viewer.

**Platform administration does not confer workspace data rights by itself.** An operations role that has not joined a given Workspace cannot see the tasks, knowledge or artefacts inside it.

## The four perspectives

The four perspectives in the interface must come from real persisted authorisation, not from demo parameters.

**Member** is the day-to-day perspective of anyone who is a member of an authorised Workspace. It reaches conversations, development environments, tasks, automation, knowledge, memory, the marketplace and personal connectors.

**Workspace administrator** derives from membership of the current Workspace and governs that Workspace alone. On top of member capabilities it adds team overview, member management, member usage, cost analysis and model quota.

**Operations** is a formal platform role within the single Organization, holding every platform operations capability. On top of member capabilities it adds the resource dashboard, provider clusters and sandboxes, workspace lifecycle, sandbox policy, enterprise instant messaging, the model gateway, Git services, knowledge and marketplace management, and connector exposure policy.

**Administrator** holds exactly the same platform operations capabilities as operations, and governs team members, platform roles and workspace assignments on top of them.

**Switching perspective regroups navigation; it does not widen permission.** Every read and write is still authorised by the control plane against the signed-in principal, the Organization and Workspace membership. A non-administrator who constructs a deep link must receive an authorisation denial — hiding the navigation entry is not the control.

## Account boundaries for a member

Disabling an account preserves memberships and is reversible.

Deleting an account revokes every membership and all sign-in access, and retains a permanent tombstone carrying the deletion time and the operator, together with historical business references. It cannot be restored by re-enabling. The old email address is kept on record so that automatic provisioning cannot resurrect the account.

Removing someone from a Workspace revokes only that Workspace membership and leaves the platform account untouched.

To create a member account, an administrator supplies the sign-in email, the display name and the target Workspace role; the server creates a sign-in-capable human account and joins it to the target Workspace immediately. The server generates the initial password at random, and the user, the organisation membership and the Workspace membership are written in one transaction.

An email address that already exists is always refused rather than re-provisioned. An existing password is never overwritten, and existing account authorisation is never modified implicitly.

The initial password is held in the memory of the current drawer only. It does not enter a cache, browser persistent storage or a log, and it is cleared when the drawer closes or the management target changes.

## Authentication modes

A local account signs in with a unique email address. An enterprise identity is linked to a member inside the Organization through an identity binding.

An active binding is unique on both sides — on the member and on the external identity. Switching provider retains the inactive history and requires an explicit rebind. **External identities are not merged automatically by email address**, because automatic merging would let a change in who owns an email address silently change permissions.

## Management target and current workspace

Configuration pages inside the workspace catalogue must distinguish explicitly between the **current session Workspace** and the **management target Workspace**.

Entering member, model key, sandbox or provider management from the workspace list changes the management target only; it does not switch the current Workspace of the product shell.

The distinction is easy to overlook, and the consequence is concrete: if the two are conflated, an administrator configuring Workspace B can switch their own context to B without noticing.
`,
  },
  {
    slug: "operations/configuration",
    section: "operations",
    title: "Platform configuration",
    summary:
      "Deployment-level settings for the model gateway, Git services, sandbox policy, enterprise integrations and observability — and which of them belong to the platform rather than to a Workspace.",
    readingOrder: 2,
    body: `
## Which layer a setting belongs to

Start by deciding which layer a setting belongs to. That determines who may change it and whose work the change affects.

**Deployment-level** settings are maintained by operations or an administrator: the model gateway, the Git service catalogue, sandbox providers and run policy, enterprise instant messaging, knowledge retrieval models, marketplace management and connector exposure policy.

**Workspace-level** settings are maintained by a Workspace administrator: the Workspace model policy and quota, private capabilities inside the Workspace, and content authorisation.

**Personal-level** settings are maintained by each member: personal access tokens, personal model credentials, personal memory and preferences.

## Model gateways

The platform manages model invocation entry points by capability class.

The **conversation gateway** carries model calls other than embedding — currently dialogue and reasoning, reranking, vision and speech recognition — using each model's own protocol according to its capabilities. It must not disguise a reranking, vision or speech request as an ordinary dialogue call.

The **embedding gateway** carries text embedding and batch embedding calls, and has its own address, model catalogue, dimension probing and runtime health contract.

Even when the two point at the same underlying gateway, their domain identities are not merged.

Credentials come in two tiers. A platform credential is the managed credential a platform agent uses to reach a global gateway, and is managed by an administrator. A user credential is a member's private credential for a particular gateway, unique per member and gateway, usable in any Workspace that member has access to.

**An agent running in a Workspace does not fall back to a user credential.** An ordinary member can neither read nor write platform credentials.

An administrator cannot read a user credential in plaintext.

## Git services

A Git connector is a deployment-level catalogue entry. An administrator configures the provider, instance address, API address, certificates and network policy globally.

**It contains no user token**, and it is not duplicated per Workspace.

A user token is a member's private credential for a particular Git connector, unique per member and connector, usable in any Workspace that member has access to. Tokens are stored encrypted and do not enter the execution specification.

An ordinary user cannot create a duplicate global service. They can only save, rotate or revoke their own credential under the corresponding connector.

## Sandboxes and providers

A sandbox's base image, pod compute specification and maximum retention time are **deployment-level run policy**. They do not belong to a Workspace, a project, a repository or a personal setting.

The control plane holds a single-instance run policy configuration, updates it under revision concurrency control, and resolves the current revision when a task is created. The public task API does not accept a client-submitted image or resource specification.

A runner image must carry an explicit version tag or digest. Untagged images and movable tags are refused.

The provider owns creating, observing, binding and cleaning up the runtime environment. A task freezes the provider identifier, plugin version, template reference, image digest and capability digest, and does not hot-swap them while it runs.

## Knowledge and retrieval models

The knowledge data plane carries parsing, chunking, embedding, indexing and in-namespace retrieval of published documents.

An Organization binds exactly one retrieval instance, and each knowledge base uses its own namespace.

The dialogue, embedding, reranking and vision models needed for text and image ingestion are configured separately. Embedding uses the dedicated embedding gateway; the rest use the conversation gateway. A Workspace may be given its own credential per gateway, and inherits the corresponding platform default when none is assigned.

Knowledge governance metadata is held by the control plane, while raw document content is written to object storage.

**The two systems may share a database cluster, but they must use separate databases, roles, schemas and migrations, and cross-database joins are forbidden.** The two are backed up, restored and upgraded independently.

## Enterprise integrations

Enterprise instant messaging configuration is Organization-level. The single Organization may hold several provider configurations but may activate only one. Authorisation and synchronisation must freeze the Organization, the external tenant and the configuration revision.

Content authorisation and sign-in authorisation are **two independent authorisations**, using different callback addresses.

## Connector exposure policy

Connector management configures Workspace exposure policy and custom authenticated connectors. Client secrets are stored encrypted, and after a member authorises one, the proxy injects it into the managed environment under a short-lived lease.

## Observability

Platform telemetry presents in-cluster resources, observability runs and task associations.

Logs, traces and metrics go to the enterprise's existing observability back end. By default only session and tool **metadata** is recorded — not full prompts, replies or command output bodies.

When a session body exceeds the event payload limit, the supervisor stores the complete text content-addressed by content digest inside the sandbox the task belongs to, and carries only a preview and an immutable content reference in the event. The control plane reads it through a task-scoped interface in bounded chunks each time, and does not copy the body into the business database.

The payload limit on connection messages is a protocol guard against abnormal events. It no longer decides what agent output is visible.

## When a configuration change takes effect

**A settings update affects only subsequent tasks.** Run policy, model gateway and capability versions are frozen at task creation and cannot drift underneath an existing task.

An ordinary secret rotation affects new tasks only; an emergency revocation takes effect by terminating the affected sandboxes.

So if you change run policy and the behaviour of an existing task does not change, that is the expected behaviour and not a caching problem.
`,
  },
  {
    slug: "operations/verification",
    section: "operations",
    title: "Verification and acceptance boundaries",
    summary:
      "The four verification levels, and why none of them substitutes for another. This is the language any external capability claim has to use.",
    readingOrder: 3,
    body: `
## Why levels are needed

"The page exists" is not the same as "the capability is complete". In a privately deployed product the cost of confusing them is specific: the buyer will run acceptance against your description, and the acceptance failure happens at the customer site.

The platform therefore states the completeness of each capability against four distinct levels. **No level substitutes for another.**

| Level | Established by | What it proves | What it does not prove |
| --- | --- | --- | --- |
| 1. Implemented | Code and targeted tests | The route, API, domain service and authoritative store or runtime path exist | That it deploys, or that real external systems can be integrated |
| 2. Passing repository gates | Tests, type checks, builds, protocol and module boundary validation | The code is self-consistent in an isolated environment | Runtime behaviour — gates usually run against controlled fixtures |
| 3. Deployed | An immutable image from a named snapshot, plus health, routing and smoke checks in a named environment | That it can be deployed and the basic path is reachable | Any business capability — smoke checks only show the process is alive and routes respond |
| 4. Authenticated business end to end | A real signed-in principal using a real model gateway, Git service, connector or data plane for the corresponding read/write path | Business capability | — |

## 1. Implemented

The route, API, domain service and authoritative store or runtime path exist, with targeted tests.

This level proves the code was written and the path is connected. It does not prove a deployment runs, nor that a real external system can be integrated.

## 2. Passing repository gates

The relevant tests, type checks, builds, protocol and module boundary validation pass.

This level proves the code is self-consistent in an isolated environment. It does not prove runtime behaviour, because gates usually run against controlled fixtures.

## 3. Deployed

A named code snapshot is built into an immutable image and passes health, routing and the relevant smoke checks in a specified environment.

This level proves it can be deployed and that the basic path is reachable. It does not prove any business capability, because smoke checks normally verify only that the process is alive and routes respond.

## 4. Authenticated business end to end

A real signed-in principal completes the corresponding read and write path against a real model gateway, Git service, connector or data plane.

This is the only level that proves a business capability.

## Why they do not substitute for each other

**A full-route browser check against controlled fixtures** proves the production bundle, routing and layout. It uses static data, so it proves nothing about the correctness of any data path.

**A clean build or a basic health check** cannot stand in for runtime acceptance. A deployment that never reached a model gateway can be perfectly healthy.

**A cluster smoke test or a single real task** cannot stand in for per-capability business acceptance. One successful task does not prove that knowledge recall, marketplace publishing or enterprise sign-in work as well.

## Current state

The repository already contains a working vertical slice, runnable locally and on OrbStack, used to verify that the product's domain model, control plane, real agent sessions, isolated sandbox, dependency graph scheduling, artefact handoff, knowledge recall, runtime snapshot and resume, observability and console experience connect end to end.

That is not the same as a complete production release. The following are still under construction and acceptance:

- full coverage of the persistent services;
- enterprise single sign-on and audit;
- a highly available control plane;
- additional coding drivers;
- production installation and upgrade;
- full end-to-end acceptance against real enterprise gateways and code hosting systems.

The authoritative statement of what is implemented and what is missing is the system architecture document in the repository.

## The rule for external claims

In external material, pre-sales briefings and acceptance reports:

- do not claim a capability is available without level-four evidence;
- do not use "deployed" in place of "accepted";
- state the difference between the target shape and the current implementation explicitly.

This rule governs this manual itself, not only the product.
`,
  },
];
