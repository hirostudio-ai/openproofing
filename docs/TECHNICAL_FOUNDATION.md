# OpenProofing Technical Foundation

## Purpose

This specification defines the technical boundaries required to support controlled artwork review, annotation, versioning, amendment and approval. The service must favour correctness and traceability over premature interface breadth.

## System shape

Start as a modular monolith with a web application, PostgreSQL database, private object storage and a background worker. Keep clear internal modules for identity, organisations, projects, files, review, workflow, feedback, notifications and audit. Avoid microservices until scale or ownership creates a measured need.

OpenProofing is distributed for self-hosting. Provide container-based deployment, documented environment variables, health checks, repeatable migrations, persistent-volume guidance, backup instructions and an upgrade path that does not depend on a hosted OpenProofing service.

## Runtime components

- Web application: Next.js and TypeScript
- Relational store: PostgreSQL with Prisma migrations
- Object store: private S3-compatible storage
- Authentication: invitation-led Auth.js v5 with a Prisma database adapter
- Rendering: PDF.js in the viewer; asynchronous preview and thumbnail generation where needed
- Messaging: transactional email provider through a notification abstraction
- Jobs: BullMQ with Redis for email, render, export and reminder work
- Observability: structured logs, error tracking and request correlation IDs

## Environments

Maintain separate local, test, staging and production environments. Use isolated databases and storage buckets or prefixes. Never use production client files in automated tests. Production migrations must be forward-only, reviewable and backed up.

## Identity and authorisation

Authentication identifies a user. Authorisation is project based. A user can hold different roles on different projects through `ProjectMembership`.

Roles:

- `PLATFORM_ADMIN`
- `ACCOUNT_MANAGER`
- `REVIEWER`
- `AGENCY_USER`

Centralise policy checks and call them from every server action, route and job. A platform role must not accidentally bypass project checks. Invitations bind the invited email to the intended organisation, project and role and expire after a configured interval.

## File lifecycle

1. The server creates an upload intent after checking project permission and accepted file constraints.
2. The client uploads directly to private storage using a short-lived URL where practical.
3. The server verifies the stored object, MIME type, size and checksum.
4. A database transaction allocates the next artwork version and creates its immutable record.
5. A worker produces safe previews and page metadata.
6. The proof becomes available only after successful validation and rendering.

Retain the original filename as metadata, but generate storage keys. Use a quarantine or failed state for invalid uploads. Do not publish raw object-store paths.

## Supported proof files

MVP supports PDF, JPG and PNG. File-size and page-count limits are configuration, not hard-coded UI values. PDF scripts and active content must not execute. Image parsing and preview generation should occur in an isolated worker.

## Annotation geometry

The canonical coordinate space is each proof page after applying its normalised orientation. Store `x`, `y`, `width` and `height` as decimals between `0` and `1`. A pin may use zero width and height. Store arrow endpoints explicitly or encode them as a validated geometry payload. Include the page number, annotation type and viewer schema version.

The browser converts between page coordinates and screen coordinates. Rotation, zoom and device pixel ratio must not change stored values.

## Workflow execution

Treat workflow progression as a transactionally consistent domain operation. A transition must:

1. Lock or compare the relevant round and assignment records.
2. Confirm the actor and current state.
3. Confirm all guards.
4. Write state and timestamps.
5. Append the audit event.
6. Add notification jobs through an outbox in the same transaction.

Workers deliver outbox entries idempotently. Repeated requests must not complete a review, advance a stage or send the same logical notification twice.

## Historic snapshots

When a round starts, copy the flow name, stages, rules, reviewer identities and ordering into round-owned snapshot records. Historic display reads those records. Later flow edits apply only to future rounds.

## Audit

Audit events include actor, action, subject type and ID, project, request/correlation ID, UTC timestamp and structured before/after or contextual data. Application code offers no update or delete method for audit records. Sensitive values and signed URLs must be excluded.

Events include invitation, access changes, uploads, annotation and comment activity, review submissions, skips, replacements, round transitions, feedback dispatch, agency resolutions, approvals, final-file confirmation, downloads and archival.

## Notifications

Create notification events from committed domain changes. Templates cover invitations, review availability, due-soon and overdue reminders, replies, round completion, agency feedback, new versions, proof approval and final-file availability. Links open the exact authorised context. Reminder rules are configurable and disabled when a deadline is disabled.

## White-labelling and custom domains

Resolve one installation-wide `BrandingSettings` record through a central branding service. Render the configured platform name, logo, favicon, colour tokens, support details, login content, footer links and optional `Powered by OpenProofing` credit. Use OpenProofing defaults for unset values.

Branding input is structured data, not executable markup. Validate asset types and sizes, restrict colours to supported tokens, sanitise text and allow only valid HTTPS links in production. Cache settings with reliable invalidation.

Custom domains use an explicit `DomainMapping` record with ownership-verification and TLS states. Only verified, active hosts may resolve the installation. Configure a canonical application URL for links and authentication callbacks. Do not trust forwarded host headers unless they come through configured proxies.

Outbound email separates the visible sender name from the sender address. A custom sender address becomes available only after the installation operator verifies its domain with the configured email provider.

Internal package names, migrations, environment variables and audit action identifiers remain based on OpenProofing so upgrades work across branded installations.

## Exports

Generate feedback reports asynchronously from a fixed round or consolidated feedback snapshot. The PDF includes client, project, artwork, version, thumbnail, reviewers, annotation references, comments, replies, Account Manager decisions, agency actions and timestamps. Exports are permission checked and stored privately.

## Approval evidence

Final proof approval creates an immutable record containing the proof ID, version, filename, hash, approver, time, workflow snapshot, reviewer outcomes, skipped reviewers and reasons, and offline resolutions. A later downloadable certificate may render from this record.

The final high-resolution upload records its own filename, storage key, hash, uploader and verification state, and references the approved proof. Confirmation and every download are audited.

## Reliability and concurrency

- Use unique constraints for `(artwork_id, version_number)` and `(artwork_id, round_number)`.
- Use database transactions and locking or compare-and-swap guards for version allocation and state advancement.
- Make upload completion, review submission, notification delivery and export jobs idempotent.
- Use an outbox rather than sending email inside a database transaction.
- Back up both PostgreSQL and private object storage and test restoration.

## Performance

- Paginate dashboards, audit logs, comments and history.
- Store preview dimensions and page counts.
- Use thumbnails for lists rather than originals.
- Index membership checks, active assignments, state, deadline and history queries.
- Load PDF pages and annotations on demand.

## Accessibility and responsive behaviour

Meet WCAG 2.2 AA where practical. All non-drawing actions must be keyboard operable. Annotation markers need accessible names and a corresponding navigable comment list. Do not rely on colour alone. Preserve browser zoom. Provide usable touch targets and previous/next comment navigation on mobile.

## Privacy and retention

Define retention and deletion policy before production. Archiving hides work from active views but does not destroy approval evidence. Any lawful deletion flow must distinguish removable personal data from records that must be retained and must itself be audited.

## Operational readiness

Before launch, establish monitoring for failed uploads, render failures, stuck rounds, overdue job queues, email failures and signed-URL abuse. Document incident response, backup restoration, access reviews and support access.
