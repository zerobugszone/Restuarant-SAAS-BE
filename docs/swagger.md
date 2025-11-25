# Swagger API Documentation

This backend uses Swagger (OpenAPI) for documenting all REST endpoints. The Swagger UI is available at `/api/docs` when the server is running.

## Authentication

- JWT-based authentication is required for most endpoints.
- Roles: Admin, Manager, Waiter, Chef, Cashier
- Permissions are enforced per route using middleware.

## Main Modules & Endpoints

- **Tenant Management**: `/api/tenant-management/*`
- **Subscriptions**: `/api/subscription/*`
- **Authentication**: `/api/auth/*`
- **Menu**: `/api/menu/*`
- **Tables**: `/api/tables/*`
- **Orders**: `/api/orders/*`
- **Payments**: `/api/payments/*`
- **Customers**: `/api/customers/*`
- **QR Codes**: `/api/qr/*`
- **Analytics & Reports**: `/api/analytics/*`

## How to Use

- Authenticate via `/api/auth/login` to receive a JWT token.
- Pass the token in the `Authorization: Bearer <token>` header for protected endpoints.
- Explore and test endpoints using Swagger UI.

## Example Swagger Setup

Swagger is configured in `src/core/config/swagger.config.ts` and loaded in `app.ts`.

---

For details on each endpoint, see the generated Swagger UI or the OpenAPI spec file.
