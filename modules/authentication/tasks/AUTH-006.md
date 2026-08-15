# AUTH-006 — Login Integration

## Status
DONE

## Read

- modules/authentication/documentation.md
- modules/authentication/implementation-plan.md
- modules/authentication/tasks/AUTH-003.md
- modules/authentication/tasks/AUTH-005.md

## Goal

Connect the React login screen to the Laravel login API.

## Steps

1. Inspect the existing frontend API structure.
2. Connect the login form to the backend login endpoint.
3. Send email and password securely.
4. Handle successful authentication.
5. Handle failed authentication.
6. Handle loading state.
7. Handle network/API errors.
8. Add tests.

## Rules

- Use the existing API/client structure.
- Do not duplicate API logic inside components.
- Do not expose passwords in logs.
- Do not hard-code API URLs.
- Do not implement protected routes yet.
- Do not implement role-based navigation yet.
- Do not modify unrelated features.
- Do not commit or push.

If the existing API architecture is unclear, STOP and ask me.

## Done When

- Login request reaches Laravel.
- Valid credentials authenticate successfully.
- Invalid credentials display an appropriate error.
- Loading state works.
- Network errors are handled.
- Authentication state is preserved according to the configured strategy.
- Frontend tests pass.
- Integration is verified.

## Final

Report:s

- Files changed
- API integration details
- Tests performed
- Verification result
- Any issues

Set status to `DONE` only after successful verification.