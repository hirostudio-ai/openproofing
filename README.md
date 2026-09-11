# OpenProofing Claude Code Starter Pack

This pack is the source of truth for building OpenProofing with Claude Code. OpenProofing is an open-source, self-hosted artwork review, annotation, version-control and approval platform.

OpenProofing is the permanent project and internal system name. Each installation can present its own platform name, branding and domain through white-label configuration.

The product must make reviewing artwork simple while giving Account Managers firm control, traceability and a defensible approval record.

## How to use this pack

1. Copy the contents of this pack into the root of a new repository. Keep `CLAUDE.md` at the repository root and the specification files in `docs/`.
2. Create the application repository and initialise the agreed stack.
3. Start Claude Code from the repository root so it loads `CLAUDE.md` as project instructions.
4. Ask Claude Code to inspect `docs/` and report conflicts or missing decisions before implementation.
5. Work through `docs/PHASED_BUILD_PLAN.md` one phase at a time.
6. Use `docs/CLAUDE_PHASE_PROMPT.md` for each phase.
7. Require the acceptance tests for a phase to pass before starting the next phase.
8. Record any material architecture change as a new decision in `docs/ARCHITECTURE_DECISIONS.md`.

Do not ask Claude Code to build the whole platform in one task. The workflow and audit rules are more important than visual polish during the early phases.

## Document order

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Persistent project instructions Claude Code loads from the repository root |
| `docs/PRODUCT_BRIEF.md` | Product goals, users, scope and journeys |
| `docs/TECHNICAL_FOUNDATION.md` | Technical constraints and platform services |
| `docs/ARCHITECTURE_DECISIONS.md` | Agreed choices and their consequences |
| `docs/DATA_MODEL.md` | Entities, relationships, constraints and indexes |
| `docs/WORKFLOW_STATE_MACHINE.md` | Explicit workflow states, transitions and guards |
| `docs/PHASED_BUILD_PLAN.md` | Safe build order and phase exit criteria |
| `docs/ACCEPTANCE_TESTS.md` | End-to-end and business-rule test catalogue |
| `docs/CLAUDE_PHASE_PROMPT.md` | Reusable prompt for each implementation phase |

## Suggested stack

- Next.js with TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Auth.js or Supabase Auth, with email invitation and magic-link login
- Private S3-compatible object storage or Supabase Storage
- PDF.js for document rendering
- Resend or an equivalent email provider
- A background job queue for rendering, email and exports
- Vitest or Jest for unit and integration tests
- Playwright for end-to-end tests

## Project identity

- Project name: **OpenProofing**
- Repository: `openproofing`
- Suggested container image: `openproofing/openproofing`
- Description: **Open-source, self-hosted artwork review and approval**
- Licence: choose and add an OSI-approved licence before accepting external contributions

Keep `OpenProofing` in source packages, database migrations, environment-variable prefixes, technical documentation and upgrade tooling. White-label settings control the identity shown to end users; they must not rename internal identifiers.

Equivalent components may be substituted only when the change is recorded as an architecture decision and preserves every rule in `CLAUDE.md`.

## Initial repository shape

```text
app/
components/
lib/
  auth/
  domain/
  storage/
  workflow/
prisma/
tests/
  integration/
  e2e/
docs/
```

## Definition of ready

Before Phase 1 starts:

- The repository exists and has version control enabled.
- All documents in this pack are present under `docs/`.
- Local development, test and production environments are defined.
- Secrets will be supplied through environment variables and will not be committed.
- Claude Code has reported any conflicts or unanswered decisions.

## Definition of done

A phase is complete only when its migrations, server-side permissions, domain rules, audit events and automated tests are complete; the relevant test suites pass; documentation matches the code; and known limitations are recorded.
