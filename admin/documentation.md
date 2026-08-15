# Admin Module

## Purpose

Provide administrators with the tools required to manage and control the marketplace.

## V1 Scope

### Dashboard

Show basic marketplace information:

- Total customers
- Total vendors
- Total products
- Pending approvals

### Vendor Management

Admin can:

- View vendors
- View vendor details
- Approve vendors
- Reject vendors
- Activate/deactivate vendors

### Category Management

Admin can:

- Create categories
- Edit categories
- Activate/deactivate categories
- Manage vendor category requests

### Product Management

Admin can:

- View products
- View product details
- Approve products
- Reject products
- Activate/deactivate products

### User Management

Admin can:

- View users
- View user details
- Activate/deactivate users

## Authorization

Only users with the `admin` role can access admin functionality.

Backend authorization is the security boundary.

Admin actions must be authorized by the backend.

## Design

Use the existing HTML design reference:

`designs/`

Follow the existing:

- Font
- Colors
- Typography
- Spacing
- Components
- Layout style

Do not create a separate theme.

## V1 Rules

- Admin manages marketplace-level resources.
- Admin cannot change another user's role through normal management actions unless explicitly supported by a future requirement.
- Vendor data must remain associated with its vendor.
- Do not expose sensitive user information.
- Do not modify unrelated modules.

## Out of Scope

- Advanced analytics
- Reports
- Audit dashboard
- Advanced permissions
- Multi-admin permission levels
- Bulk operations
- Notifications

These can be added in future versions.