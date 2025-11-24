# Restaurant Ordering SaaS Platform

A multi-tenant SaaS backend boilerplate for restaurant ordering systems built with Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM. Each tenant operates with an isolated PostgreSQL database while a master database manages tenants, subscriptions, and authentication.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Language:** TypeScript 5
- **Database:** PostgreSQL (master + tenant databases)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) with `node-postgres`
- **Tooling:** ESLint, Prettier, Jest, ts-node-dev

## Project Structure

```
src/
├── app.ts
├── server.ts
├── core/
│   ├── config/
│   ├── constants/
│   ├── database/
│   │   ├── migrations/
│   │   └── schemas/
│   ├── exceptions/
│   ├── interfaces/
│   ├── middleware/
│   ├── types/
│   └── utils/
└── modules/
    ├── tenant-management/
    ├── subscription/
    ├── auth/
    ├── orders/
    ├── menu/
    ├── customers/
    ├── payments/
    └── restaurant/
```

- `core/` holds shared infrastructure (config, middleware, database connections, utils).
- `modules/` encapsulate business areas with controllers, services, repositories, DTOs, and routes.
- `src/app.ts` wires global middleware and routes, `src/server.ts` launches the HTTP server.

## Environment Setup

1. **Install dependencies**

```bash
npm install
```

2. **Copy environment variables**

```bash
cp .env.example .env
```

3. **Adjust the `.env` file** with database credentials, JWT secrets, and security values.

## Drizzle ORM

- Master schemas live in `src/core/database/schemas/master` (tenants, subscriptions, users).
- `drizzle.config.ts` loads credentials from `.env` and outputs SQL migrations to `src/core/database/migrations/master`.
- Run `npm run generate:master` to produce SQL migrations from the schema; `npm run migrate:master` applies them to the configured master database.
- `masterDb` (in `src/core/database/masterConnection.ts`) is a Drizzle client bound to the master pool.
- `tenantConnectionPool` provisions tenant-specific pools and wraps them with Drizzle for strongly typed access.

## API Docs

- Swagger UI is mounted at `http://localhost:3000/docs` (adjust port via `PORT`).
- Route handlers are documented via `@openapi` JSDoc blocks inside each module (e.g., `src/modules/auth/routes/auth.routes.ts`, `src/modules/orders/routes/order.routes.ts`, etc.).
- Update `src/core/config/swagger.config.ts` to extend metadata, schemas, or global security rules.

### Useful Commands

```bash
npm run dev             # Start dev server (ts-node-dev)
npm run build           # Transpile TypeScript
npm start               # Run compiled server
npm run lint            # ESLint
npm run format          # Prettier write
npm test                # Jest placeholder
npm run generate:master # Generate SQL from Drizzle schema
npm run migrate:master  # Apply master migrations
```

> Note: `npm install` / Drizzle CLI may require elevated permissions depending on your local Node/NPM setup (e.g., global NVM directories). If you encounter EPERM errors, adjust filesystem permissions or use a Node version manager with per-project installations.

## Multi-Tenancy Flow

1. Incoming requests include a tenant identifier (`x-tenant-id`, subdomain, or JWT claim).
2. `tenantResolver` middleware loads tenant context and attaches `req.tenantId`.
3. `TenantConnectionPool` returns a scoped Drizzle client per tenant for repositories/services.
4. Modules execute business logic against the tenant DB while master data (tenants, subscriptions, auth) stays isolated.

## Next Steps

- Flesh out module repositories with Drizzle queries.
- Implement tenant provisioning scripts (database creation, migrations, seeding).
- Add automated tests under `tests/` for core + modules.
- Configure CI/CD, monitoring, and deployment tooling per production checklist.

---
Built with ❤️ for restaurant businesses.
