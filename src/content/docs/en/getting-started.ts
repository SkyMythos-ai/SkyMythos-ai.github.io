import type { DocPage } from "@/content/types";

export const gettingStartedEn: DocPage[] = [
  {
    slug: "getting-started/overview",
    section: "getting-started",
    title: "Start in the workbench",
    summary: "Find Chat, Staff, Tasks and Knowledge in the console, then choose your first workflow.",
    readingOrder: 1,
    body: `
Sign in and select a workspace. **SkyBot** hosts conversations and tasks. **Agent Employee** manages SkyBot and specialists; **Automations** organises repeatable work. **Knowledge** and **Marketplace** hold shared knowledge and reusable capabilities. Personal authorisation is under **Connections & access** at the bottom of the sidebar.

![Optional personal setup at first sign-in](/images/product/onboarding.png)

## Find the right entry

| Your goal | Console entry | What to review |
| --- | --- | --- |
| Discuss a goal or begin everyday work | Chat | Responses, tool activity and work results |
| Develop an employee from experience or hire a role | Agent Employee → Other employees | Readiness, work records, memory and experience |
| Complete a defined engineering goal in a repository | Tasks → Create task | Creation progress, execution, changes and delivery links |
| Organise scheduled or event-driven work | Automations | Definitions, published versions, trigger configuration and independent run results |
| Maintain evidence the team can reuse | Knowledge | Published documents, indexing and retrieval results |
| Find reusable roles, skills or tools | Marketplace | Asset versions, configuration and available actions |
| Authorize Git, models or external tools | Connections & access | Your account's authorization status |

These entry points share access rules and assets but retain distinct run identities. A conversation does not implicitly create an engineering Task. An Automation Run uses a published automation definition and is not an engineering Task. Configure and validate schedules, events and integrations against the deployed version’s supported capabilities.

An employee is a continuing collaboration identity. A task records one engineering execution with defined inputs and results. A knowledge base contains documents with publication, access and retrieval controls.

## Your first session

1. At first sign-in, optionally enter personal Git and model credentials, or leave everything blank and continue. Empty inputs preserve existing credentials.
2. Open **SkyBot → Chat** and describe a small goal, such as “Turn these release notes into a review checklist.”
3. Prepare a personal environment or authorisation when a feature needs it. Entering the app does not create a Sandbox or allocate runtime resources.
4. Review the actual output and unresolved questions. Open **Agent Employee** to reuse experience, or **Tasks** for a repository change.

To test engineering delivery directly, follow [Your first task](../first-task/). For a continuing assistant, read [Train and hire digital employees](../../guides/digital-employees/).

## Before you begin

Members need an account, workspace access and the connector permissions required by their work. Administrators normally prepare model services, runtime environments and organization policies.

If you are installing the platform, read [Deployment and connection checks](../deployment/). A reachable page confirms the interface is available; model calls, repository access and delivery need separate checks.
`,
  },
  {
    slug: "getting-started/deployment",
    section: "getting-started",
    title: "Deployment and connection checks",
    summary: "Check infrastructure, runtime environments, model access and Git before validating a complete business workflow.",
    readingOrder: 2,
    body: `
This page is for deployment and platform administrators. If you already have a Console address, continue to [Your first task](../first-task/).

## Prepare the environment

Use the installation instructions and image manifest shipped with your product version. Confirm the control plane, runtime environments, database, object storage and network prerequisites. A Kubernetes deployment also needs compatible sandbox controllers, RuntimeClass and network policy enforcement.

| Area | Confirm |
| --- | --- |
| Console and control plane | Sign-in address, organization setup, members and workspace access |
| Runtime environments | Available images, resource and network policies, actual environment creation |
| Model services | Gateway address, model catalog, credentials and protocol compatibility |
| Git services | Service address, personal authorization, repository and branch access |
| Persistence | Database, object storage and backup and recovery procedures |

The repository's local Helm installation entry is:

\`\`\`bash
FUSION_HELM_VALUES=/absolute/path/helm-private.yaml make deploy-local
\`\`\`

Use the values schema and image versions from your release. Protect the private values file and keep it out of version control. This entry does not prepare infrastructure or build images for you.

The developer entry \`make run-local\` currently also uses the Kubernetes coding driver. It does not provide a cluster-free process sandbox.

## Check models and runtime environments

1. During platform setup, configure the model gateway, then select the platform chat Agent model in its separate step. Check Embedding and Git services as well. Maintain them later in Settings.
2. Discover and add models, or enter them manually. Check protocol and default CLI compatibility; discovering a model does not save it to the catalog.
3. Members can optionally enter personal credentials during onboarding, or configure **Connections & access** later. Optional personal setup does not replace platform configuration.
4. Prepare a personal Sandbox and perform a real model call. Verify interface availability, runtime readiness and model success separately.

A model and an Agent Harness are separate choices. The gateway supplies model calls; the Harness manages sessions, tools and execution. Open integration does not mean every combination has been verified. Check the endpoints, models and adapter requirements available in your deployment.

## Check Git authorization

After an administrator configures the Git service, members authorize their accounts in **Connections & access**. Open **Tasks → Create task** and confirm that the repository and base branch can be listed.

If a repository is missing, check connector authorization, repository permissions and service connectivity. Entering a repository URL manually is not an authorization workaround.

## Check knowledge retrieval

Create a test document without sensitive information in **Knowledge**. Publish it, check indexing, then use retrieval testing to find a specific fact from the document. A saved draft is not a retrievable publication.

See [Publish and use a knowledge base](../../guides/knowledge-base/).

## Validate a business workflow

Check sign-in, a real model response, repository access, and a small task that produces reviewable changes or delivery results.

Record deployment health, page checks, automated tests and business results separately. See [Verification boundaries](../../operations/verification/).
`,
  },
  {
    slug: "getting-started/first-task",
    section: "getting-started",
    title: "Your first task",
    summary: "Open the creation drawer from Tasks, submit a small goal, and review progress, changes and actual delivery.",
    readingOrder: 3,
    body: `
Choose a small change that is easy to verify, such as adding input validation to an existing endpoint and running the relevant tests. Use a test repository and define the acceptance criteria.

## 1. Open task creation

Choose **SkyBot** in the top navigation, then **Tasks** in its sidebar and click **Create task**. The form opens in a drawer. You do not need to draw a workflow first.

Model and Git authorization should already be available. When authorization is missing, follow the form's explanation and connector link, then check again.

## 2. Describe the requirement

In **Task requirement**, state the goal, scope and acceptance criteria. For example:

> Reject empty names in the create endpoint. Preserve valid requests, add the relevant tests, and report changed files and test results.

Click **Add source** to attach knowledge bases, upload Markdown, or use issue and enterprise sources enabled and authorized in your deployment. Saved selections appear below the requirement.

## 3. Confirm the repository and flow

Check the **Task name**, then select the **Repository** and **Base branch**. These come from Git services authorized by the current member.

Keep the default intelligent orchestration for your first task. If you select a published flow, complete its required inputs.

This form does not provide a general task-level model selector. Models and execution endpoints come from the execution configuration and node capabilities; choosing a flow is not a model switch.

## 4. Review creation progress

Click **Create task** to enter task detail. Open **Progress** to follow requirement parsing, flow preparation, checks and freezing. Actual execution resources are prepared after preflight passes.

If creation stops, read the failed check, correct authorization or configuration, and use the available retry action. Repeatedly submitting the same task does not fix missing access.

## 5. Review execution evidence

Follow the Agent session and node progress. Open **Context** to check the original requirement.

Select a work node and open **Changes** to review that execution's code diff, or **Workspace** to inspect files at its frozen revision. Output files have their own reader; **Trace** helps diagnose execution.

The arrangement adapts to screen width. Check the same facts: which node is doing the work, which files or changes it produced, and whether validation passed.

## 6. Confirm delivery

Review the result summary, validation records and links that actually exist. When delivery includes a PR or MR, open it and review the target branch and diff.

An Agent's completion message does not replace validation. A completed task does not mean its changes have been merged or deployed.

Continue with [Observe execution and review results](../../guides/observe-execution/), or turn reusable methods into [employee experience](../../guides/digital-employees/).
`,
  },
];
