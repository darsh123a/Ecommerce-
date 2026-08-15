# Vendor Module

## Purpose

Provide vendors with the functionality required to manage their marketplace business.

## V1 Scope

### Dashboard

Show:

- Total products
- Active products
- Pending products
- Vendor orders

### Vendor Profile

Vendor can:

- View profile
- Edit allowed profile/business information

### Product Management

Vendor can:

- View own products
- Add products
- Edit own products
- Manage inventory
- Submit products for admin approval
- View approval status

Vendors can only manage products they own.

### Order Management

Vendor can:

- View own orders
- View order details
- Update allowed order statuses

Vendors can only access orders containing their products.

## Authorization

Only users with the `vendor` role can access vendor functionality.

Backend authorization must verify vendor ownership for vendor-owned resources.

## Design

Use the existing HTML reference in:

`designs/`

Follow its:

- Font
- Colors
- Typography
- Spacing
- Components
- Layout

Do not create a separate theme.

## V1 Rules

- Vendor can access only their own resources.
- Vendor cannot access admin functionality.
- Vendor cannot manage another vendor's products.
- Vendor cannot access another vendor's orders.
- Product approval is controlled by Admin.
- Vendor-specific coupons are handled by the Coupon module.

## Out of Scope

- Vendor reviews
- Advanced analytics
- Vendor payouts
- Vendor subscriptions
- Bulk product operations
- Vendor-to-vendor communication