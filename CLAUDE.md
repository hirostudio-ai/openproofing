# OpenProofing Claude Code Instructions

These are the persistent project instructions for Claude Code. Read the full specification in `docs/` before planning or changing code. If a request conflicts with these rules, stop and report the conflict rather than weakening the rule.

## Working context

- Project: OpenProofing
- Purpose: open-source, self-hosted artwork review and approval
- Source of truth: this file and the Markdown files in `docs/`
- Build order: `docs/PHASED_BUILD_PLAN.md`
- Test catalogue: `docs/ACCEPTANCE_TESTS.md`
- Reusable task prompt: `docs/CLAUDE_PHASE_PROMPT.md`

When project commands have been established, keep the verified install, development, migration, formatting, lint, type-check and test commands documented in the repository README. Do not guess commands when the package configuration can be inspected.

## Delivery rules

1. Work on one phase from `PHASED_BUILD_PLAN.md` at a time.
2. Inspect the existing code and report the intended approach before editing.
3. Do not add features assigned to later phases unless they are necessary foundations with no user-facing behaviour.
4. Put business rules in tested server-side domain or service code. Hiding a button is not authorisation.
5. Make schema changes through reviewed migrations. Do not edit production data by hand.
6. Record a new architecture decision when changing a material choice.
7. Keep documentation and tests aligned with implemented behaviour.
8. Never commit secrets, private file URLs or real client artwork.
9. Keep `OpenProofing` as the internal project identity. Apply the configured white-label identity only through presentation and outbound-message services.

## Data integrity rules

1. A proof upload always creates a new `ProofVersion`. It never replaces a file.
2. Proof version number allocation is server-side and concurrency safe.
3. A proof version's file key, hash, version number and artwork relationship are immutable.
4. A review round references exactly one proof version.
5. A round uses a snapshot of its workflow, stages, assigned reviewers, order and rules.
6. Closing a review round makes its submitted annotations, comments, checklist answers, decisions and timestamps immutable.
7. Historic records are not recalculated from current workflow settings or current user names.
8. Audit events are append only. Corrections create new events.
9. Final approval references the approved proof version and its stored hash.
10. The final high-resolution file is a separate record. It must never overwrite or masquerade as the approved proof.

## Workflow rules

1. Every state change uses an explicit transition with a named actor, guard and audit event.
2. A reviewer can submit only when their assignment is `AVAILABLE` or `IN_PROGRESS`.
3. In a sequential stage, later reviewers remain locked until preceding required reviewers complete or are formally skipped.
4. A skipped or replaced reviewer requires an Account Manager, a reason, a timestamp and an audit event.
5. A reviewer submits exactly one outcome: `NO_CHANGES_REQUIRED` or `CHANGES_REQUIRED`.
6. Required changes must be represented as actionable feedback. Do not implement `APPROVED_WITH_COMMENTS`.
7. Submitted reviews freeze. Extra feedback needs a new review round.
8. The Account Manager owns conflict resolution and the consolidated instruction sent to the agency.
9. All required agency actions must be resolved before the next proof can be uploaded.
10. Only an Account Manager can provide final proof sign-off in MVP.
11. Replacing any approved artwork creates a new version and restarts approval.

## Annotation rules

1. Store annotations against a proof version and page.
2. Store geometry as normalised coordinates relative to the rendered page, not screen pixels.
3. Validate all coordinates server-side and keep them within bounds.
4. Preserve annotation location across zoom, resize, different screens and mobile layouts.
5. Comments and replies inherit access from the project and proof; they do not grant access themselves.

## Security rules

1. Files remain private and are delivered through short-lived signed URLs after an access check.
2. Every query and mutation is scoped to an authorised project membership.
3. Validate upload type, size and content; use generated storage keys rather than user filenames.
4. Store timestamps in UTC and display them in the user's chosen or project time zone.
5. Rate-limit authentication, invitations, comments, uploads and signed-URL creation.
6. Log final-file downloads and other sensitive actions.
7. Do not expose sequential identifiers or storage paths as proof of authorisation.
8. Apply least privilege to background workers and external services.
9. Validate custom domains before activation and never derive tenant access solely from an untrusted host header.

## White-label rules

1. White-label settings belong to an installation, not individual projects, in the MVP.
2. Support a display name, logos, favicon, colour tokens, custom domain, email sender name, email branding, support contact, login content, footer links and `Powered by OpenProofing` visibility.
3. Provide safe OpenProofing defaults when settings or assets are absent.
4. Validate colours, URLs, domains and uploaded brand assets. Do not allow arbitrary HTML, CSS or scripts.
5. Custom domains require explicit ownership verification, canonical-host configuration and TLS before activation.
6. Email sender addresses require provider-level domain verification; changing a label alone must not spoof a domain.
7. Branding changes affect presentation only. They must not rename packages, migrations, environment variables, audit action names or storage namespaces.

## Quality rules

1. Test invariants at the database and service layers where possible.
2. Test permissions with positive and negative cases.
3. Test workflow transitions and rejected transitions.
4. Test concurrency for version numbering and workflow advancement.
5. Test responsive annotation placement on at least desktop and mobile viewport sizes.
6. Include accessibility checks for keyboard use, focus, labels, contrast and zoom.
7. Run relevant unit, integration and end-to-end tests before declaring a phase complete.
8. Report files changed, migrations, tests added, tests run, known limitations and the next phase.
