# VENDOR-005 — Vendor Inventory

## Status
DONE

## Read
- modules/vendor/documentation.md
- modules/vendor/implementation-plan.md
- modules/vendor/tasks/VENDOR-004.md

## Goal
Allow vendors to manage inventory for their own products.

## Steps
1. Inspect the existing product/inventory structure.
2. Reuse existing inventory logic where available.
3. Create required inventory APIs.
4. Enforce vendor ownership.
5. Create inventory UI.
6. Connect frontend to API.
7. Follow the design reference.

## Rules
- Vendor can update inventory only for owned products.
- Do not modify another vendor's inventory.
- Do not create duplicate inventory logic.
- Do not modify unrelated modules.
- Do not commit or push.

If inventory architecture is unclear, STOP and ask.

## Done When
- Vendor can view inventory.
- Vendor can update inventory.
- Ownership is enforced.
- Frontend/backend integration works.

Report files changed and verification performed.
Set status to DONE after verification.