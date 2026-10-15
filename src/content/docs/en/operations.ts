import type { DocPage } from "@/content/types";

export const operationsEn: DocPage[] = [
  {
    slug: "operations/roles",
    section: "operations",
    title: "Roles and permissions",
    summary: "Understand member, team and platform scopes, and separate navigation perspectives from actual data permissions.",
    readingOrder: 1,
    body: `
## Organization and workspaces

A deployment has one organization. Workspaces hold membership authorization and shared capabilities. A workspace may contain multiple projects and repositories; it is not a repository.

Organization identity and workspace membership participate separately in authorization. Platform administration does not automatically grant access to every workspace's business data.

## Understand the navigation scopes

| Scope | Main work | Common entries |
| --- | --- | --- |
| Member | Daily collaboration, tasks, knowledge and personal authorization | Chat, Staff, Tasks, Knowledge, Connections & access |
| Team management | Workspace members, usage and model quotas | Team |
| Platform operations | Global services, runtime resources and organization integrations | Platform |

The interface exposes entries available to the current identity. Changing perspective reorganizes navigation without widening rights. Direct URLs still require server authorization.

## Administrators and operations

Organization administrators and operations roles configure the platform. Administrators additionally govern organization members, platform roles and workspace assignments. A workspace administrator's authority is limited to the relevant workspace.

Check the management target before acting. It can differ from the workspace where you are currently working; opening another workspace's settings does not imply your session scope changed.

## Credentials belong to members

Personal Git tokens, model credentials and external tool authorization are managed in **Connections & access**. Shared roles, Skills and workspace membership do not copy another member's private credentials.

Administrators configure service catalogs and policy. Members authorize the services they can access. Revoking authorization and deleting business results are different operations.

## Accounts and membership

Disabling an account, deleting it and removing workspace membership have different effects. Confirm whether the goal is to stop sign-in, revoke one scope or irreversibly delete an account.

Enterprise and local identities are linked through explicit identity bindings. Matching email addresses alone do not establish equal permissions.
`,
  },
  {
    slug: "operations/configuration",
    section: "operations",
    title: "Platform configuration and personal access",
    summary: "Use Platform and Connectors to configure models, Git, runtimes and integrations, then check when changes take effect.",
    readingOrder: 2,
    body: `
## Establish ownership first

Administrators or operations manage platform services. Workspace administrators manage their policies. Members maintain private authorization in **Connections & access**.

| Configuration | Console entry | Validate afterward |
| --- | --- | --- |
| Model catalog and gateway | Platform administration → LLM gateway | Actual model calls and protocol compatibility |
| Embedding services | Platform administration → Embedding gateway | Document indexing and retrieval tests |
| Git service catalog | Platform administration → Git services | Repository and branch listing after member authorization |
| Images, resources and environments | Platform administration → Runtime environment | Actual environment creation and execution |
| Enterprise messaging and integrations | Relevant integration page in Platform administration | Sign-in, authorization or messaging separately |
| Private credentials and tool access | Connections & access | Current member authorization and an actual call |

## Check models and Harnesses separately

The LLM and embedding gateways have separate model catalogs and invocation purposes. Even when they use the same underlying service, check their capabilities and configuration independently.

The Agent Harness determines session and tool execution; the model supplies reasoning. Adding a model does not add a working Harness, and installing an endpoint does not establish compatibility with every model.

## Git services and member authorization

The platform configures providers and instance addresses. Members then authorize their Git accounts. Task creation lists repositories under the current member's permissions.

If the service exists but the repository cannot be selected, check personal authorization and repository access. Do not create a duplicate global Git service for each member.

## Knowledge and enterprise sources

Knowledge needs document storage, parsing, indexing and retrieval to work together. Validate an actual publication and retrieval test rather than relying on a saved configuration.

Enterprise sign-in, document access and messaging have separate authorization conditions. One working path does not establish the others.

## When changes apply

A task retains its initially resolved inputs, capability versions and runtime policy. Updating configuration does not rewrite its historical spec.

Runtime recovery checks current authorization, credentials and runtime while validating frozen toolchains. Supported later session model choices must remain compatible with the existing environment, gateway and protocol; they cannot replace the original Harness.

After a change, check new tasks and tasks needing recovery separately. Their resolution rules differ.
`,
  },
  {
    slug: "operations/verification",
    section: "operations",
    title: "Verification boundaries",
    summary: "Record implementation, automated checks, deployment health and actual business acceptance separately.",
    readingOrder: 3,
    body: `
## Four kinds of evidence

| Level | Establishes | Does not establish alone |
| --- | --- | --- |
| Implemented | Routes, APIs and execution paths exist | Availability in the target deployment |
| Automated checks passed | Relevant tests, types and builds passed | Actual external services are connected |
| Deployed | A specific version is healthy and passes routing and smoke checks | Acceptance of all business capabilities |
| Real business acceptance | A real subject completed the relevant reads and writes through actual services | Untested capabilities also work |

## Console screenshots on this site

Screenshots show the actual product Console with example data. They explain interface organization and action locations. The depicted tasks, employees and metrics are not evidence of production activity.

Browser checks with example data can expose layout and interaction problems. They do not validate model gateways, Git, knowledge retrieval or external tools.

## Minimum business checks

1. Sign in as a real member and confirm workspace and data access.
2. Make a real model call under the correct authorization.
3. List an accessible repository and branch.
4. Complete a small task and review changes, checks and delivery links.
5. Publish a knowledge document and check indexing and sourced retrieval.
6. After training or hiring an employee, confirm dependencies and readiness, then delegate actual follow-up work.

Test execution resume and runtime snapshot recovery separately when required. They have distinct prerequisites; one successful task cannot validate both.

## Record acceptance results

Record the product version, environment, operator role, inputs, expected and actual results, and evidence. For failures, state the boundary and reproduction conditions.

For compatibility, record the exact model, Harness, gateway protocol and tool-authorization combination. One successful combination does not establish support for every possible combination.
`,
  },
];
