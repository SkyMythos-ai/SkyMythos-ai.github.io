import type { DocPage } from "@/content/types";

export const guidesEn: DocPage[] = [
  {
    slug: "guides/create-a-task",
    section: "guides",
    title: "Create a task",
    summary: "Complete the actual creation drawer: requirement, sources, repository and flow, with authorization checks.",
    readingOrder: 1,
    body: `
In **Fusion Bot**, choose **Tasks** in the sidebar and click **Create task**. The drawer is organized around the requirement, task and repository, and Flow.

## Describe the work

State the goal, behavior to preserve and acceptance criteria. The task name identifies the record; **Task requirement** contains the work itself.

Keep the scope reviewable. Replace “improve all endpoints” with “reject empty names in the create endpoint and run the relevant tests.”

## Attach sources

Click **Add source**, select a source type in the dialog, then save your selections.

| Source | Action | Check |
| --- | --- | --- |
| Knowledge | Find and select accessible knowledge bases | Names and access scope |
| Markdown | Upload one or more .md files | The correct requirement version |
| Git issue | Add a link from an authorized Git service | The returned issue title |
| Enterprise document or message | Use an enabled source entry | Authorization and successful content reading |

Saved sources appear below the requirement and can be removed individually. Sources marked as not connected cannot be used for real work. Adding a link does not itself prove that remote content has been read.

## Select repository and branch

The repository catalog comes from your authorized Git connectors. Select a repository, then its base branch; you do not need to enter a clone URL.

If the repository is missing, check personal authorization in **Connections & access**, confirm repository permissions, then refresh. An empty catalog and a failed branch query are different conditions; follow the specific message.

## Choose a flow

**Intelligent orchestration** matches available flows before adapting or generating one for the task. To reuse a fixed method, choose a published flow and complete the inputs it exposes.

Task creation has no general model selector. Review the relevant execution configuration and node capabilities when changing models or Harnesses. Choosing a different flow does not establish which endpoint will run.

## Check before submitting

Confirm the requirement, sources, name, repository, branch and required flow inputs. If the form reports missing model or Git authorization, follow its connector link, complete authorization and use **Check again**.

Successful creation opens task detail. If preflight fails, read the phase and reason. Runtime resources are prepared after checks pass.

For a complete walkthrough, see [Your first task](../../getting-started/first-task/).
`,
  },
  {
    slug: "guides/observe-execution",
    section: "guides",
    title: "Observe execution and review results",
    summary: "Use Progress, Context, Changes, Workspace and Trace to inspect evidence from a task.",
    readingOrder: 2,
    body: `
Open a task from **Tasks**. Check its status and current node, then choose whether to read the session, verify inputs or review results.

![Task detail and node execution](/images/product/task-detail.png)

## Start with Progress and Context

**Progress** shows creation and work nodes. Dependencies explain which nodes can run in parallel and which must wait. When selecting a node, make sure the session and evidence belong to the same execution attempt.

Use **Context** to review the requirement, sources and execution inputs. If the result misses the goal, check the frozen requirement before relying on the final response.

## Open the evidence you need

| Question | Entry |
| --- | --- |
| What is the Agent doing now? | Session, node progress and input requests |
| What code changed in this execution? | Changes |
| What were this node's complete files? | Workspace at its frozen revision |
| What did the node hand to its downstream consumer? | Output-file entry supplied by the node |
| Where did a tool call or execution fail? | Trace, then Observe if needed |
| Was a PR or MR actually created? | Actual delivery link in the task header |

Check the path, content identity and owning execution when opening a file. An intermediate node's frozen revision and the final task branch represent different points in time.

## Review delivery

1. Read the result summary and check that it addresses the goal.
2. Open Changes and review the scope and key differences.
3. Check actual test, build or gate results.
4. Open the PR or MR and confirm its repository, target branch and contents.
5. Use your existing code-review process to decide whether to merge.

Completion records the platform's execution conditions. It does not mean you have reviewed the work or deployed it.

## Connection and execution status

If the live connection drops, distinguish a browser connection problem from task failure. Catching up historical messages should not change an established terminal state.

Answer an input request from the current question card. To change direction or execute a node again, see [Handle failures and resume](../handle-failures/).
`,
  },
  {
    slug: "guides/handle-failures",
    section: "guides",
    title: "Handle failures and resume",
    summary: "Separate creation failures, input requests and execution failures. Review the starting point and effects before Fusion Resume.",
    readingOrder: 3,
    body: `
Locate where the task stopped. Missing authorization, a request for your answer and failed execution need different actions.

## Creation failed

Open creation checks in **Progress** and read the phase and reason. A useful sequence is:

1. Check the current member's Git and model authorization in **Connections & access**.
2. Confirm repository and base-branch access.
3. Check the selected flow release, required inputs and capability visibility.
4. Ask an administrator to confirm model services and runtime configuration.

After correction, use the creation retry action. If preflight has not passed, there is no running Agent process to diagnose yet.

## Waiting for your answer

Reply from the current node's question card. Check which node and execution own the question. Do not answer an obsolete question after its execution has been replaced.

Messages sent during execution may be queued. Queued, delivered and processed are separate states; use the actual receipt.

## Continue from an explicit node

When a task exposes recovery and its runtime conditions permit it, open **Fusion Resume**.

1. Choose a work node that has already started.
2. Review affected downstream nodes. Completed independent branches can reuse their results.
3. Add optional **Correction notes** or a Markdown file explaining the revision.
4. If a PR or MR already exists, review external side effects and provide the required confirmation.
5. Create the new execution attempt and observe its progress.

Resume creates a new execution generation and retains earlier attempts, artifacts and evidence. It does not erase a failure or automatically reverse an external action.

## Automatic repair and manual recovery

Within configured limits, the runner can retry temporary model failures or let the Agent repair failed checks. Rework for a defective upstream handoff creates a new execution and artifact version.

A gateway fault is not business rework. An Agent's “fixed” response does not replace test results.

## When to create a new task

If requirements, the repository baseline, flow or execution configuration must be selected again, use the rebuild action in Tasks. Review the prefilled inputs and create a new task. It checks current permissions and configuration while preserving the old task.

After a runtime instance is deleted, a complete, verifiable logical runtime snapshot in a ready state can support a new runtime generation for the same task. Recovery rechecks current authorization, credentials, runtime and the frozen toolchain. This differs from Fusion Resume within an existing environment. Without a valid snapshot, create a new task as conditions require.
`,
  },
  {
    slug: "guides/flows-and-marketplace",
    section: "guides",
    title: "Reuse roles, flows and capabilities",
    summary: "Find roles, Skills, MCP tools and flows, and distinguish versions, credentials and employee identity.",
    readingOrder: 4,
    body: `
Open **Marketplace** and choose the type of asset you need. Roles, Skills, MCP, flows and environments have separate configurations and usage contracts.

## Choose the object to reuse

| Object | What you reuse | Review first |
| --- | --- | --- |
| Agent role | Responsibilities, methods and execution configuration | Release, endpoint, model and dependencies |
| Skill | Methods, instructions and supporting files | Content, source, version and scope |
| MCP | An external tool capability | Connection, authorization and access scope |
| Flow template | Nodes, dependencies, inputs, outputs and checks | Version, input contract and required capabilities |
| Environment | Runtime image and tool composition | Requirements and deployment availability |

## Read a role's execution configuration

Open the Agent role detail and review responsibilities, role configuration, source and validation, and version history. Execution configuration identifies the endpoint and model. A brand name cannot stand in for both.

For a new Agent session in **Fusion Bot → Chat**, the input area offers separate execution-tool and compatible-model choices. The execution tool is fixed after session creation; later model selection remains subject to compatibility and authorization. This is a separate entry from a role's configuration.

![Execution tool and model selection in an Agent session](/images/product/agent-setup.png)

A gateway provides model calls; a Harness manages sessions and tool execution. Models such as Claude, Kimi, GLM, DeepSeek and Grok occupy a different layer from tools such as Claude Code, Codex and Kimi Code. Available choices depend on your deployment's catalog, adapters and authorization. Example names do not establish a compatibility matrix.

A published role can join a session. Choose **Hire employee** for an independent identity and continuing experience. See [Train and hire digital employees](../digital-employees/).

## Use skills and tools

Review the asset content, source and fixed release. An accessible capability may still require your personal authorization to its external service. Shared role or workspace configuration does not supply your private credentials.

Skills may come from Git, uploaded packages or platform-owned content. Their source determines how they are maintained. A draft or floating Git path is not the same as a fixed release.

## Reuse a flow

Use **Flow Template** or the Marketplace flow category to review published flows. Select a flow when creating a task and complete its inputs to reuse the method without copying an entire historical task.

When maintainers publish a new version, existing tasks retain the version and evidence resolved at creation. Create a new task when you need new configuration; publication does not rewrite running work.
`,
  },
  {
    slug: "guides/digital-employees",
    section: "guides",
    title: "Train and hire digital employees",
    summary: "Train from everyday work or hire a published role, then inspect work records, memory and experience.",
    readingOrder: 5,
    body: `
Choose **Fusion Bot** in the top navigation, then **Staff** in its sidebar. The directory brings identity, responsibilities, role version and current status together so you can see who is ready for more work.

![Employee directory and training entry](/images/product/employees.png)

## Train from your work

1. Accumulate accessible sources through everyday conversations, tasks and collaboration.
2. In **My employees**, click **Train from experience**.
3. Enter a **Training goal**, such as developing a release-review employee from release-check experience.
4. Click **Start training** and review progress, source coverage, outputs and gaps.
5. Add sources or validation as requested, then use the outputs that have actually completed.

Training runs asynchronously; returning to Chat does not stop it. Waiting for sources, awaiting validation, partial completion and completion have different meanings. An accepted request is not a ready employee.

## Hire from Agent Hub

Click **Hire from Agent Hub** in Staff, or open a published role from **Marketplace → Agent Hub**.

1. Read responsibilities, methods, execution configuration and version.
2. Click **Hire employee**.
3. Confirm the fixed role version, optionally name your employee, and confirm hiring.
4. Open employee detail and check readiness and dependency preparation.

The role is a reusable definition. Hiring creates an employee identity belonging to the current member. A later role release does not silently replace the employee's pinned version.

## Delegate the next job

When an employee is ready, click **Start collaborating** in its detail. The new session is bound to that employee. State the new goal and review the result.

If the button is disabled, read the status and dependency reasons. Appearing in the directory does not establish that models, endpoints and tool authorization are ready.

## Review accumulated experience

**Work record** shows participated work and links to available results.

**Memory and experience** separates your instructions from learned experience. Filter by scope and status, then inspect sources, content and validation. Use **Correct** for inaccurate experience and **Exclude** for experience that should no longer apply. Associated Skills have a separate entry.

Employee experience is separate from shared knowledge. Complete chat history does not automatically become long-term memory. Put documents the team should maintain, publish and share in a [knowledge base](../knowledge-base/).
`,
  },
  {
    slug: "guides/knowledge-base",
    section: "guides",
    title: "Publish and use a knowledge base",
    summary: "Create a knowledge base, publish document drafts, check indexing and retrieval, and use authorized knowledge in work.",
    readingOrder: 6,
    body: `
Choose **Knowledge** in the top navigation. Browse My knowledge, Workspace knowledge, Shared with me or Organization public. Actual access permissions determine what you can read.

![Knowledge base and document directory](/images/product/knowledge.png)

## 1. Choose the access scope

With maintenance permission, click **New knowledge base**, enter a name and summary, then select visibility. Start with personal material and grant or share access as collaboration requires.

Use a name that explains the purpose, such as “Release review handbook.”

## 2. Create or import documents

Open the base and use its directory actions to create or upload documents. State facts, methods, applicability and sources clearly. Follow the source-specific maintenance method for externally synchronized documents.

Save edits as a draft. Unpublished changes do not replace the formal version available to shared readers.

## 3. Publish a document

In document detail, choose **Release new version**, confirm the content, and check parsing and indexing status.

Documents publish independently. There is no single knowledge-base release covering all documents. Expect retrieval only when a document has an effective, available version.

## 4. Test retrieval

Choose **Test retrieval** in the base and ask a specific question the document should answer. Inspect matched documents, excerpts and sources, rather than judging only whether a response sounds fluent.

If there is no match, check publication, indexing, access and query relevance. **Version record**, **Retrieved snippets** and **Sources and Properties** help diagnose the result.

## 5. Use it in work

When creating a task, choose authorized material through **Add source → Knowledge**. Runtime reads still respect current access; selecting a base once does not grant permanent access.

After editing, check the new publication and index results. Restoring a historical version creates a new draft; it does not erase history or publish automatically.

Knowledge bases hold shared documents. Maintain personal preferences, employee instructions and learned experience through [employee memory and experience](../digital-employees/).
`,
  },
];
