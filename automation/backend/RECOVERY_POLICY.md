# Interrupted processing recovery policy (operator-controlled)

The backend deliberately does not automatically reclaim an existing response ID.

## Why
A timeout after WhatsMCP POST does not prove the message failed. Automatically
replaying the entire flow could send a duplicate welcome email or WhatsApp
notification.

## Safe review procedure
1. Find the response by its Google Forms response ID in the private database.
2. Inspect visitor_processing state, notification_attempts and provider-side
   WhatsMCP/Gmail delivery evidence.
3. If any external delivery is uncertain, retain state=uncertain and notify
   the operator through the approved fallback; do NOT resend automatically.
4. If processing stopped before any external send, an operator may approve a
   targeted resume from the first unfinished stage, preserving prior attempt
   IDs. A resume endpoint and stage-level idempotency model are **not yet
   implemented**; do not manually reset the claim token.
5. Do not delete the original response, counter, or audit history.
6. Record a human-reviewed resolution before closing the incident.

## Deployment gate
Add a stage-aware, audited resume mechanism before unattended production use.
No claim-token reset, auto retry of WhatsMCP, or manual SQL recovery is
authorized by this document.
