# ADMIN-006 — User Management

## Status
DONE

## Read

- modules/admin/documentation.md
- modules/admin/implementation-plan.md
- modules/admin/tasks/ADMIN-001.md

## Goal

Implement V1 user management for admins.

## Requirements

Admin can:

- View users
- View user details
- Activate/deactivate users

## Steps

1. Inspect the existing users structure.
2. Reuse the existing User model/service.
3. Create the required backend APIs.
4. Protect APIs with admin authorization.
5. Create the user management UI.
6. Connect the UI to the APIs.
7. Add loading, empty, and error states.
8. Follow the existing design reference.

## Rules

- Admin only.
- Do not expose passwords or authentication secrets.
- Do not allow normal user management to change a user's role.
- Do not delete users unless already supported by the approved design.
- Do not implement customer/vendor profile functionality.
- Do not modify unrelated modules.
- Do not add unnecessary dependencies.
- Do not commit or push.

If the existing user structure or required permissions are unclear, STOP and ask me.

## Done When

- Admin can view users.
- Admin can view user details.
- Admin can activate/deactivate users.
- Sensitive information is not exposed.
- Backend authorization works.
- Frontend is connected to the backend.
- Design follows the existing reference.

## Final

Report files changed, APIs created/updated, UI implemented, and verification performed.

Set status to `DONE` only after successful verification.