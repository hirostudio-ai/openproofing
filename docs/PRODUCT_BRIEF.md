# OpenProofing Product Brief

## Product purpose

Build OpenProofing: a secure, open-source and self-hosted web platform where a creative agency, its clients and external agencies can review artwork, annotate the exact area concerned, discuss feedback, progress through a configurable approval flow, manage amendments, approve a specific immutable version and retrieve the final high-resolution file.

The reference deployment is for Hillsgreen and its clients, but the project must be installable by other organisations on their own infrastructure. It is not a general project-management platform or a hosted billing product.

## Product principles

- Reviewers should see the work requiring their attention, not administration screens.
- Nobody should be unsure which version they are viewing or approving.
- Feedback, review decisions, version history and final approval are separate concepts.
- Completed evidence must not be silently changed.
- Account Managers control the workflow and resolve conflicting instructions.
- Agency creatives receive one actionable, consolidated list of changes.
- All access to commercially sensitive artwork is private and permission controlled.

## Primary users

### Platform Administrator

Manages platform-level configuration, organisations and support access. This role does not automatically grant access to every client project unless an explicit audited support mechanism is used.

### Account Manager

Creates clients and projects, configures workflows, invites users, assigns reviewers, controls rounds, consolidates feedback, resolves conflicts, sends actions to an agency, skips or replaces reviewers with a reason, and performs final proof sign-off.

### Reviewer

Views assigned artwork, adds annotations and comments, replies to discussions, completes the checklist and submits a formal `NO_CHANGES_REQUIRED` or `CHANGES_REQUIRED` decision.

### Agency User

Uploads proofs, receives consolidated feedback, downloads a feedback report, works through the action list, records action taken and uploads the next version only after required actions are resolved. After proof approval, the agency uploads the separate final high-resolution file.

## Core hierarchy

```text
Organisation → Client → Project → Artwork → Proof Version → Review Round
```

A project can contain several artwork items. Each artwork item is approved individually in the MVP.

## Core journey

1. The Account Manager creates a project and one or more artwork items.
2. A workflow is selected or configured and reviewers are assigned.
3. An agency user uploads an immutable PDF, JPG or PNG proof.
4. The system creates the next version, hashes it and starts a review round using a workflow snapshot.
5. Reviewers become available in the configured sequence or parallel stage.
6. Reviewers annotate, discuss, complete the checklist and submit their decisions.
7. Submitted reviewer feedback freezes. Later corrections require a new round, not historic editing.
8. The Account Manager sees consolidated feedback and resolves contradictions.
9. The Account Manager either approves the proof or sends an actionable feedback set to the agency.
10. The agency records each action as complete, discussed offline or no longer applicable, with an explanation where required.
11. Only when required actions are resolved can the agency upload a new proof.
12. The new proof becomes the next immutable version and begins a fresh review round.
13. The Account Manager approves the successful proof, locking its hash and approval evidence.
14. The agency uploads a separate high-resolution final file linked to the approved proof.
15. The Account Manager confirms the final file. Authorised users can then download it, and each download is logged.

## Functional scope for MVP

- Email invitation and low-friction authentication
- Project-scoped roles and membership
- Client hub and a personal `My actions` dashboard
- Projects containing multiple artwork items
- PDF, JPG and PNG proof upload
- Immutable version history and file hashes
- Multi-page PDF viewer with thumbnails and page navigation
- Zoom, pan, fit-to-screen and responsive viewing
- Pin, box, arrow and highlight annotations
- Relative annotation coordinates tied to page and proof version
- Threaded comments visible to participants with access
- Sequential workflow UI, with domain support for parallel stages
- Reviewer progress, optional deadlines and reminders
- Configurable review checklist
- Formal review submission and feedback freeze
- Account Manager consolidation and conflict resolution
- Required reasons for reviewer skip, replacement and offline resolution
- Agency changes-to-make view and feedback PDF export
- Side-by-side version comparison with feedback visibility controls
- Account Manager proof approval and permanent approval record
- Separate high-resolution final-file upload and controlled download
- Append-only audit history
- Email notifications with direct links
- Responsive desktop, tablet and mobile use
- Installation-level white-labelling for platform name, logo, favicon, brand colours, domain, email identity, support details, login content, footer links and optional removal of the `Powered by OpenProofing` credit

## Later scope

- Automatic pixel-level visual difference detection
- Video, GIF, Office document and HTML-banner review
- Freehand annotation
- Slack, Microsoft Teams and in-app notification channels
- Advanced `n of m` approval rules
- Group approval of related asset sets
- Private internal-only comments
- Multiple branded portals within one installation
- Self-service multi-tenant billing and onboarding
- Analytics beyond operational dashboards

## Important experience requirements

- Always show client, project, artwork, current version and round context.
- Selecting a comment moves the viewer to the correct page and annotation.
- Mobile provides clear previous-comment and next-comment controls.
- Ordinary reviewers do not see irrelevant project administration.
- Deadlines and reminders remain hidden when disabled.
- High-resolution downloads are unavailable to normal reviewers before final confirmation.
- Historic versions, rounds, approvals and action records remain accessible after completion and archiving.

## Success measures

- A complete two-version approval journey can be run without out-of-band tracking.
- Every approval can be tied to one filename, version and cryptographic hash.
- Reviewers cannot act out of turn or alter submitted feedback.
- The agency cannot upload a replacement proof while required actions remain unresolved.
- An Account Manager can identify the current blocker from the dashboard.
- A historic project can answer who reviewed, changed, skipped, approved and downloaded each file, with timestamps.

## Assumptions requiring validation

- PDF, JPG and PNG cover MVP artwork formats.
- All project participants may see feedback on artwork they can access.
- Individual artwork approval is sufficient for MVP.
- Email is the only notification channel required for MVP.
- Parallel workflow execution is needed in the model but may follow sequential UI delivery.
- Magic-link authentication is acceptable for external client users.
- One white-label identity applies to the whole installation in the MVP.
