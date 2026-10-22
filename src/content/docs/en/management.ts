import type { DocPage } from "@/content/types";

export const managementEn: DocPage[] = [
  {
    slug: "management/usage",
    section: "management",
    title: "Review member usage and visibility",
    summary: "Review readable, recorded Runs, Tokens and model usage while respecting private Runs and controlled content access.",
    readingOrder: 2,
    body: `
Usage records explain which recorded executions consumed resources, not how much work an employee accomplished. Run counts are neither task counts nor measures of productivity or employee performance.

## Prerequisites and permissions

- This guide describes the current Console's team-management interface. Confirm that your deployment provides **Team → Member usage** and check the target workspace. Source-code support does not establish business acceptance in that deployment.
- The current **Team** navigation is for platform administrators. Workspace administrator status alone does not guarantee access to that navigation. Workspace access and Run reads still require server authorization; a platform operations role does not automatically grant team-governance access.
- Runs must already have been recorded by the observability pipeline. The page summarizes records that the current account can read and that the query returns, not every entry point, time period or employee activity.
- Reading aggregates does not require Prompt or Response content. Check [Roles and permissions](../../operations/roles/) first; do not widen content access just to inspect consumption.

## Steps

1. Sign in to your organization's Console and confirm that the workspace in the address is the one you intend to manage.
2. Open **Team** at the bottom of the sidebar, then **Overview**. The page heading is **Team dashboard**. Select **This week** or **Last 30 days** in the reporting-period control. The current “This week” implementation filters the last seven days, not a calendar week or monthly quota period.
3. Inspect members, Tokens and model distribution. Click **Export** if you need to retain this aggregate, and handle the CSV under company policy. Exporting does not expand data permissions or export raw conversation content.
4. Open **Member usage** in the team sidebar. Review members, task totals/succeeded/failed, Tokens, cost and frequent models. Attribution groups Runs by their Owner user identifier; the frequent model is determined by recorded Token consumption.
5. Record the workspace, operator, query time, page scope and any gaps. Member usage currently has no reporting-period selector equivalent to Overview's; do not treat the two pages as reports for an identical period. Continue to [Tokens and estimated costs](../costs/) for cost interpretation.

The Console route patterns are \`/w/{workspaceId}/settings?section=team-overview\` and \`/w/{workspaceId}/settings?section=team-members\`. Use them to check your organization's product address. They are not website documentation links and cannot bypass authorization.

## Interpret the results

| Displayed information | What it establishes | What it does not establish |
| --- | --- | --- |
| “Task” totals, succeeded and failed | Returned Run counts and their completed/failed statuses | Distinct Task counts, delivery quality or employee output |
| Tokens | Recorded input and output Tokens in readable Runs | Complete capture of every model call, or greater contribution from greater consumption |
| Frequent models and distribution | Models and Token distribution in these records | Every model a member may use, or the model a future execution will select |
| Cost | A USD estimate calculated from catalog prices | A provider invoice, complete spending or a promise of free usage |

No records can mean no activity, missing collection, records outside the query range, expired retention or insufficient visibility. It does not by itself mean “not using AI.” A loading or request failure is not evidence of zero usage either.

## Private Runs and content access

Private development-machine Runs with workload kind \`development_machine\` are readable only by their owner. Team-administrator status does not open another person's private Runs. Team pages are not a complete team-wide aggregate of all private development-machine activity.

Visibility of execution statistics does not grant Prompt/Response content access. Outside another person's private development-machine scope, content reveal requires an explicit request and an Owner or qualifying administrator permission check. Access must be audited; **if the audit fails, the read is denied**. Being authorized also does not guarantee content is still retained or available. Neither “administrators can read all private content” nor “administrators can never read content” is the rule.

This guide does not invent a “click a member to read every conversation” procedure. Diagnose consumption using Run identifiers, status, model and usage before requesting content, and do not bulk-copy content into management reports.

## Verification and troubleshooting

- **Entry and scope:** confirm the workspace. If the entry is missing or denied, ask the identity administrator to check roles and membership. Editing the URL is not an authorization workaround.
- **Attribution and counts:** choose an existing, readable Run with an Owner and check its member attribution. Align time, query scope and permissions before comparing totals. “Succeeded” confirms only execution status; validate delivery through [result review](../../guides/observe-execution/).
- **Empty values and failures:** distinguish loading, failed requests, valid empty results and missing data. If the page does not expose the uncertainty, ask authorized platform operations staff to inspect the records rather than inferring zero.
- **Privacy and auditing:** permission acceptance should confirm that administrator status does not open other members' private development-machine Runs. For failed content reads, check authorization, retention and audit availability separately. Do not disable auditing to restore access.

## Limits

Usage trends can support adoption and resource analysis. Linking them to business outcomes requires separate goals, delivery evidence and human acceptance; execution counts cannot replace those checks. Aggregates, exports and content reads neither expand existing permissions nor guarantee record coverage across every work entry point.
`,
  },
  {
    slug: "management/costs",
    section: "management",
    title: "Understand Tokens and estimated costs",
    summary: "Interpret member and model consumption, check complete, partial and unknown pricing states, and distinguish estimates from invoices.",
    readingOrder: 3,
    body: `
Tokens measure model usage. USD amounts are cost estimates based on recorded usage and catalog prices. Neither directly measures work value, and an estimate is not a provider invoice.

## Prerequisites and permissions

- Complete the identity and workspace checks in [Member usage and visibility](../usage/). The current **Team → Cost analysis** entry is for platform administrators; its data remains limited to readable, recorded Runs.
- Usage records and applicable model catalog prices are needed. Missing collection or pricing can make costs incomplete or unknown. Missing prices do not mean free usage.
- Cost review does not require Prompt/Response content. Any necessary content access still requires explicit reveal, authorization and auditing; a failed audit denies the read.
- This guide describes the current Console implementation. It does not establish that your deployment has validated model metering or reconciled provider invoices.

## Steps

1. In the target workspace, open **Team → Cost analysis**. Review member, task, Token, cost and share-of-cost columns in **Member costs**.
2. Read “Task” as the number of Runs attributed to that member's Owner identifier. Member cost is the sum of those records' estimated amounts. Its share is relative to the current member aggregate, not a share of a fully reconciled invoice.
3. Inspect **Cost in the last 7 days** separately. The current member table aggregates returned records, while the trend selects the last seven days by date. There is no unified date filter, so the displayed table total need not equal the sum of those seven days.
4. For model distribution, open **Team → Overview** and inspect **Model usage distribution**, or review model rows under **Models & quota**. Align record scope first. The model page's “Usage this period” is not automatically the UTC-month total used for quota admission.
5. For material differences, ask authorized platform operations staff to inspect the workspace, Run identifier, Owner, model identifier, start time, input/output Tokens, estimated amount, pricing state and missing-price information in the underlying records. The current summary tables do not expose all pricing states; this guide cannot promise a “click the amount to reconcile” workflow.

The cost-page Console route pattern is \`/w/{workspaceId}/settings?section=team-cost\`. To change admission rules, read [Model enablement and monthly quotas](../model-policies/). A cost page does not establish that budget blocking or alerts are enabled.

## Pricing states and Token accounting

| Pricing state | Meaning | How to use it |
| --- | --- | --- |
| \`complete\` | The record's usage is fully priced under the applicable catalog rates | Use for that record's estimated-cost analysis; it is still not a provider invoice |
| \`partial\` | Only some usage has prices; the known amount is retained | Record missing-price items alongside the amount; do not present the known subtotal as complete cost |
| \`unknown\` | The record's cost cannot currently be determined | Mark it unknown and check usage and pricing sources; do not treat it as zero dollars |

Input, output, reasoning, cache-read and cache-write Tokens can have different pricing buckets. The platform normalizes inclusion relationships so cache already included in input, or reasoning already included in output, is not counted twice. A single total multiplied by one rate need not equal a Run's estimate.

Prices and release versions can form a Run's pricing snapshot. A later catalog price is not a substitute for the historical snapshot. An unset or zero catalog rate does not mean the model is free. A displayed \`$0.00\` can also reflect unknown or partial pricing, or display precision.

## Verification and investigation

1. **Check a sample:** select existing, authorized Run samples, establish that usage is known, and compare estimates using their pricing snapshots and mutually exclusive Token buckets. If pricing is missing, validate only the known portion and retain the \`partial\`/\`unknown\` state.
2. **Check attribution:** align workspace, Owner, model and time range before comparing totals. Member tables and all-Run aggregates can also differ because of membership lists or missing ownership. Do not arbitrarily assign unattributed amounts to a person.
3. **Check invoices separately:** follow your finance process to reconcile provider invoices, discounts, contracts, taxes and other charges. A Console estimate does not establish invoice reconciliation.
4. **Handle gaps:** if Tokens exist without cost, check price coverage and usage state. For amount differences, check buckets, snapshots, model identifiers, time and record completeness. Report failed loading or collection as a gap, not as savings.

## Limits

Costs cover only the readable, recorded Runs and known priced portions in scope. Private \`development_machine\` Runs remain owner-only. Summary tables and CSV exports do not fully express estimation coverage and cannot be treated as the enterprise's complete bill.

Monthly cost quotas use recorded estimates for Task-creation admission. They are not real-time debits or provider-enforced hard budgets. There is insufficient evidence for a unified cost-threshold alert tutorial; this guide promises neither automatic notifications, real-time circuit breaking nor a fixed savings percentage.
`,
  },
  {
    slug: "management/model-policies",
    section: "management",
    title: "Set model enablement and monthly quotas",
    summary: "Configure workspace model enablement, UTC-month Token and estimated-cost limits, and verify Task-creation admission boundaries.",
    readingOrder: 4,
    body: `
Model policies constrain **Task-creation admission** where the policy check is integrated. They are not a shared hard budget across all conversations, automations and collaboration entry points, or a real-time circuit breaker for running work.

## Prerequisites and permissions

- Confirm that the deployment provides **Team → Models & quota** and that the workspace has an available model catalog. Gateways, published models and credentials belong to [Platform configuration and personal access](../../operations/configuration/); a quota does not configure them.
- Current Team navigation is for platform administrators. Inline editing additionally requires the current user to have \`workspace_admin\` membership in the target workspace's member list. The server still checks workspace-management rights on save; seeing a page does not establish permission to save.
- Prepare the gateway, logical model name, enabled state, monthly Token limit and estimated USD cost limit. Read [cost states and limitations](../costs/) first so missing prices or records are not mistaken for complete costs.
- Validation affects new Tasks. Obtain internal approval and use existing records or small, cost-controlled tests in a test workspace. Do not generate large Token volumes just to reach a quota.

## Steps

1. Sign in, confirm the target workspace and open **Team → Models & quota**. Find the model in **Workspace model catalog**.
2. Check the gateway below the logical model name and the provider. Policies identify a model by “gateway identifier:logical model name”; a similar display name is not enough to identify the row.
3. Enter **Monthly Token quota** and **Monthly cost quota**. Use a non-negative integer for Tokens and a non-negative USD amount for cost. **0 means unlimited for either field, not prohibited usage.**
4. Set the checkbox under **Access policy**. A checked box displays **Allow**; clearing it displays **Disable**. To deny new Task admission for that model, disable it rather than setting a zero quota.
5. Click that row's **Save**. If **Revision changed. Refresh** appears, reload, review the latest policy and then edit again. For other save failures, inspect the error and service state as well; do not assume success or blindly overwrite another administrator's change.
6. Reload and confirm the enabled state and both limits remain as intended. Unsaved inputs do not change policy.

The Console route pattern is \`/w/{workspaceId}/settings?section=team-models\`. Follow the existing [Create a task](../../guides/create-a-task/) guide for Task operations. Its form has no generic task-level model selector, so establish which model the execution configuration actually resolves before validating policy.

## How admission works

- **Enablement:** Task creation checks the policy matching the resolved gateway and model. A matching disabled model is rejected. No matching policy does not itself mean usage is prohibited.
- **Month:** quotas accumulate recorded Runs by their start time in the **UTC calendar month**, not the local calendar month, last 30 days or Overview's last seven days.
- **Tokens and cost:** the check totals matching input plus output Tokens and estimated USD cost. If a non-zero limit has already been reached, a new Task using that model is rejected. Either limit can cause rejection.
- **Model attribution:** the policy key includes the gateway, but usage accumulation currently matches \`ModelID\`. Identical model identifiers across gateways are not guaranteed independently accounted gateway budgets.
- **Dependency failures:** unavailable policy or required usage queries deny admission instead of allowing it. Restore dependencies or authorization before retrying; repeated creation is not a workaround.

The page's “Usage this period” comes from its returned Run records and is not established as UTC-month-filtered. Do not use it as a remaining-quota balance. Costs are estimates; missing usage or pricing affects the completeness of quota decisions.

## Verification

1. **Persistence:** reload and confirm workspace, row, state and limits. A successful save establishes that configuration was accepted, not that every execution entry point enforces it.
2. **Disabled model:** in an approved test workspace, disable a model that the Task configuration is known to resolve. Create a small test Task and confirm rejection due to model disablement. If creation succeeds, first inspect the actual resolved model and policy key rather than concluding that all policies fail.
3. **Quota:** use existing Runs with known models and months. Set a test limit at or below recorded UTC-month usage and confirm the corresponding Token- or cost-quota rejection for a new Task. Check pricing states for cost samples; incomplete prices cannot prove a hard budget. Do not “burn through” a quota with repeated real calls.
4. **Restore:** restore the original state and limits and reload to confirm. If positive-path creation needs verification, use a minimal authorized test Task. Record environment, role, policy, resolved model, month definition and rejection reason.

## Limits and common mistakes

This is an admission-time check against recorded usage. It **does not reserve quota for a new Task or terminate an already running Task in real time**. Concurrent creation, a large execution and telemetry delay can cause final usage to exceed a limit. It cannot promise that the provider bill will never exceed a budget.

Do not extend this Task admission point to claim identical budget protection for every Chat, Automation Run, MCP or other entry point. Automatic role collaboration is currently assembled with \`BudgetNone\`; the existence of a lower-level \`BudgetHard\` type does not establish enabled hard-budget enforcement. Disabling a model does not revoke credentials, delete historical Runs or recover incurred costs.

There is insufficient evidence for unified budget alerts or real-time circuit-breaking controls, so this guide invents no alert switch. Record saved configuration, admission verification and business acceptance separately; see [Verification boundaries](../../operations/verification/).
`,
  },
];
