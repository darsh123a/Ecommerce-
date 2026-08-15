# VENDOR-004 — Vendor Product Management

## Status
DONE

## Read
- modules/vendor/documentation.md
- modules/vendor/implementation-plan.md
- modules/vendor/tasks/VENDOR-001.md

## Goal
Allow vendors to manage their own products.

## Requirements
Vendor can:
- View own products
- Add products
- Edit own products
- Submit products for approval
- View approval status

## Steps
1. Inspect the existing product structure.
2. Reuse the Product module structure where available.
3. Create vendor product APIs.
4. Enforce vendor ownership.
5. Create product management UI.
6. Connect frontend to APIs.
7. Follow the design reference.

## Rules
- Vendor can only access their own products.
- Do not allow vendor to approve their own products.
- Product approval belongs to Admin.
- Do not duplicate product business logic.
- Do not modify unrelated modules.
- Do not commit or push.

If the product structure is unclear, STOP and ask.

## Done When
- Vendor can manage own products.
- Ownership is enforced.
- Product submission works.
- Approval status is displayed.
- Frontend/backend integration works.

Report files changed and verification performed.
Set status to DONE after verification.