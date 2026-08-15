# AUTH-007 — Authentication State & Authorization

## Status
DONE

## Read

- modules/authentication/documentation.md
- modules/authentication/implementation-plan.md
- modules/authentication/tasks/AUTH-006.md

## Goal

Complete authentication state and role-based access control across frontend and backend.

## Steps

1. Create central frontend authentication state.
2. Restore authentication state when the app starts.
3. Track authenticated user and role.
4. Protect authenticated frontend routes.
5. Redirect unauthenticated users to login.
6. Restrict frontend routes by role.
7. Implement backend role authorization.
8. Ensure protected APIs verify authentication and role.
9. Connect logout to the existing logout API.
10. Add relevant frontend and backend tests.

## Roles

- customer
- vendor
- admin

Users must only access resources permitted for their role.

## Rules

- Backend authorization is the security boundary.
- Never rely only on frontend route protection.
- Users must not be able to change their role through client requests.
- Do not duplicate authentication state.
- Do not store sensitive credentials unnecessarily.
- Do not modify unrelated features.
- Do not commit or push.

If the existing authentication mechanism or routing structure is unclear, STOP and ask me.

## Done When

- Authentication state works.
- Page reload preserves authentication correctly.
- Protected routes work.
- Role-based frontend access works.
- Backend role authorization works.
- Unauthorized API access is rejected.
- Logout clears authentication state.
- Relevant tests pass.

## Final

Report:

- Files changed
- Authentication state implementation
- Protected routes
- Backend authorization
- Tests performed
- Verification result
- Issues encountered

Set status to `DONE` only after successful verification.