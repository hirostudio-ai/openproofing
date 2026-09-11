# Acceptance Tests

Use stable fixture IDs and generated files. Tests must not depend on production services or client data. The identifiers below can become automated test names.

## Identity and access

- **AUTH-001:** An invited user can accept a valid invitation and receives only the intended project role.
- **AUTH-002:** An expired, reused or wrong-email invitation is rejected.
- **AUTH-003:** A Project A reviewer cannot list, read, download or mutate Project B resources by changing an ID.
- **AUTH-004:** A reviewer cannot perform Account Manager or agency actions.
- **AUTH-005:** A disabled user cannot sign in or use an existing session.
- **AUTH-006:** Signed file URLs are short lived and are created only after project authorisation.

## Proof versions and storage

- **FILE-001:** Uploading an accepted PDF, JPG or PNG creates a private object, SHA-256 hash and immutable V1 record.
- **FILE-002:** Uploading a correction creates V2 and leaves every V1 field and object unchanged.
- **FILE-003:** Concurrent uploads for one artwork receive distinct sequential version numbers.
- **FILE-004:** An unsupported, oversized, corrupt or MIME-mismatched file does not become reviewable.
- **FILE-005:** A render failure is visible to authorised operators and does not start a review round.
- **FILE-006:** A normal reviewer cannot retrieve the original high-resolution final file before confirmation.

## Viewer and annotations

- **VIEW-001:** A marker at stored coordinates remains aligned after zoom, pan, resize and device-pixel-ratio changes.
- **VIEW-002:** A multi-page annotation opens the correct version and page.
- **VIEW-003:** Pin, box, arrow and highlight geometry is validated within page bounds.
- **VIEW-004:** Choosing a comment scrolls or moves the viewer to its annotation.
- **VIEW-005:** Previous and next comment controls work on mobile.
- **VIEW-006:** A keyboard user can reach the viewer controls, markers and comment thread.

## Review assignments and rounds

- **REV-001:** In a sequential flow, Reviewer 1 is available while Reviewers 2 and 3 are locked.
- **REV-002:** Reviewer 1 submission makes Reviewer 2 available exactly once.
- **REV-003:** A reviewer cannot submit an unavailable assignment by calling the server directly.
- **REV-004:** A submission requires a complete required checklist and one valid decision.
- **REV-005:** Repeating the same submission request is idempotent.
- **REV-006:** Once submitted or closed, included annotations, comments, responses, decisions and timestamps cannot be edited or deleted.
- **REV-007:** A parallel stage releases all required assignments and completes only after all are completed or skipped.
- **REV-008:** A round snapshot is unchanged after the source flow or user profile is edited.
- **REV-009:** A skip requires an Account Manager and non-empty reason; the original assignment remains in history.
- **REV-010:** A replacement preserves the old assignment and creates a new auditable assignment.

## Consolidation and agency amendments

- **FDBK-001:** The Account Manager can convert reviewer feedback into a frozen consolidated action set.
- **FDBK-002:** Contradictory feedback requires an Account Manager decision before dispatch.
- **FDBK-003:** `DISCUSSED_OFFLINE` and `NO_LONGER_APPLICABLE` require an explanation.
- **FDBK-004:** An agency user can update authorised feedback actions but cannot alter source reviewer comments.
- **FDBK-005:** A new proof upload is rejected while any required action remains open or in progress.
- **FDBK-006:** The feedback PDF contains the correct project, version, annotations, comments, decisions, resolutions and timestamps.

## Workflow transitions

- **FLOW-001:** A valid three-reviewer round reaches the Account Manager only after all required assignments finish.
- **FLOW-002:** An invalid or stale state transition returns a conflict and makes no partial change.
- **FLOW-003:** State update, audit event and notification outbox entry commit atomically.
- **FLOW-004:** A new version creates a new round and assignments without modifying the earlier round.
- **FLOW-005:** An archived project is absent from active views but retains history.
- **FLOW-006:** No API or administration route can reopen a closed round.

## Approval and final file

- **APPR-001:** Only an authorised Account Manager can approve a proof.
- **APPR-002:** Approval records the exact proof ID, version, filename, hash, actor and timestamp.
- **APPR-003:** Approval is rejected if required reviews are incomplete or conflicts unresolved.
- **APPR-004:** Editing or replacing an approved proof is impossible; a replacement begins a new version and cycle.
- **APPR-005:** A final file is stored separately and references the approved proof.
- **APPR-006:** Rejecting a final file leaves the proof approval intact and allows a separate replacement upload.
- **APPR-007:** After confirmation, an authorised download succeeds and creates one audit event.

## Notifications, audit and reliability

- **OPS-001:** Email provider failure does not roll back a valid workflow transition.
- **OPS-002:** Retrying a job does not send the same logical notification twice.
- **OPS-003:** Due-soon and overdue reminders follow configured times and do not exist when deadlines are disabled.
- **OPS-004:** Every sensitive domain action creates an audit event with actor, subject and UTC time.
- **OPS-005:** Audit records cannot be changed or deleted through application services.
- **OPS-006:** Logs and audit payloads contain no secrets, signed URLs or magic-link tokens.
- **OPS-007:** Database and object storage can be restored together without breaking proof references.

## White-labelling and self-hosting

- **BRAND-001:** With no custom settings, the interface and emails use complete OpenProofing defaults.
- **BRAND-002:** An authorised platform administrator can change the display name, approved assets, colour tokens, support details, login content and footer links.
- **BRAND-003:** Branding changes appear consistently on login, navigation, transactional email and generated feedback documents without changing stored workflow evidence.
- **BRAND-004:** Invalid colours, unsafe links, executable uploads and arbitrary HTML or CSS are rejected.
- **BRAND-005:** The `Powered by OpenProofing` credit follows its setting without removing licence notices from source distributions.
- **BRAND-006:** An unverified or disabled hostname is rejected and cannot influence authentication callback or email-link generation.
- **BRAND-007:** A verified active custom domain uses TLS and becomes the canonical base URL.
- **BRAND-008:** A custom email sender address cannot activate until its domain is verified with the email provider.
- **BRAND-009:** Applying branding does not rename internal packages, migrations, audit actions, environment variables or storage namespaces.
- **HOST-001:** A documented container deployment starts with persistent database and object storage, applies migrations and passes health checks.
- **HOST-002:** An upgrade preserves configuration, artwork, hashes, approval evidence and branding settings.

## Full end-to-end scenario

- **E2E-001:** Create a client, project and three artwork items; invite three reviewers and one agency user.
- **E2E-002:** Upload V1, run two completed reviews and one reasoned skip, resolve a conflicting comment, and send consolidated actions to the agency.
- **E2E-003:** Complete all agency actions, upload V2 and confirm V1 and Round 1 remain unchanged.
- **E2E-004:** Review and approve V2, upload and confirm a separate final file, then download it as an authorised user.
- **E2E-005:** Verify the dashboard states, version timeline, comparison view, feedback export, approval evidence and full audit history match the journey.

## Phase gate

A phase passes only when all tests assigned to its features pass, relevant earlier tests remain green, no critical accessibility or security issue is open, and any deferred behaviour is recorded as a known limitation.
