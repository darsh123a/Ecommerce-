# Authentication Module

## 1. Purpose

The Authentication module provides secure sign-in and access control for customers, vendors, and administrators.

Authentication is shared across the application.

---

## 2. V1 Scope

V1 includes:

- Customer sign-in
- Vendor sign-in
- Admin sign-in
- Logout
- Authentication state
- Protected routes
- Role-based authorization

V1 does not include:

- Customer registration
- Vendor registration
- Password reset
- Social login
- Email verification
- Two-factor authentication
- Phone authentication

These can be added in future versions.

---

## 3. User Model

The application uses one common `users` table for authentication.

Each user has a role.

Supported roles:

- Customer
- Vendor
- Admin

Conceptually:

User
├── Customer
├── Vendor
└── Admin

Role-specific information can be stored in separate profile/entities when required.

Authentication credentials remain centralized in the `users` table.

---

## 4. User Ownership

A user belongs to one authentication role in V1.

A vendor can manage only resources belonging to that vendor.

A customer can access only their own customer-specific resources.

An admin can manage marketplace-level resources according to administrative permissions.

Authorization must always be enforced by the backend.

Frontend route protection alone is not considered security.

---

## 5. Sign-In

The user provides:

- Email
- Password

The backend validates the credentials.

Successful authentication returns the authentication state required by the frontend.

The frontend stores the authenticated state securely and uses it for subsequent API requests.

---

## 6. Sign-In Flow

```text
User
  ↓
Login Screen
  ↓
Authentication API
  ↓
Validate credentials
  ↓
Find user
  ↓
Validate password
  ↓
Check user status
  ↓
Return authenticated response
  ↓
Frontend stores authentication state
  ↓
User enters authorized application area