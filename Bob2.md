## What to Expect in Bob 2.0


### Modes

Bob 2.0 folds the five old modes into three:

| Mode | What Bob does |
| --- | --- |
| **Agent** | Takes action and completes the task, with full agentic capabilities. |
| **Plan** | Works through an opinionated planning process — gathering requirements, discovering context, checking its understanding — and produces an actionable plan to hand to Agent. |
| **Ask** | Read-only. Explains architecture and logic without touching the codebase. |

### Auto Approval and Control

Approval behavior was part of the normal interaction flow.	Auto-approval (under Permissions) can pre-authorize certain actions so Bob can perform approved operations without asking every time.

Read operations — reading files, listing directories, searching code — are approved by default, so Bob can gather context without stopping to ask. Anything that changes state still requires explicit approval: File edits, Command execution, MCP tool calls, Skill invocations.
