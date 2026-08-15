# VENDOR-003 — Vendor Profile

## Status
DONE

## Read
- modules/vendor/documentation.md
- modules/vendor/implementation-plan.md
- modules/vendor/tasks/VENDOR-001.md

## Goal
Implement vendor profile viewing and editing.

## Requirements
Vendor can:
- View own profile
- Edit allowed profile/business information

## Steps
1. Inspect existing user/vendor structure.
2. Create/update backend profile API.
3. Enforce vendor ownership.
4. Create profile UI.
5. Connect UI to API.
6. Add validation and error handling.

## Rules
- Vendor can only edit their own profile.
- Do not allow role changes.
- Do not expose sensitive authentication data.
- Do not modify unrelated modules.
- Do not commit or push.

If anything is unclear, STOP and ask.

## Done When
- Vendor can view profile.
- Vendor can edit allowed information.
- Ownership is enforced.
- Frontend/backend integration works.
- Design follows the reference.

Report files changed and verification performed.
Set status to DONE after verification.