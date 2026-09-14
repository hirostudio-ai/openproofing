# Workflow and State Machine

All transitions run on the server through the workflow service. Each transition records the actor, timestamp and audit event. Notifications are queued only after the state change commits.

## Main workflow

```text
AWAITING_PROOF
      │ agency uploads and proof validates
      ▼
AWAITING_REVIEW → REVIEW_IN_PROGRESS
      │ all required assignments complete or formally skipped
      ▼
AWAITING_ACCOUNT_MANAGER
      ├── approve proof ────────────────► APPROVED_PROOF
      │                                     │ request final file
      │                                     ▼
      │                               AWAITING_FINAL_FILE
      │                                     │ agency uploads
      │                                     ▼
      │                               FINAL_FILE_UPLOADED
      │                                     │ AM confirms
      │                                     ▼
      │                                    FINAL
      │
      └── send consolidated changes ───► CHANGES_REQUESTED
                                            │ agency starts work
                                            ▼
                                      AGENCY_AMENDING
                                            │ all required actions resolved
                                            ▼
                                     READY_FOR_NEW_PROOF
                                            │ agency uploads next version
                                            └──────────────► AWAITING_REVIEW
```

`AWAITING_REVIEW` is a transient state. When the agency uploads a new proof and it validates, the system atomically creates the round snapshot, creates assignments and advances to `REVIEW_IN_PROGRESS`. Both events are recorded in the audit log. The agency marks which round the uploaded version is for.

## Artwork transitions

| From | Event | Actor | Guard | To |
| --- | --- | --- | --- | --- |
| `DRAFT` | activate artwork | Account Manager | valid project, flow and agency access | `AWAITING_PROOF` |
| `AWAITING_PROOF` | proof validated | Agency User or Account Manager | upload verified and hashed | `AWAITING_REVIEW` |
| `AWAITING_REVIEW` | round started | System | workflow snapshot and assignments created | `REVIEW_IN_PROGRESS` |
| `REVIEW_IN_PROGRESS` | reviews complete | System | every required assignment completed or skipped | `AWAITING_ACCOUNT_MANAGER` |
| `AWAITING_ACCOUNT_MANAGER` | send feedback | Account Manager | actionable consolidated set exists | `CHANGES_REQUESTED` |
| `CHANGES_REQUESTED` | agency begins | Agency User | consolidated feedback was sent | `AGENCY_AMENDING` |
| `AGENCY_AMENDING` | actions resolved | Agency User | no required item remains open | `READY_FOR_NEW_PROOF` |
| `READY_FOR_NEW_PROOF` | new proof validated | Agency User | next version allocated and verified | `AWAITING_REVIEW` |
| `AWAITING_ACCOUNT_MANAGER` | approve proof | Account Manager | round complete and conflicts resolved | `APPROVED_PROOF` |
| `APPROVED_PROOF` | request final file | System | immutable approval exists | `AWAITING_FINAL_FILE` |
| `AWAITING_FINAL_FILE` | final uploaded | Agency User | file verified and linked to approved proof | `FINAL_FILE_UPLOADED` |
| `FINAL_FILE_UPLOADED` | final confirmed | Account Manager | file details accepted | `FINAL` |
| any allowed inactive state | archive | Account Manager | no transition is currently committing | `ARCHIVED` |

Restoring an archived item returns it to its recorded pre-archive state and is audited. An approved proof is never unapproved by an edit; replacement begins a new version and approval cycle.

## Review round state

```text
DRAFT → ACTIVE → AWAITING_ACCOUNT_MANAGER
                    ├─ CHANGES_REQUESTED ─┐
                    └─ NO_CHANGES_REQUESTED
                                  │
                                  ▼
                                CLOSED
```

- `DRAFT → ACTIVE`: the snapshot is complete and the first required assignments are available.
- `ACTIVE → AWAITING_ACCOUNT_MANAGER`: every required assignment is completed or skipped.
- The Account Manager records whether the consolidated outcome requires changes or not.
- Dispatching feedback or approving the proof closes the round.
- No transition leaves `CLOSED`.

## Review assignment state

```text
NOT_STARTED → AVAILABLE → IN_PROGRESS → COMPLETED_NO_CHANGES
                                  └────► COMPLETED_CHANGES_REQUIRED
NOT_STARTED or AVAILABLE ────────► SKIPPED
NOT_STARTED or AVAILABLE ────────► REPLACED
```

Rules:

- Opening an available assignment may set it to `IN_PROGRESS`.
- Submitting creates an immutable `ReviewSubmission` and one completed state.
- Skip and replacement are Account Manager actions and require reasons.
- A replacement creates a new assignment; it does not rewrite the original.
- Completion in a sequential stage releases the next required assignment.
- In a parallel stage, all required reviewers become available together and the stage completes only when all are completed or skipped.
- When all required reviewers in a stage complete or are skipped, the stage advances. Optional reviewers (`required: false`) who have not completed are marked as not completed and the flow continues without them. They do not block stage progression.

## Feedback item state

```text
ACTION_REQUIRED → IN_PROGRESS → COMPLETED
       ├──────────────────────► DISCUSSED_OFFLINE
       └──────────────────────► NO_LONGER_APPLICABLE
```

`DISCUSSED_OFFLINE` and `NO_LONGER_APPLICABLE` require a recorded explanation. An item may return from `IN_PROGRESS` to `ACTION_REQUIRED`. Once a new proof is created, the preceding action set is frozen.

## Final file state

```text
UPLOADED → CONFIRMED
    └────► REJECTED
CONFIRMED ── replacement approval cycle only ──► SUPERSEDED
```

Rejecting a final file does not change the approved proof. The agency uploads a separate replacement final-file record.

## Transition implementation contract

Each transition receives an idempotency key and expected current state. In one transaction it authorises the actor, validates guards, updates records, appends the audit event and writes notification outbox entries. A stale expected state returns a conflict and does not partially apply.

