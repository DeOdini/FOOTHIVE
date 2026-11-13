# Phase 2 validation and security findings

Status: **reviewed, not certified; no production execution**.

## Netlify Database compatibility
The connected Netlify integration reports: "Ensure the @netlify/database npm package is installed." The current implementation instead uses `pg` and `FOOTHIVE_AUTOMATION_DATABASE_URL`. **Compatibility is not verified.** Do not deploy until the database's supported connection mechanism and credentials are established. The backend is deliberately staged in `automation/backend` to avoid changing the website's build configuration.

## Offline tests
From `automation/backend`, run `npm install` and `npm test`. These tests mock PostgreSQL queries. They validate API input/output and error handling, **not** actual SQL transaction semantics, concurrency, or Netlify runtime compatibility. No tests have been executed by this GitHub-only session.

## Blocking issues before production
1. **Database adapter:** verify supported `@netlify/database` usage and choose either that SDK or a supported direct Postgres connection. Do not infer a connection string.
2. **DB permissions:** migration 001 revokes PUBLIC privileges. Establish an explicit least-privilege runtime role and verify function EXECUTE, schema USAGE, sequence access and ownership. SQL functions currently run with invoker privileges.
3. **Crash recovery:** a claim stuck in `processing` cannot be reclaimed. Design an operator-reviewed recovery path; never automatically repeat an uncertain WhatsMCP POST.
4. **Atomic attempt/complete ordering:** `record_attempt` currently checks `completion_number IS NULL` without locking the parent response row. Concurrent completion may race. Replace with a transactionally locked SQL function.
5. **Notification semantics:** a 2xx WhatsMCP response is not proof of delivery. Explicitly distinguish accepted, queued, failed and uncertain outcomes and preserve ntfy fallback behavior.
6. **Health-check lifecycle:** the lease is reclaimed after 2 minutes, but a failed result is terminal. Decide whether health failures should be retried or alerted once. Health checks should not block new WhatsMCP POST attempts.
7. **Milestone semantics:** current counter counts all calls to `complete_response`, including failed/uncertain states. Confirm these represent completed *processing attempts* as intended, and ensure every path calls completion exactly once.
8. **Data minimization:** response email is stored in plaintext; define retention and redaction for logs.
9. **API security:** use an unpredictable >=32-character server-side secret, restrict to server-side Activepieces calls, consider separate roles for claim/complete versus health-check, and add upstream rate limiting. No browser calls.
10. **Deployment isolation:** never deploy `automation/backend/public` over the existing FOOTHIVE site. Integrate functions into the actual site build only after inspecting production settings and approving a deploy.
11. **Database tests:** use disposable Postgres to verify concurrent duplicate claims, idempotent completion, exactly 20 milestones, lease races and transaction rollback.
12. **Test dependencies:** run `npm install` to resolve `pg` before `npm test`. No dependency lockfile exists yet.

## Approval gates
No production SQL migration, environment changes, deploy, Activepieces publish, Gmail send, WhatsMCP POST or ntfy POST without explicit approval.
