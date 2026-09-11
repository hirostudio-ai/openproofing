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
