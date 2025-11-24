# Restaurant SAAS Backend Overview

## What is this app?

This application is a multi-tenant Restaurant Software-as-a-Service (SAAS) backend. It provides core backend services for restaurant management, allowing multiple restaurants (tenants) to use the platform independently. Each tenant has isolated data and can manage their own customers, menu, orders, payments, subscriptions, and more.

## Key Features

- **Multi-Tenant Architecture:** Each restaurant operates in its own isolated environment.
- **Authentication & Authorization:** Secure login, registration, and role-based access control.
- **Customer Management:** CRUD operations for restaurant customers.
- **Menu Management:** Manage food and beverage items, categories, and pricing.
- **Order Management:** Create, update, and track orders.
- **Payment Processing:** Integrate with payment gateways for order payments.
- **Subscription Plans:** Manage restaurant subscriptions and billing.
- **Tenant Management:** Onboard new restaurants, manage tenant settings, and resolve tenant context per request.
- **API Documentation:** Swagger/OpenAPI support for easy API exploration.

## How does it work?

1. **Tenant Onboarding:** Restaurants sign up and are provisioned as tenants with isolated databases.
2. **Authentication:** Users (restaurant staff/admins) authenticate via secure endpoints.
3. **Core Modules:** Each module (auth, customers, menu, orders, payments, etc.) provides RESTful APIs for managing respective resources.
4. **Request Routing:** Middleware resolves tenant context for each request, ensuring data isolation.
5. **Business Logic:** Services implement business rules, validation, and data processing.
6. **Database Layer:** Uses connection pools and schema separation for master/tenant data.
7. **Error Handling:** Centralized exception handling and error codes for consistent API responses.

## Technologies Used

- **Node.js & TypeScript**
- **Express.js**
- **Drizzle ORM**
- **Swagger (OpenAPI)**
- **JWT Authentication**
- **Modular Architecture**

## Folder Structure

- `src/core`: Core configuration, database, exceptions, interfaces, middleware, types, and utilities.
- `src/modules`: Feature modules for auth, customers, menu, orders, payments, restaurant, subscription, tenant-management.
- `tests`: Unit, integration, and e2e tests.

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment variables in `src/core/config/env.config.ts`
3. Run migrations and start the server: `npm start`
4. Access API documentation at `/api/docs` (if enabled)

## API Endpoints

- Auth: `/api/auth/*`
- Customers: `/api/customers/*`
- Menu: `/api/menu/*`
- Orders: `/api/orders/*`
- Payments: `/api/payments/*`
- Restaurant: `/api/restaurant/*`
- Subscription: `/api/subscription/*`
- Tenant Management: `/api/tenant-management/*`

## Contributing

See `docs/contributing.md` for guidelines.

## License

See `LICENSE` file for details.
