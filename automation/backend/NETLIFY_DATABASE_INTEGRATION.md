# FOOTHIVE Netlify Database integration — development branch only

This folder is an **isolated backend**, not the existing FOOTHIVE website build. Do not deploy it over the existing website or enable Activepieces as part of integration testing.

## Current status
- The Netlify Function selects the runtime's database with `getConnectionString()` from `@netlify/database`. `FOOTHIVE_AUTOMATION_DATABASE_URL` is an explicit override for isolated development/testing only.
- Existing SQL migrations are staged, in order, under `netlify/database/migrations/` relative to this backend root. Original migration copies under `automation/database/` remain as historical source files.
- The dependency declaration uses an **unresolved SDK version range** until package registry access is available. Resolve and pin a tested version and commit the lockfile **before deployment**.
- No database provisioning, migration application, package installation, real PostgreSQL tests, or Netlify deploy has been completed.

## Next verification gates
1. Use a disposable environment whose project base is `automation/backend`, NOT the production FOOTHIVE website. Confirm Netlify recognizes `netlify/database/migrations/` relative to that base.
2. With registry access, install dependencies, pin `@netlify/database` and `pg`, commit a lockfile, and run `npm run check && npm test`.
3. Use disposable PostgreSQL to apply all three migrations in order and test concurrent claims, attempt/completion ordering, counter milestones and rollback.
4. Check least-privilege role grants: migration 001 revokes PUBLIC privileges; the runtime role must have explicit function/schema privileges. Confirm the SDK-selected database connection can invoke the functions.
5. Validate API authentication, processing recovery and the Netlify runtime without publishing the existing website.
6. Only after separate approval consider deployment and Activepieces wiring.

**Do not assume a database has been provisioned or that existing FOOTHIVE V01/V02 deployment settings are compatible with this isolated backend.**
