# AUTH-003 — Login API

## Status
DONE

## Read

- modules/authentication/documentation.md
- modules/authentication/implementation-plan.md
- modules/authentication/tasks/AUTH-001.md
- modules/authentication/tasks/AUTH-002.md

## Goal

Implement the Laravel API endpoint for user sign-in.

## Steps

1. Create the login endpoint.
2. Validate email and password.
3. Find the user.
4. Verify the password.
5. Check account status.
6. Authenticate the user.
7. Return the required authenticated response.
8. Add backend tests.

## Rules

- Use the authentication mechanism configured in AUTH-002.
- Invalid credentials must return a generic error.
- Do not reveal whether an email exists.
- Never return the password or password hash.
- Inactive users cannot sign in.
- Do not implement frontend login yet.
- Do not implement logout yet.
- Do not modify unrelated features.
- Do not commit or push.

If anything is unclear, STOP and ask me.

## Done When

- Valid credentials authenticate successfully.
- Invalid credentials are rejected.
- Inactive users are rejected.
- Authentication response is correct.
- Sensitive information is not exposed.
- Backend tests pass.

## Final

Report:

- Files changed
- API endpoint
- Tests performed
- Verification result
- Any issues

Set status to `DONE` only after successful verification.