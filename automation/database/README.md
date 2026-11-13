# FOOTHIVE Activepieces database backend — implementation staging

Status: **review only**. This branch is not deployed. The SQL migration has not been executed.

## Scope
The database is exclusively for the FOOTHIVE Activepieces flow. Neither FOOTHIVE V01 nor V02 needs to connect to it or change its frontend. The existing Google Form remains the trigger.

## Proposed processing sequence
1. Validate Google Forms response; call authenticated server-only Netlify Function `claim`.
2. Only if `claimed=true`, prepare/send the welcome email and record Gmail status. Current Activepieces Gmail action is **draft-only** and must remain so until an approved test.
3. Produce AI summary and write welcome-email subject, summary, timestamp, status and Gmail message ID into the matching original Google Sheets response row. Use a separate tab for full follow-up email history.
4. POST WhatsMCP notification to the approved owner number. Classify HTTP response and provider body; a 2xx may mean accepted/queued, not delivered.
5. For failed, queued or uncertain outcomes, route to ntfy using `{{vars.FOOTHIVE_NTFY_TOPIC}}`; log both attempts. Do not blindly retry uncertain WhatsApp POSTs.
6. Call authenticated `complete` endpoint once after routing. Its SQL function atomically assigns a unique completion number. For multiples of 20, a health-check milestone is created.
7. Claim each pending milestone using an additional transactional lease mechanism (NOT YET IMPLEMENTED), GET WhatsMCP account status, update milestone and use ntfy on failure. GET must never run on every submission.
8. Reflect final statuses in Activepieces ledger and Google Sheets.

## Schema
`001_processing_schema.sql` stages:
- `visitor_processing`: unique response ID and claim token
- `notification_attempts`: per-channel outcomes and idempotency keys
- `processing_counter`: serialized count
- `health_check_milestones`: every 20 completions
- `claim_response` and `complete_response`: transactional database functions

## Security and remaining gates
- No secrets or connection strings are stored in this repository.
- Provision a server-side Netlify Function using Netlify's supported database connection package/configuration; verify the correct Netlify Database API against the installed version.
- Add secret authentication, least-privilege DB role, request validation, rate limits, and bounded logs.
- Implement atomic milestone lease/claim and result update before any live activation.
- Confirm Activepieces project variables `FOOTHIVE_ACTIVEPIECES_WHATSMCP` and `FOOTHIVE_NTFY_TOPIC` resolve at runtime without exposing values.
- Verify Gmail sender identity and Google Sheets original row mapping.
- Use a separate test database/transactional rollback for migration tests, then controlled test notifications with explicit approval.
- Keep Activepieces disabled and unpublished until acceptance.
