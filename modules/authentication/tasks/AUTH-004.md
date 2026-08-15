# AUTH-004 — Logout

## Status
DONE

## Read

- modules/authentication/documentation.md
- modules/authentication/implementation-plan.md
- modules/authentication/tasks/AUTH-002.md
- modules/authentication/tasks/AUTH-003.md

## Goal

Implement backend logout for authenticated users.

## Steps

1. Create the logout endpoint.
2. Require authentication.
3. Invalidate/remove the user's authentication state according to the configured authentication mechanism.
4. Return a successful response.
5. Add backend tests.

## Rules

- Unauthenticated requests must not be treated as successful logout.
- Do not expose sensitive authentication data.
- Do not implement frontend logout yet.
- Do not modify unrelated features.
- Do not commit or push.

If anything is unclear, STOP and ask me.

## Done When

- Authenticated user can logout.
- Authentication is invalidated correctly.
- Unauthenticated access is handled correctly.
- Backend tests pass.

## Final

Report files changed, endpoint created, tests performed, and verification result.

Set status to `DONE` only after successful verification.