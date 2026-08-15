# ADMIN-003 — Vendor Management

## Status
DONE

## Read

- modules/admin/documentation.md
- modules/admin/implementation-plan.md
- modules/admin/tasks/ADMIN-001.md

## Goal

Implement V1 vendor management for admins.

## Requirements

Admin can:

- View vendors
- View vendor details
- Approve vendors
- Reject vendors
- Activate/deactivate vendors

## Steps

1. Inspect the existing vendor/user structure.
2. Create the required backend APIs.
3. Protect all APIs with admin authorization.
4. Create the vendor management UI.
5. Connect UI to the APIs.
6. Add required loading, empty, and error states.

## Rules

- Admin only.
- Reuse existing vendor/user models and services.
- Do not create duplicate vendor data.
- Do not implement vendor-facing functionality.
- Do not modify unrelated modules.
- Do not add unnecessary dependencies.
- Do not commit or push.

If the existing vendor model or approval workflow is unclear, STOP and ask me.

## Done When

- Admin can view vendors.
- Admin can view vendor details.
- Admin can approve/reject vendors.
- Admin can activate/deactivate vendors.
- Backend authorization works.
- Frontend is connected to the backend.
- Design follows the existing reference.

## Final

Report files changed, APIs created/updated, UI implemented, and verification performed.

Set status to `DONE` only after successful verification.