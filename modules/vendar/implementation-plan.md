# Vendor Module — Implementation Plan

## Goal

Implement the V1 vendor area for profile, products, inventory, dashboard, and orders.

## Phase 1 — Foundation

- Verify vendor authentication and authorization.
- Verify vendor ownership rules.
- Inspect existing product and order structures.
- Reuse existing models and services.

## Phase 2 — Backend

Implement vendor APIs for:

- Dashboard
- Vendor profile
- Own products
- Inventory
- Product approval status
- Own orders

Every vendor resource must verify ownership on the backend.

## Phase 3 — Frontend

Create:

- Vendor layout/navigation
- Dashboard
- Profile
- Product management
- Inventory
- Order management

Follow the existing design reference.

## Phase 4 — Integration

Connect React screens to Laravel APIs.

Handle:

- Loading
- Empty states
- Errors
- Success actions
- Permission errors

## Phase 5 — Final Verification

Confirm:

- Vendor can access the vendor area.
- Non-vendors cannot access it.
- Vendor can manage only their own products.
- Vendor can manage only their own orders.
- Product approval status is shown.
- Frontend and backend work together.
- Design follows the reference.

Manual testing will be performed by the project owner.

## Rules

- Reuse authentication.
- Do not duplicate product business logic.
- Do not implement admin/customer functionality.
- Do not implement vendor coupons here.
- Do not modify unrelated modules.
- If anything is unclear, stop and ask.