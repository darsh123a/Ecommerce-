# ADMIN-005 — Product Management

## Status
DONE

## Read

- modules/admin/documentation.md
- modules/admin/implementation-plan.md
- modules/admin/tasks/ADMIN-001.md

## Goal

Implement V1 product management for admins.

## Requirements

Admin can:

- View products
- View product details
- Approve products
- Reject products
- Activate/deactivate products

## Steps

1. Inspect the existing product structure.
2. Reuse existing product/vendor models where possible.
3. Create required backend APIs.
4. Protect APIs with admin authorization.
5. Create the product management UI.
6. Connect the UI to the APIs.
7. Add loading, empty, and error states.
8. Follow the existing design reference.

## Rules

- Admin only.
- Preserve product ownership by vendor.
- Do not implement vendor product creation/editing.
- Do not implement customer product browsing.
- Do not modify unrelated modules.
- Do not add unnecessary dependencies.
- Do not commit or push.

If the existing product structure or approval workflow is unclear, STOP and ask me.

## Done When

- Admin can view products.
- Admin can view product details.
- Admin can approve/reject products.
- Admin can activate/deactivate products.
- Vendor ownership remains intact.
- Backend authorization works.
- Frontend is connected to the backend.
- Design follows the existing reference.

## Final

Report files changed, APIs created/updated, UI implemented, and verification performed.

Set status to `DONE` only after successful verification.