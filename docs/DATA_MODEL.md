# Data Model

Names are logical and may be adapted to code conventions. IDs should use UUIDs or another non-sequential opaque identifier. Every mutable business table includes `created_at` and `updated_at`; audit and immutable records do not need a mutable timestamp.

## Relationship overview

```text
Organisation ──< OrganisationMembership >── User
Installation ── BrandingSettings
Installation ──< DomainMapping
Client ──< Project ──< Artwork ──< ProofVersion
                    │             └──< FinalFile
                    ├──< ProjectMembership >── User
                    └──< ApprovalFlow ──< ApprovalStage ──< StageReviewer
Artwork ──< ReviewRound ──< RoundStage ──< ReviewAssignment
                  │             └── workflow snapshot
                  ├──< Annotation ──< Comment ──< Comment
                  ├──< ReviewSubmission ──< ChecklistResponse
                  └──< ConsolidatedFeedback ──< FeedbackItem ── FeedbackResolution
ProofVersion ── FinalApproval ── FinalFile
Project ──< AuditEvent
Project ──< NotificationOutbox
```

## Identity and tenancy

### Installation

Fields: `id`, `internal_name`, `canonical_url`, `created_at`.

There is one active installation record in the MVP. `internal_name` remains `OpenProofing`.

### BrandingSettings

Fields: `id`, `installation_id`, `display_name`, `logo_storage_key`, `logo_dark_storage_key`, `favicon_storage_key`, `primary_colour`, `accent_colour`, `email_sender_name`, optional `email_sender_address`, optional `email_logo_storage_key`, `support_name`, optional `support_email`, optional `support_url`, optional `login_heading`, optional `login_message`, optional `privacy_url`, optional `terms_url`, `show_powered_by`, `updated_by_user_id`, `updated_at`.

Unique: `installation_id`. Use validated OpenProofing defaults for nullable presentation fields.

### DomainMapping

Fields: `id`, `installation_id`, `hostname`, `status`, `verification_token_hash`, `verified_at`, `tls_status`, `is_canonical`, `created_at`.

Status: `PENDING`, `VERIFIED`, `ACTIVE`, `FAILED`, `DISABLED`.

TLS status: `PENDING`, `ACTIVE`, `FAILED`.

Constraints: normalised unique hostname; only one canonical active domain per installation.

### Organisation

Fields: `id`, `name`, `type`, `status`.

Types: `PLATFORM`, `AGENCY`, `CLIENT`.

### User

Fields: `id`, `email`, `first_name`, `last_name`, `display_name`, `avatar_url`, `status`, `last_login_at`.

Status: `INVITED`, `ACTIVE`, `DISABLED`.

Constraints: case-insensitive unique email.

### OrganisationMembership

Fields: `organisation_id`, `user_id`, `status`.

This supports affiliation and discovery. It does not grant project access.

### Client

Fields: `id`, `organisation_id`, `name`, `logo_storage_key`, `status`.

Status: `ACTIVE`, `ARCHIVED`.

### Project

Fields: `id`, `client_id`, `name`, `description`, `owner_user_id`, `status`, `deadline_enabled`, `deadline_at`, `archived_at`.

Status: `DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED`.

### ProjectMembership

Fields: `id`, `project_id`, `user_id`, `role`, `status`, `invited_by_user_id`, `invited_at`, `accepted_at`.

Role: `ACCOUNT_MANAGER`, `REVIEWER`, `AGENCY_USER`, with platform administration handled separately.

Unique: `(project_id, user_id, role)`.

## Artwork and files

### Artwork

Fields: `id`, `project_id`, `name`, `description`, `status`, `approval_mode`, `active_approval_flow_id`, `deadline_enabled`, `deadline_at`, `approved_at`, `archived_at`.

Approval mode: `INDIVIDUAL` for MVP; reserve `GROUP` without exposing it.

Status: `DRAFT`, `AWAITING_PROOF`, `AWAITING_REVIEW`, `REVIEW_IN_PROGRESS`, `AWAITING_ACCOUNT_MANAGER`, `CHANGES_REQUESTED`, `AGENCY_AMENDING`, `READY_FOR_NEW_PROOF`, `APPROVED_PROOF`, `AWAITING_FINAL_FILE`, `FINAL_FILE_UPLOADED`, `FINAL`, `ARCHIVED`.

### ProofVersion

Fields: `id`, `artwork_id`, `version_number`, `original_filename`, `storage_key`, `mime_type`, `file_size`, `sha256_hash`, `uploaded_by_user_id`, `uploaded_at`, `render_status`, `page_count`, `width`, `height`.

Render status: `PENDING`, `PROCESSING`, `READY`, `FAILED`.

Unique: `(artwork_id, version_number)`. Treat the material fields as immutable after validation.

### ProofPage

Fields: `id`, `proof_version_id`, `page_number`, `width`, `height`, `rotation`, `preview_storage_key`, `thumbnail_storage_key`.

Unique: `(proof_version_id, page_number)`.

### FinalFile

Fields: `id`, `artwork_id`, `approved_proof_version_id`, `original_filename`, `storage_key`, `mime_type`, `file_size`, `sha256_hash`, `uploaded_by_user_id`, `uploaded_at`, `status`, `confirmed_by_user_id`, `confirmed_at`.

Status: `UPLOADED`, `CONFIRMED`, `REJECTED`, `SUPERSEDED`.

## Workflow configuration and snapshot

### WorkflowTemplate

Fields: `id`, `organisation_id`, `name`, `status`, `created_by_user_id`.

### ApprovalFlow

Fields: `id`, `project_id`, optional `artwork_id`, `name`, optional `source_template_id`, `created_by_user_id`.

### ApprovalStage

Fields: `id`, `approval_flow_id`, `stage_number`, `stage_type`, `name`, `review_mode`.

Stage type: `REVIEW`, `ACCOUNT_MANAGER`, `AGENCY`.

Review mode: `SEQUENTIAL`, `PARALLEL`.

Unique: `(approval_flow_id, stage_number)`.

### StageReviewer

Fields: `id`, `approval_stage_id`, `user_id`, `sequence_number`, `required`.

### ReviewRound

Fields: `id`, `artwork_id`, `proof_version_id`, `round_number`, `status`, `started_at`, `completed_at`, `closed_at`, `created_by_user_id`.

Status: `DRAFT`, `ACTIVE`, `AWAITING_ACCOUNT_MANAGER`, `CHANGES_REQUIRED`, `NO_CHANGES_REQUIRED`, `CLOSED`.

Unique: `(artwork_id, round_number)`.

### RoundStage

Snapshot fields: `id`, `review_round_id`, `source_stage_id`, `stage_number`, `stage_type`, `name`, `review_mode`, `status`.

### ReviewAssignment

Fields: `id`, `review_round_id`, `round_stage_id`, `user_id`, snapshot `reviewer_name`, snapshot `reviewer_email`, `sequence_number`, `status`, `deadline_enabled`, `deadline_at`, `started_at`, `completed_at`, `skipped_at`, `skipped_by_user_id`, `skip_reason`, `replaces_assignment_id`.

Status: `NOT_STARTED`, `AVAILABLE`, `IN_PROGRESS`, `COMPLETED_NO_CHANGES`, `COMPLETED_CHANGES_REQUIRED`, `SKIPPED`, `REPLACED`.

## Annotations and discussion

### Annotation

Fields: `id`, `review_round_id`, `proof_version_id`, `proof_page_id`, `created_by_user_id`, `type`, `x`, `y`, `width`, `height`, optional validated `geometry`, `viewer_schema_version`, `created_at`.

Type: `PIN`, `BOX`, `ARROW`, `HIGHLIGHT`.

Checks: all normalised values are between `0` and `1`; proof and page belong to the round's proof version.

### Comment

Fields: `id`, `review_round_id`, optional `annotation_id`, optional `parent_comment_id`, `author_user_id`, `body`, `created_at`.

A self-reference supports replies. Depth may be limited to one reply level in the UI.

### ReviewChecklist

Fields: `id`, `project_id` or organisation scope, `name`, `status`.

### ChecklistItem

Fields: `id`, `review_checklist_id`, `position`, `label`, `response_type`, `required`.

### ReviewSubmission

Fields: `id`, `review_assignment_id`, `decision`, `submitted_by_user_id`, `submitted_at`.

Decision: `NO_CHANGES_REQUIRED`, `CHANGES_REQUIRED`.

Unique: one submission per assignment.

### ChecklistResponse

Fields: `id`, `review_submission_id`, `checklist_item_id`, snapshot `item_label`, `value`, optional `note`.

## Consolidation and agency action

### ConsolidatedFeedback

Fields: `id`, `review_round_id`, `status`, `prepared_by_user_id`, `sent_at`, `closed_at`.

Status: `DRAFT`, `SENT_TO_AGENCY`, `RESOLVED`, `CLOSED`.

### FeedbackItem

Fields: `id`, `consolidated_feedback_id`, optional `source_annotation_id`, optional `source_comment_id`, `instruction`, `priority`, `status`, `decided_by_user_id`, `decision_reason`.

Status: `ACTION_REQUIRED`, `IN_PROGRESS`, `COMPLETED`, `DISCUSSED_OFFLINE`, `NO_LONGER_APPLICABLE`.

### FeedbackResolution

Fields: `id`, `feedback_item_id`, `status`, `action_taken`, `resolved_by_user_id`, `resolved_at`.

Keep resolution history append-only if an action moves between states.

## Approval, notification and audit

### FinalApproval

Fields: `id`, `artwork_id`, `proof_version_id`, `proof_sha256_hash`, `approved_by_user_id`, `approved_at`, `workflow_snapshot`, `review_summary`, `skips_summary`, `offline_outcomes`.

Unique active approval per artwork. The record itself remains immutable.

### NotificationOutbox

Fields: `id`, `event_key`, `recipient_user_id`, `channel`, `template`, `payload`, `status`, `attempt_count`, `available_at`, `sent_at`, `last_error`.

Unique: `event_key` for logical idempotency.

### AuditEvent

Fields: `id`, `project_id`, `actor_user_id`, `action`, `subject_type`, `subject_id`, `request_id`, `occurred_at`, `data`.

Append only. Index `(project_id, occurred_at)`, `(subject_type, subject_id, occurred_at)` and `actor_user_id`.

## Required indexes

- Active project memberships by user and project
- Artwork by project and status
- Proof versions by artwork and version descending
- Rounds by artwork and round descending
- Available assignments by user, status and deadline
- Annotations and comments by round, page and creation time
- Feedback items by consolidated set and status
- Outbox by status and `available_at`
- Audit events by project or subject and time
- Active domain mapping by normalised hostname
