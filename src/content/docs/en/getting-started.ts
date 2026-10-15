import type { DocPage } from "@/content/types";

export const gettingStartedEn: DocPage[] = [
  {
    slug: "getting-started/overview",
    section: "getting-started",
    title: "Start in the workbench",
    summary: "Find Chat, Staff, Tasks and Knowledge in the console, then choose your first workflow.",
    readingOrder: 1,
    body: `
Sign in to your organization's Console and open **Chat** in your workspace. The **Fusion Bot** area has **Chat, Tasks and Staff** in its sidebar. **Knowledge** and **Marketplace** have separate top-navigation entries. Personal authorization is under **Connections & access** at the bottom of the sidebar.

![Chat workbench](/images/product/chat-workbench.png)

## Find the right entry

| Your goal | Console entry | What to review |
| --- | --- | --- |
| Discuss a goal or begin everyday work | Chat | Responses, tool activity and work results |
| Develop an employee from experience or hire a role | Staff | Readiness, work records, memory and experience |
| Complete a defined engineering goal in a repository | Tasks → Create task | Creation progress, execution, changes and delivery links |
| Maintain evidence the team can reuse | Knowledge | Published documents, indexing and retrieval results |
| Find reusable roles, skills or tools | Marketplace | Asset versions, configuration and available actions |
| Authorize Git, models or external tools | Connections & access | Your account's authorization status |

An employee is a continuing collaboration identity. A task records one execution with defined inputs and results. A knowledge base contains documents with publication, access and retrieval controls.

## Your first session

1. Open **Chat** and describe a small goal, such as “Turn these release notes into a review checklist.”
2. Follow any prompts to prepare an execution environment or complete authorization.
3. Review what was actually produced and what still needs your confirmation.
4. Open **Staff** when experience becomes reusable, or **Tasks** when you need a repository change.

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

1. As an administrator, review **LLM gateway** and **Runtime environment** under **Platform administration** in the account menu.
2. Confirm that required models are listed and compatible with the execution endpoint's protocol.
3. As a member, open **Connections & access** and complete the model or tool authorization your account needs.
4. Return to Chat, prepare the environment when prompted, and perform a real model call.

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

Choose **Fusion Bot** in the top navigation, then **Tasks** in its sidebar and click **Create task**. The form opens in a drawer. You do not need to draw a workflow first.

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
