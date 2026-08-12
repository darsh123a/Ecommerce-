# Multi-Vendor E-Commerce Platform — System Architecture

**Document Status:** Draft
**Architecture Version:** 1.0
**Scope:** System-level architecture
**Technology:** PHP + React
**Purpose:** Source of truth for module-level architecture and implementation planning

---

## 1. Architecture Objective

Build a production-grade multi-vendor e-commerce marketplace where:

* Customers browse products and purchase through the marketplace.
* Vendors manage their own products, inventory, orders, shipping, coupons, and storefront.
* Admin controls marketplace-wide operations and moderation.
* Multiple vendors can participate in a single customer checkout.
* The architecture remains extensible for future commission, automated payouts, returns, notifications, advanced search, and logistics.

The initial implementation should avoid unnecessary infrastructure complexity while keeping the domain model extensible.

---

# 2. Actors

## Customer

Customers can:

* Browse marketplace products
* Register/login
* Manage profile
* Manage addresses
* Add products to cart
* Checkout
* Place orders
* Track orders
* Cancel eligible vendor orders/items
* Request applicable refunds
* Manage wishlist
* Review purchased products

Customers must be authenticated to purchase.

---

## Vendor

Vendors can:

* Register
* Submit vendor information
* Wait for admin approval
* Manage their store
* Create products
* Create product variants
* Manage inventory
* Submit products for approval
* Manage approved products
* Manage vendor orders
* Manage shipping
* Create vendor-specific coupons
* View earnings/settlement information

A vendor can only manage its own resources.

---

## Admin

Admin has global marketplace control.

Admin can:

* Approve/reject vendors
* Suspend vendors
* Manage products
* Approve/reject products
* Manage categories
* Review category proposals
* Manage orders
* Manage coupons
* Moderate product reviews
* Manage marketplace configuration

---

# 3. High-Level System

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │    React Frontend   │
                         └──────────┬──────────┘
                                    │
                              HTTP / API
                                    │
                         ┌──────────▼──────────┐
                         │    PHP Backend      │
                         │    Application      │
                         └──────────┬──────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
     Business Modules          Authentication            Services
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │      Database       │
                         └─────────────────────┘
```

External services such as payment providers, email, storage, and future search infrastructure will be integrated through service abstractions.

---

# 4. Architectural Style

## Initial Architecture

Use a **modular monolith**.

```text
React
   │
   ▼
PHP Application
   │
   ├── Authentication
   ├── Customer
   ├── Vendor
   ├── Catalog
   ├── Product
   ├── Inventory
   ├── Cart
   ├── Checkout
   ├── Order
   ├── Payment
   ├── Shipping
   ├── Tax
   ├── Coupon
   ├── Review
   ├── Wishlist
   ├── Admin
   └── Search
          │
          ▼
       Database
```

We will **not start with microservices**.

The system should be modular internally so individual components can later be extracted if scale requires it.

---

# 5. Core Architectural Principle

The system follows:

> **Build the correct domain boundaries first; introduce infrastructure complexity only when required.**

Therefore V1 will avoid prematurely introducing:

* Microservices
* Kafka
* Elasticsearch/OpenSearch
* Redis
* Kubernetes
* Dedicated event infrastructure
* Complex warehouse management
* Advanced tax engines

These can be introduced when actual requirements justify them.

---

# 6. Marketplace Business Model

The marketplace allows multiple independent vendors.

```text
Marketplace
│
├── Vendor A
│   ├── Products
│   ├── Inventory
│   ├── Orders
│   └── Store
│
├── Vendor B
│   ├── Products
│   ├── Inventory
│   ├── Orders
│   └── Store
│
└── Vendor C
    ├── Products
    ├── Inventory
    ├── Orders
    └── Store
```

Each vendor owns its own product listings.

Vendors cannot directly manage another vendor's products.

---

# 7. Product Ownership Model

For V1:

> A product belongs to exactly one vendor.

```text
Vendor
   │
   └── Product
```

Multiple vendors may independently sell the same real-world product, but those are separate marketplace product records.

We are intentionally **not implementing a shared Amazon-style product catalog/offer model in V1**.

Future architecture can introduce:

```text
Canonical Product
       │
       ├── Vendor Listing A
       ├── Vendor Listing B
       └── Vendor Listing C
```

if required.

---

# 8. Product Architecture

```text
Product
│
├── Vendor
├── Category
├── Product Information
├── Images
├── Variants
├── Inventory
├── Approval Status
└── Publication Status
```

Product-level information includes:

* Name
* Description
* Brand
* Category
* Images
* General specifications

---

# 9. Product Variants

Products support variants.

```text
Product
│
├── Variant A
│   ├── SKU
│   ├── Price
│   ├── Inventory
│   └── Attributes
│
├── Variant B
│   ├── SKU
│   ├── Price
│   ├── Inventory
│   └── Attributes
│
└── Variant C
```

Examples:

```text
Clothing → Size + Color
Shoes    → Size + Color
Laptop   → RAM + Storage
Phone    → Storage + Color
```

Attributes should be configurable rather than hard-coded to only size/color.

Products without meaningful variants can use a default variant so inventory and order processing remain consistent.

---

# 10. Product Approval

Vendor-created products do not immediately become customer-visible.

```text
Draft
  ↓
Pending Review
  ↓
Admin Review
  ├── Rejected
  │      ↓
  │   Vendor edits
  │      ↓
  │   Resubmit
  │
  └── Approved
         ↓
      Published
```

Approval and publication are separate concepts.

---

# 11. Category Architecture

Categories are marketplace-wide.

```text
Category
│
├── Parent Category
│
└── Child Categories
```

Admin owns the global category taxonomy.

Vendors can:

```text
Vendor
  ↓
Propose Category
  ↓
Admin Review
  ├── Reject
  └── Approve
        ↓
Global Category
```

Vendors select approved categories when creating products.

---

# 12. Vendor Architecture

```text
Vendor
│
├── Account
├── Store
├── Products
├── Inventory
├── Orders
├── Shipping
├── Coupons
└── Settlement Information
```

Vendor lifecycle:

```text
Registered
    ↓
Pending Approval
    ↓
Approved
    ↓
Active
    ↓
Suspended / Deactivated
```

Only approved/active vendors can sell products.

---

# 13. Vendor Storefront

Each vendor has a basic public storefront.

```text
Vendor Store
├── Store Name
├── Logo
├── Description
├── Basic Information
└── Approved Products
```

Advanced customization is deferred.

Future possibilities:

* Custom themes
* Store builder
* Custom pages
* Vendor domains
* Advanced storefront analytics

---

# 14. Authentication & Authorization

Authentication is centralized.

```text
React
   ↓
Authentication API
   ↓
Identity
   ↓
Authorization
```

Roles:

```text
Customer
Vendor
Admin
```

Authorization must be enforced server-side.

A vendor must never be able to access another vendor's resources by manipulating an ID.

Example:

```text
Vendor A
   ↓
Product A
   ↓
Allowed

Vendor A
   ↓
Product B owned by Vendor B
   ↓
Forbidden
```

Object-level authorization is mandatory.

---

# 15. Cart Architecture

A customer can add products from multiple vendors to one cart.

```text
Customer Cart
│
├── Vendor A
│   ├── Product A
│   └── Product B
│
├── Vendor B
│   └── Product C
│
└── Vendor C
    └── Product D
```

The cart is associated with the authenticated customer.

---

# 16. Checkout Architecture

The marketplace supports unified multi-vendor checkout.

```text
Cart
 ↓
Checkout
 ↓
Validate Products
 ↓
Validate Inventory
 ↓
Calculate Discounts
 ↓
Calculate Vendor Shipping
 ↓
Calculate Taxes
 ↓
Calculate Total
 ↓
Payment
 ↓
Create Order
```

Customer sees one checkout.

---

# 17. Order Architecture

A customer checkout creates:

```text
Parent Order
│
├── Vendor Order A
│
├── Vendor Order B
│
└── Vendor Order C
```

The parent order represents the customer's overall purchase.

Vendor orders represent each vendor's independent fulfillment responsibility.

This separation is a core marketplace architecture decision.

---

# 18. Order Lifecycle

Parent order:

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Completed
```

Vendor order:

```text
Pending
   ↓
Accepted
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
```

Cancellation and refund states are maintained separately.

The parent order can become partially cancelled:

```text
Parent Order
├── Vendor A → Completed
├── Vendor B → Cancelled
└── Vendor C → Processing
```

---

# 19. Cancellation & Refund

V1 supports:

* Vendor-order cancellation
* Item-level cancellation
* Partial refunds
* Full refunds

Refund information is recorded independently from the original payment.

```text
Payment
│
├── Original Payment
│
└── Refunds
    ├── Refund A
    └── Refund B
```

Returns/RMA are deferred to a future version.

---

# 20. Payment Architecture

Customer performs one payment for the complete checkout.

```text
Customer
   ↓
Checkout
   ↓
One Payment
   ↓
Parent Order
   ├── Vendor Order A
   ├── Vendor Order B
   └── Vendor Order C
```

Internally, payment allocation is associated with vendor orders.

The system should maintain:

```text
Payment
├── Amount
├── Currency
├── Status
├── Provider Reference
└── Refunds
```

Payment provider implementation must be isolated behind a payment service abstraction.

The actual provider will be selected during the Payment module architecture phase.

---

# 21. Commission Architecture

V1 marketplace commission:

```text
0%
```

However, financial records must be future-ready.

Future:

```text
Order Amount
│
├── Vendor Amount
└── Platform Commission
```

Potential future commission models:

* Percentage
* Fixed
* Hybrid
* Vendor/category-specific rules

Commission calculation is deferred from V1 business logic but supported conceptually by the financial model.

---

# 22. Vendor Settlement

V1 does not require automated vendor payouts.

The system records vendor financial information:

```text
Vendor
   ↓
Vendor Orders
   ↓
Vendor Earnings
   ↓
Settlement
```

Initial settlement can be handled manually/off-platform.

Future:

```text
Vendor Earnings
   ↓
Payment Provider
   ↓
Automated Payout
```

---

# 23. Shipping Architecture

Shipping is vendor-specific.

```text
Vendor Order A
├── Items
└── Shipping: ₹50

Vendor Order B
├── Items
└── Shipping: ₹80
```

Customer sees:

```text
Vendor A Shipping → ₹50
Vendor B Shipping → ₹80

Total Shipping → ₹130
```

Vendors initially manage fulfillment.

Future carrier integrations can be added behind a shipping service abstraction.

---

# 24. Inventory Architecture

Inventory belongs to the vendor's product/variant.

```text
Product
   ↓
Variant
   ↓
Inventory
```

Inventory should support:

```text
Stock Quantity
Reserved Quantity
Available Quantity
```

Conceptually:

```text
Available = Stock - Reserved
```

Reservation logic prevents overselling during checkout.

V1 does not include warehouse/location management.

Future:

```text
Product
   ↓
Inventory
   ├── Warehouse A
   ├── Warehouse B
   └── Warehouse C
```

---

# 25. Tax Architecture

Tax is calculated at item/vendor-order level.

```text
Order Item
├── Price
├── Quantity
├── Discount
├── Tax
└── Total
```

Vendor order aggregates item-level tax.

Parent order aggregates all vendor-order tax amounts.

V1 uses a simple configurable tax model.

Advanced tax jurisdiction/automation is deferred.

---

# 26. Coupon Architecture

Coupons are vendor-owned.

```text
Vendor
   ↓
Coupon
   ↓
Vendor Products / Categories
```

A vendor's coupon cannot modify another vendor's products.

Example:

```text
Vendor A
Subtotal: ₹800
Coupon:   -₹100

Vendor B
Subtotal: ₹700
Coupon:       ₹0
```

Platform-wide coupons are deferred.

---

# 27. Review Architecture

V1 supports product reviews only.

```text
Customer
   ↓
Completed Purchase
   ↓
Product Review
   ├── Rating
   ├── Comment
   └── Product
```

A customer can review only an eligible purchased product.

Admin can moderate reviews.

Vendor/seller ratings are deferred.

---

# 28. Wishlist Architecture

Wishlist belongs to the authenticated customer.

```text
Customer
   ↓
Wishlist
   ↓
Products
```

V1 supports:

* Add product
* Remove product
* View wishlist
* Add/move product to cart
* Availability indication

Advanced wishlist functionality is deferred.

---

# 29. Search Architecture

V1 uses database-based search.

```text
Customer
   ↓
Search API
   ↓
Database
   ↓
Approved + Published Products
```

Initial search capabilities:

* Keyword search
* Product name
* Description
* SKU
* Brand
* Category
* Basic filters
* Sorting
* Availability

The application should expose a search abstraction so a dedicated search engine can be introduced later.

Future:

```text
Database
   ↓
Search Index
   ↓
OpenSearch / Elasticsearch
```

---

# 30. Notifications

Notification infrastructure is intentionally deferred.

Future architecture:

```text
Business Event
      ↓
Notification Service
      ├── In-App
      ├── Email
      ├── Push
      └── SMS
```

No notification infrastructure is required for the initial architecture.

---

# 31. Data Architecture

The primary relational database is the system's source of truth.

Major domain areas:

```text
Identity
├── Users
├── Roles
└── Permissions

Marketplace
├── Vendors
├── Stores
└── Vendor Users

Catalog
├── Products
├── Variants
├── Categories
├── Attributes
└── Product Images

Commerce
├── Carts
├── Cart Items
├── Orders
├── Vendor Orders
└── Order Items

Financial
├── Payments
├── Payment Allocations
├── Refunds
├── Vendor Earnings
└── Settlements

Commerce Support
├── Shipping
├── Taxes
├── Coupons
├── Reviews
└── Wishlists
```

Exact database tables will be defined during module-level architecture.

---

# 32. API Architecture

React communicates with the PHP backend through APIs.

```text
React
  ↓
HTTP API
  ↓
Controller
  ↓
Application Service
  ↓
Domain/Business Logic
  ↓
Repository/Data Access
  ↓
Database
```

Controllers should remain thin.

Business rules should not be implemented directly inside controllers.

---

# 33. Module Boundaries

Initial logical modules:

```text
Authentication
Customer
Vendor
Admin
Catalog
Product
Category
Inventory
Cart
Checkout
Order
Payment
Shipping
Tax
Coupon
Review
Wishlist
Search
```

These are **logical boundaries inside the modular monolith**, not separate applications.

---

# 34. Security Architecture

Security is a system-level requirement.

Mandatory principles:

* Server-side authorization
* Object-level authorization
* Vendor resource isolation
* Input validation
* Output validation where appropriate
* Password hashing using framework-supported secure algorithms
* Secure authentication/session/token handling
* CSRF protection where applicable
* Rate limiting for sensitive endpoints
* Secure file upload validation
* Secure secrets management
* No secrets committed to source control
* Audit-sensitive administrative actions
* Parameterized database access
* Proper API error handling without leaking internals

Security requirements will be expanded during module architecture.

---

# 35. Scalability Strategy

V1 prioritizes simplicity.

Initial:

```text
React
   ↓
PHP Application
   ↓
Relational Database
```

As requirements grow:

```text
                 ┌── Cache
                 │
React → API → Application → Database
                 │
                 ├── Search Engine
                 │
                 ├── Queue
                 │
                 ├── Object Storage
                 │
                 └── External Services
```

Infrastructure should be introduced based on measurable requirements rather than speculation.

---

# 36. Future Architecture Extensions

The system is intentionally designed to allow:

```text
Future
├── Platform commission
├── Automated vendor payouts
├── Returns / RMA
├── Vendor ratings
├── Notifications
├── Advanced search
├── Search engine
├── Warehouse management
├── Carrier integrations
├── Advanced tax engine
├── Platform-wide promotions
├── Vendor staff accounts
├── Advanced analytics
├── Recommendation engine
└── Shared canonical product catalog
```

These are not part of the initial implementation unless separately approved.

---

# 37. V1 Scope Philosophy

The project follows:

> **Production-grade architecture, controlled V1 scope.**

We will not build future features merely because the architecture could support them.

Instead:

```text
System Architecture
       ↓
Module Architecture
       ↓
Module Requirements
       ↓
Implementation Plan
       ↓
Jira Task
       ↓
Implementation
```

Each module is designed only when development begins on that module.

---

# 38. Architectural Decision Summary

| #  | Decision            | V1 Direction                             |
| -- | ------------------- | ---------------------------------------- |
| 1  | Checkout            | Unified multi-vendor checkout            |
| 2  | Order model         | Parent Order → Vendor Orders             |
| 3  | Fulfillment         | Vendor-managed                           |
| 4  | Commission          | 0% initially                             |
| 5  | Vendor onboarding   | Admin approval                           |
| 6  | Product ownership   | Vendor-owned                             |
| 7  | Product approval    | Admin approval                           |
| 8  | Variants            | Supported                                |
| 9  | Categories          | Global admin taxonomy + vendor proposals |
| 10 | Customer purchase   | Sign-in required                         |
| 11 | Payment             | One payment per checkout                 |
| 12 | Cancellation/refund | Vendor-order/item level                  |
| 13 | Returns             | Future                                   |
| 14 | Vendor payout       | Manual initially                         |
| 15 | Shipping            | Vendor-specific                          |
| 16 | Tax                 | Item/vendor-order level                  |
| 17 | Coupons             | Vendor-specific                          |
| 18 | Reviews             | Product reviews only                     |
| 19 | Wishlist            | V1                                       |
| 20 | Search              | Database-based                           |
| 21 | Notifications       | Future                                   |
| 22 | Vendor storefront   | Basic V1                                 |
| 23 | Admin               | Global management/moderation             |

---

# 39. Development Governance

This document is the **system-level source of truth**.

We do not directly start implementing modules from this document.

When development begins for a module:

```text
System Architecture
        ↓
Select Module
        ↓
Research Existing Industry Patterns
        ↓
Analyze Existing Project Code
        ↓
Identify Module Requirements
        ↓
Create Module Architecture
        ↓
Create Implementation Plan
        ↓
Review / Approval
        ↓
Create Jira Task
        ↓
Implementation
        ↓
Testing
        ↓
Code Review
```

The module architecture and plan should reference this system architecture rather than contradict it.

If a module requires a change to a system-level architectural decision, the system architecture must be updated before implementation proceeds.

---

# 40. Current Status

```text
Technology Stack
        ✓ Defined

Business Architecture Discovery
        ✓ Complete

System Architecture
        ✓ Drafted

Module Architecture
        ⏳ Not started

Implementation Plans
        ⏳ Not started

Jira Tasks
        ⏳ Not started

Implementation
        ⏳ Not started
```

**Next phase:** Select the first module, research how that module is implemented in established e-commerce systems, analyze its requirements, and create its dedicated module architecture before creating the Jira implementation task.
