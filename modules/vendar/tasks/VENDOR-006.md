# VENDOR-006 — Vendor Order Management

## Status
TODO

## Read
- modules/vendor/documentation.md
- modules/vendor/implementation-plan.md
- modules/vendor/tasks/VENDOR-001.md

## Goal
Allow vendors to view and manage their own orders.

## Requirements
Vendor can:
- View own orders
- View order details
- Update allowed order statuses

## Steps
1. Inspect the existing order structure.
2. Create/reuse vendor order APIs.
3. Ensure vendors see only orders containing their products.
4. Enforce ownership at the backend.
5. Create order management UI.
6. Connect frontend to API.
7. Follow the design reference.

## Rules
- Vendor cannot access another vendor's order data.
- Vendor can update only allowed statuses.
- Do not implement refunds/cancellations at vendor/item level in V1.
- Do not modify unrelated modules.
- Do not commit or push.

If the order ownership/status rules are unclear, STOP and ask.

## Done When
- Vendor can view own orders.
- Vendor can view order details.
- Allowed status updates work.
- Ownership is enforced.
- Frontend/backend integration works.

Report files changed and verification performed.
Set status to DONE after verification.