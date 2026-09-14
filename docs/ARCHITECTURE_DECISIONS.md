# Architecture Decisions

This is a lightweight decision log. Add new entries; do not rewrite an accepted decision without recording a superseding decision.

## ADR 001 Modular monolith

**Status:** Accepted

**Decision:** Build one TypeScript application with clear domain modules, one PostgreSQL database and separate background workers.

**Reason:** The workflow needs strong transactions and a small team needs low operational overhead.

**Consequence:** Module boundaries must remain explicit. Split services only after evidence shows a need.

## ADR 002 PostgreSQL as system of record

**Status:** Accepted

**Decision:** Store transactional and workflow data in PostgreSQL and manage schema changes with Prisma migrations.

**Reason:** Relationships, constraints, transactions and concurrency control are central to approval integrity.

**Consequence:** Important invariants use database constraints as well as service validation.

## ADR 003 Private object storage

**Status:** Accepted

**Decision:** Store proof, preview, export and final files in private S3-compatible object storage. Serve them through short-lived signed URLs after authorisation.

**Reason:** Artwork is commercially sensitive and can be large.

**Consequence:** Database rows contain metadata and generated object keys, not public URLs.

## ADR 004 Immutable versions and closed rounds

**Status:** Accepted

**Decision:** Proof versions and closed review evidence cannot be edited or normally deleted.

**Reason:** Approval must remain tied to the file and feedback actually reviewed.

**Consequence:** Corrections create a new version or round. Administration does not include an unlock function.

## ADR 005 Project-scoped access

**Status:** Accepted

**Decision:** Authorisation comes from project membership and role, not organisation membership alone.

**Reason:** One person can have different responsibilities across clients and projects.

**Consequence:** Every server-side resource lookup includes a project access check.

## ADR 006 Workflow snapshots

**Status:** Accepted

**Decision:** A review round owns an immutable copy of the workflow and assignments in force when it begins.

**Reason:** Historic rounds must remain intelligible after configuration changes.

**Consequence:** Future changes never rewrite previous rounds.

## ADR 007 Explicit state machines

**Status:** Accepted

**Decision:** Artwork, review rounds, assignments, feedback actions and final files use named states and guarded transitions.

**Reason:** Ad hoc status changes would create contradictory records and permission gaps.

**Consequence:** Direct status-field updates outside the workflow service are prohibited.

## ADR 008 Normalised annotation coordinates

**Status:** Accepted

**Decision:** Store annotation geometry as page-relative decimals and never as viewport pixels.

**Reason:** Markers must remain accurate across zoom, resize and devices.

**Consequence:** The viewer owns coordinate conversion and tests it at several viewport sizes.

## ADR 009 Outbox-backed notifications

**Status:** Accepted

**Decision:** Write notification intents to an outbox in the same transaction as the domain event, then deliver asynchronously.

**Reason:** Workflow success must not depend on an email provider, and committed events must not lose notifications.

**Consequence:** Delivery is retryable and idempotent.

## ADR 010 Separate proof and final file

**Status:** Accepted

**Decision:** The approved review proof and final high-resolution file are separate immutable records with separate hashes and permissions.

**Reason:** The reviewed proof may not be the distribution master, but the relationship must be explicit.

**Consequence:** Final-file upload begins only after proof approval and requires Account Manager confirmation.

## ADR 011 MVP approval semantics

**Status:** Accepted

**Decision:** Reviewers submit `NO_CHANGES_REQUIRED` or `CHANGES_REQUIRED`; the Account Manager supplies final proof approval.

**Reason:** `Approved with comments` creates ambiguous obligations.

**Consequence:** Any required amendment must exist as actionable feedback.

## ADR 012 Supported formats and channels

**Status:** Accepted for MVP

**Decision:** Support PDF, JPG and PNG proofs and email notifications first.

**Reason:** These cover the initial use case while limiting unsafe rendering and integration scope.

**Consequence:** Other media types and Slack or Teams require later decisions.

## ADR 013 Open-source self-hosted distribution

**Status:** Accepted

**Decision:** OpenProofing is an open-source project designed for installation on infrastructure controlled by the operator.

**Reason:** Organisations must be able to own their data, deployment and domain.

**Consequence:** Releases need containers, documented configuration, migrations, backups and upgrade notes. Core operation must not require a proprietary OpenProofing cloud service.

## ADR 014 Installation-level white-labelling

**Status:** Accepted for MVP

**Decision:** One installation can replace the public platform name, visual identity, domain, email presentation, support details, login content and footer links. It may hide the `Powered by OpenProofing` credit.

**Reason:** Self-hosters may need the platform to appear as their own client service.

**Consequence:** Branding is structured installation configuration served through one branding layer. OpenProofing remains the internal identity used by code, migrations and upgrade tooling. Multi-brand portals within one installation are later scope.

## ADR 015 Auth.js v5 with Prisma adapter

**Status:** Accepted

**Decision:** Use Auth.js v5 with a Prisma database adapter for authentication. Use standalone PostgreSQL and MinIO for object storage. Do not use Supabase.

**Reason:** Maximises self-hosting flexibility with no vendor lock-in. Auth.js v5 supports email magic links through its database adapter, standalone Postgres keeps the deployment simple, and MinIO provides S3-compatible storage without external dependencies.

**Consequence:** Session management uses Auth.js JWT or database sessions. The local dev stack requires a MinIO container alongside PostgreSQL. Storage adapters target S3-compatible APIs.

## ADR 016 BullMQ with Redis for background jobs

**Status:** Accepted

**Decision:** Use BullMQ with Redis for background job processing (email, rendering, exports, reminders).

**Reason:** BullMQ is battle-tested with mature retry, scheduling and dashboard tooling. It is widely used with Next.js and Node.js applications.

**Consequence:** Redis is added as an infrastructure dependency for both local development and production. The `docker-compose.yml` must include a Redis container.

## ADR 017 pnpm as package manager

**Status:** Accepted

**Decision:** Use pnpm as the package manager.

**Reason:** pnpm provides faster installs, strict dependency isolation and disk efficiency. It prevents phantom dependencies through its strict node_modules structure.

**Consequence:** Contributors must install pnpm. The lockfile is `pnpm-lock.yaml`. CI pipelines use `pnpm install --frozen-lockfile`.

## ADR 018 Tailwind CSS v4

**Status:** Accepted

**Decision:** Use Tailwind CSS v4 (CSS-first configuration).

**Reason:** v4 is the latest release with a simpler CSS-native configuration model, better performance and smaller output.

**Consequence:** Configuration uses CSS `@theme` directives instead of a `tailwind.config.js` file. Tailwind is installed in Phase 0 but theming is deferred until UI work begins.

## ADR 019 Transient AWAITING_REVIEW state

**Status:** Accepted

**Decision:** `AWAITING_REVIEW` is a transient state. When the agency uploads a proof and it validates, the system atomically creates the round snapshot, creates assignments and advances to `REVIEW_IN_PROGRESS`. The agency marks which round the uploaded version is for.

**Reason:** The two-step exists so the audit log captures both events (proof validated and round started), but there is no manual intervention between them.

**Consequence:** The workflow service chains the `proof validated → round started` transitions atomically. `AWAITING_REVIEW` is never a resting state visible to users.

## ADR 020 Optional reviewers do not block stage progression

**Status:** Accepted

**Decision:** When all required reviewers in a stage complete or are skipped, the stage advances. Optional reviewers (`required: false`) who have not completed are marked as not completed. They do not block stage progression.

**Reason:** Optional reviewers are supplementary. The workflow should not stall waiting for non-essential feedback.

**Consequence:** The stage completion check evaluates only `required: true` assignments. The UI should indicate which reviewers were optional and did not complete.

