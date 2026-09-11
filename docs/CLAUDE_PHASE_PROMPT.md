# Reusable Claude Code Phase Prompt

Copy the prompt below, replace the bracketed values and use it for one phase only.

```text
Implement Phase [NUMBER AND NAME] from docs/PHASED_BUILD_PLAN.md.

Before changing files:
1. Read the root CLAUDE.md and every Markdown file in docs/.
2. Inspect the current repository, migrations, tests and uncommitted changes.
3. Summarise the proposed approach, files likely to change, migrations, risks and the acceptance tests that apply.
4. Flag any conflict, missing dependency or decision that would change the requested scope. Do not invent product rules.

Scope for this task:
[PASTE THE PHASE SCOPE]

Required acceptance tests:
[LIST TEST IDS FROM docs/ACCEPTANCE_TESTS.md]

Implementation rules:
- Work only on this phase. Do not add user-facing features from later phases.
- Preserve all invariants in CLAUDE.md.
- Implement database constraints and server-side domain logic before the minimum UI needed to exercise them.
- Enforce permissions on the server for every read and mutation.
- Route status changes through explicit workflow transitions; do not update status fields directly.
- Add the required audit events and idempotent notification outbox entries with each domain change.
- Use concurrency-safe transactions where the data model requires them.
- Preserve existing user changes and do not rewrite unrelated code.
- Add or update automated unit, integration and end-to-end tests in proportion to the phase.
- Update documentation and add an architecture decision if implementation requires a material change.

Verification:
- Run formatting, linting and type checks.
- Run the focused tests for this phase.
- Run the relevant regression suite.
- Fix failures caused by this work. Do not weaken tests or business rules to make them pass.

When complete, report:
- Outcome and whether the phase exit criteria are met
- Files changed
- Database migrations and constraints
- Permissions and business rules implemented
- Audit and notification behaviour
- Tests added and exact checks run
- Known limitations or unresolved risks
- Recommended next phase

If the phase is incomplete, say so plainly and list what remains. Do not claim completion because a UI path appears to work.
```

## First-use prompt

For a new repository, start with Phase 0. Then use a fresh task for Phase 1. Avoid combining setup, the complete data model and the viewer in one request.
