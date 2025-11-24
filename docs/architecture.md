# Architecture Overview

## Multi-Tenant Design

- Each restaurant (tenant) has isolated data and resources.
- Tenant context is resolved per request using middleware.
- Master database stores global data; tenant databases store restaurant-specific data.

## Core Layers

- **Configuration:** Centralized config for app, database, environment, and Swagger.
- **Database:** Connection pools, schema separation, migrations for master/tenant.
- **Middleware:** Handles authentication, authorization, error handling, tenant resolution, and validation.
- **Exceptions:** Custom error classes for consistent error handling.
- **Interfaces & Types:** Define contracts for controllers, services, repositories, and common types.
- **Utilities:** Logging, encryption, response formatting, and validation helpers.

## Modules

- **Auth:** User registration, login, JWT, and role management.
- **Customers:** CRUD for customer profiles.
- **Menu:** Manage menu items and categories.
- **Orders:** Order creation, updates, tracking, and validation.
- **Payments:** Payment processing and integration.
- **Restaurant:** Restaurant profile and settings.
- **Subscription:** Subscription plans and billing.
- **Tenant Management:** Onboarding, settings, and context resolution.

## Request Flow

1. **Incoming Request:** Passes through middleware (auth, tenant resolver, etc.).
2. **Controller:** Handles request and delegates to service.
3. **Service:** Implements business logic and interacts with repositories.
4. **Repository:** Handles database operations.
5. **Response:** Formatted and returned to client.

## Error Handling

- Centralized error handler middleware.
- Custom exceptions for database, HTTP, and business logic errors.
- Standardized error codes and messages.

## Security

- JWT-based authentication.
- Role-based access control.
- Data isolation per tenant.

## Extensibility

- Modular structure allows easy addition of new features.
- Clear separation of concerns for maintainability.

---

See `docs/overview.md` for general app info and `docs/contributing.md` for contribution guidelines.
