# Phased Build Plan

Build and release one phase at a time. Domain logic, permissions and tests come before polished screens.

## Phase 0 Repository and delivery foundation

Set up Next.js, TypeScript, formatting, linting, test runners, environment validation, CI, local PostgreSQL and private-storage adapters. Add health checks, structured logging and the initial documentation.

Establish the OpenProofing repository, package and environment-variable naming. Add container-based local and production deployment foundations suitable for self-hosting.

**Exit:** A clean checkout can be configured, migrated, tested and run from documented commands. CI blocks type, lint and test failures.

## Phase 1 Core domain and database

Implement organisations, users, clients, projects, project memberships, artwork, proof versions, flows, stages, reviewers, rounds, assignments and audit events. Add constraints, indexes and seed fixtures.

**Exit:** Migrations and service tests prove project-scoped access, unique concurrency-safe version numbers, workflow snapshots and append-only audit creation.

## Phase 2 Authentication, invitations and permissions

Implement invitation-led authentication, magic links if supported, invite expiry, acceptance and centralised project policy checks. Add minimal membership administration for Account Managers.

**Exit:** Positive and negative permission tests pass for every role. A user with access to Project A cannot enumerate or access Project B.

## Phase 3 Secure proof upload and rendering

Implement private PDF, JPG and PNG upload intents, validation, hashes, version allocation, page metadata, thumbnails, previews and render failure handling.

**Exit:** Every successful upload creates an immutable version; invalid files stay unavailable; duplicate concurrent uploads cannot receive the same version number.

## Phase 4 Artwork viewer

Build page thumbnails, page navigation, zoom, pan, fit-to-screen, responsive layout and the annotation overlay coordinate system.

**Exit:** The same stored test marker remains aligned across browser resize, zoom, desktop and mobile viewports.

## Phase 5 Annotations and threaded feedback

Add pin, box, arrow and highlight tools, comments, replies, comment navigation and permission checks. Tie every item to the round, version and page.

**Exit:** Authorised reviewers can collaborate on the active round, unauthorised users cannot read or write, and choosing a comment locates its annotation.

## Phase 6 Review submission and checklist

Implement configurable checklists, assignment availability, decisions, completion timestamps, feedback freeze, reviewer progress and optional deadlines.

**Exit:** Reviewers cannot act out of turn; submission is idempotent; closed evidence cannot be altered; deadlines disappear when disabled.

## Phase 7 Workflow engine and Account Manager control

Implement sequential progression, domain support for parallel stages, skips, replacement, consolidated feedback, conflict resolution, offline outcomes and round closure.

**Exit:** A three-reviewer flow progresses correctly, skip and replacement evidence remains visible, and Account Manager actions are fully audited.

## Phase 8 Agency amendment workflow

Build the changes-to-make list, feedback PDF export, statuses, action-taken notes, deep links to annotations and new-version gate.

**Exit:** An agency user cannot upload a new proof while a required action is open. Export content matches the frozen feedback set.

## Phase 9 Repeat flow and version comparison

On a new upload, create the next immutable proof, a fresh round and snapshot assignments. Build version timeline and side-by-side comparison with previous/current feedback toggles.

**Exit:** V1 remains unchanged after V2, the new round uses the intended flow, and comparison displays correct pages and annotations.

## Phase 10 Final approval and high-resolution delivery

Implement Account Manager proof approval, approval evidence, final-file request, separate upload, confirmation, controlled download and download audit.

**Exit:** Approval is tied to the exact proof hash, the proof stays locked, reviewers cannot retrieve high-resolution files early, and every authorised download is recorded.

## Phase 11 Notifications and reminders

Implement the transactional outbox, email templates, direct links, delivery retries, preferences and configurable due-soon and overdue schedules.

**Exit:** Domain operations succeed when email is unavailable; retries do not duplicate logical notifications; disabled deadlines produce no reminders.

## Phase 12 Dashboards, history and archive

Build `My actions`, client hub, project dashboard, artwork history, reviewer progress, recently approved items and archive views. Add pagination and filters.

**Exit:** Each role sees only relevant authorised work and can identify the current blocker. Historic approval evidence remains accessible.

## Phase 13 White-labelling and custom domain

Add installation branding settings for the public name, logo, favicon, supported colour tokens, email identity, support details, login content, footer links and `Powered by OpenProofing` visibility. Add validated custom-domain mapping, canonical URLs and safe defaults. Document DNS, TLS and sender-domain verification for self-hosters.

**Exit:** A platform administrator can apply and revert branding without changing code; missing settings fall back to OpenProofing; invalid assets, URLs, colours and hosts are rejected; authentication and email links use the verified canonical domain; internal identifiers remain stable.

## Phase 14 Hardening and launch

Complete accessibility, responsive, security, performance and restoration testing. Add rate limits, monitoring, retention controls, operational runbooks and staging user acceptance testing.

Use a realistic scenario: one client, one project, three artwork items, three reviewers, one agency, two proof versions, one skip, one conflicting instruction, an agency feedback cycle and a confirmed final file.

**Exit:** The acceptance suite passes in staging, critical security findings are resolved, backups restore successfully and launch ownership is agreed.

## Delivery discipline for every phase

- Confirm the phase scope and dependencies.
- Implement database and domain changes before UI behaviour.
- Add audit events and server-side permissions with the feature.
- Add automated tests for success, denial, failure and concurrency paths.
- Run focused tests during work and the required regression suite before completion.
- Update these documents if actual behaviour changes.
- Report known limitations plainly. Do not mark incomplete work as done.
