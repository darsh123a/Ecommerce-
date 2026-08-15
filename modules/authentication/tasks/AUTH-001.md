# AUTH-001 — Authentication Database

## Status
DONE

## Read
- docs/tech-stack.md
- docs/setup.md
- modules/authentication/documentation.md
- modules/authentication/implementation-plan.md

## Goal

Create the database foundation for authentication.

Use one `users` table supporting:

- customer
- vendor
- admin

Fields:

- id
- name
- email
- password
- role
- status
- created_at
- updated_at

## Steps

1. Inspect the existing Laravel database structure.
2. Reuse existing users/authentication migrations where appropriate.
3. Create/update the migration.
4. Add required constraints.
5. Run the migration on PostgreSQL.
6. Verify the schema.

## Rules

- Email must be unique.
- Password must use secure hashing.
- Do not create separate user tables.
- Do not modify frontend.
- Do not implement login/API yet.
- Do not delete existing work.
- Do not commit or push.
- Never invent credentials.

If anything is missing or ambiguous, STOP and ask me.

## Done When

- Migration succeeds.
- Users table is correct.
- Roles work.
- Status works.
- Email uniqueness works.
- PostgreSQL verification passes.

## Final

Report files changed, database changes, verification results, and any issues.

Change status to `DONE` only after successful verification.