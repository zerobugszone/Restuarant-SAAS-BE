# Database Migration System

This document describes the enhanced database migration system for the Restaurant SAAS multi-tenant application.

## Overview

The application uses a **multi-tenant architecture** with:
- **Master Database**: Stores tenant metadata and application-wide data
- **Tenant Databases**: Separate database per tenant for data isolation

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Migration Manager                         │
│  (src/core/database/migrationManager.ts)                    │
│                                                              │
│  - Database creation                                         │
│  - Migration execution                                       │
│  - Error handling & logging                                  │
│  - Batch operations                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                      ┌──────────────────┐
│  Master Database │                      │ Tenant Databases │
│                  │                      │                  │
│  - Tenants       │                      │  - Orders        │
│  - Users         │                      │  - Products      │
│  - Settings      │                      │  - Customers     │
└──────────────────┘                      └──────────────────┘
```

## Directory Structure

```
src/core/database/
├── migrations/
│   ├── master/          # Master DB migrations
│   │   └── meta/
│   └── tenant/          # Tenant DB migrations
│       └── meta/
├── schemas/
│   ├── master/          # Master DB schemas
│   └── tenant/          # Tenant DB schemas
├── migrationManager.ts  # Core migration logic
├── ensureDatabase.ts    # Legacy compatibility layer
├── masterConnection.ts
└── tenantConnectionPool.ts

scripts/
├── migrate-master.ts         # Migrate master DB
├── migrate-tenant.ts         # Migrate single tenant
├── migrate-all-tenants.ts    # Migrate all tenants
├── db-setup.ts              # Initial setup
├── db-reset.ts              # Reset all databases
└── migrate_tenants.ts       # (deprecated)

drizzle.config.ts            # Master DB config
drizzle.tenant.config.ts     # Tenant DB config
```

## Available Commands

### Migration Commands

#### 1. Migrate Master Database
```bash
npm run migrate:master
```
Creates and migrates the master database.

#### 2. Migrate Single Tenant
```bash
npm run migrate:tenant -- <tenantId> [databaseName]
```
Creates and migrates a specific tenant database.

**Examples:**
```bash
npm run migrate:tenant -- abc-123
npm run migrate:tenant -- abc-123 custom_tenant_db
```

#### 3. Migrate All Tenants
```bash
npm run migrate:all-tenants
```
Migrates all tenant databases (fetches list from master DB).

**Options:**
```bash
npm run migrate:all-tenants -- --parallel    # Run in parallel (faster)
npm run migrate:all-tenants -- --continue    # Continue on error
```

#### 4. Database Setup (Initial Setup)
```bash
npm run db:setup
```
Sets up the entire database infrastructure:
1. Creates and migrates master database
2. Creates and migrates all tenant databases

**Options:**
```bash
npm run db:setup -- --skip-master     # Skip master DB
npm run db:setup -- --skip-tenants    # Skip tenant DBs
```

#### 5. Database Reset (⚠️ Destructive)
```bash
npm run db:reset -- --confirm
```
**WARNING**: Drops and recreates all databases!

**Options:**
```bash
npm run db:reset -- --confirm --master-only    # Only reset master
npm run db:reset -- --confirm --tenants-only   # Only reset tenants
```

### Schema Generation Commands

#### Generate Master Migrations
```bash
npm run generate:master
```
Generates migration files for master database schema changes.

#### Generate Tenant Migrations
```bash
npm run generate:tenant
```
Generates migration files for tenant database schema changes.

## Usage Workflows

### Initial Project Setup

```bash
# 1. Generate master migrations (if not already done)
npm run generate:master

# 2. Generate tenant migrations (if not already done)
npm run generate:tenant

# 3. Setup all databases
npm run db:setup
```

### Adding a New Tenant

```bash
# Option 1: Use the tenant creation script
npm run tenant:create

# Option 2: Manually migrate after creating tenant record
npm run migrate:tenant -- <tenantId>
```

### Schema Changes

#### Master Schema Changes
```bash
# 1. Modify schema files in src/core/database/schemas/master/
# 2. Generate migrations
npm run generate:master

# 3. Apply migrations
npm run migrate:master
```

#### Tenant Schema Changes
```bash
# 1. Modify schema files in src/core/database/schemas/tenant/
# 2. Generate migrations
npm run generate:tenant

# 3. Apply to all tenants
npm run migrate:all-tenants
```

### Development Reset
```bash
# Reset everything and start fresh
npm run db:reset -- --confirm
npm run db:setup
```

## Migration Manager API

The `MigrationManager` class provides programmatic access to migration operations:

```typescript
import { migrationManager } from '@/core/database/migrationManager';

// Check if database exists
const exists = await migrationManager.databaseExists('my_database');

// Create database
await migrationManager.createDatabase('my_database');

// Run migrations
const result = await migrationManager.runMigrations(
  'my_database',
  'src/core/database/migrations/tenant'
);

// Migrate master
const masterResult = await migrationManager.migrateMaster();

// Migrate tenant
const tenantResult = await migrationManager.migrateTenant('tenant-id');

// Migrate all tenants
const results = await migrationManager.migrateAllTenants(tenantList);

// Drop database (use with caution!)
await migrationManager.dropDatabase('my_database', undefined, true);
```

## Migration Results

All migration operations return a `MigrationResult` object:

```typescript
interface MigrationResult {
  success: boolean;
  database: string;
  migrationsApplied: number;
  error?: string;
  duration?: number;
}
```

## Best Practices

### 1. Always Test Migrations
```bash
# Test on a copy of production data first
npm run db:reset -- --confirm
# ... restore backup data ...
npm run migrate:all-tenants
```

### 2. Backup Before Major Changes
```bash
# Backup before running migrations
pg_dump -h localhost -U postgres restaurant_master > backup.sql
```

### 3. Use Sequential Mode for Production
```bash
# Safer for production environments
npm run migrate:all-tenants
```

### 4. Monitor Migration Results
Check logs for any failed migrations:
```bash
npm run migrate:all-tenants 2>&1 | tee migration.log
```

### 5. Version Control Migrations
- Never modify existing migration files
- Always generate new migrations for schema changes
- Commit migration files to version control

## Troubleshooting

### Migration Fails
```bash
# Check database connectivity
psql -h localhost -U postgres -d postgres

# Check migration files exist
ls -la src/core/database/migrations/master/
ls -la src/core/database/migrations/tenant/

# Check logs
# Logs are output to console with detailed error messages
```

### Database Already Exists Error
The migration system automatically handles existing databases. If you see this error, it's informational only.

### Connection Pool Errors
```bash
# Ensure no other processes are using the database
# Check for hanging connections
SELECT * FROM pg_stat_activity WHERE datname = 'your_database';
```

### Permission Errors
Ensure your database user has sufficient permissions:
```sql
ALTER USER postgres CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE restaurant_master TO postgres;
```

## Environment Variables

Required environment variables (`.env`):

```env
# Master Database
MASTER_DB_HOST=localhost
MASTER_DB_PORT=5432
MASTER_DB_NAME=restaurant_master
MASTER_DB_USER=postgres
MASTER_DB_PASSWORD=postgres

# Tenant Database Defaults (optional)
TENANT_DB_HOST=localhost
TENANT_DB_PORT=5432
TENANT_DB_USER=postgres
TENANT_DB_PASSWORD=postgres
```

## Migration Safety

### Production Checklist
- [ ] Backup all databases
- [ ] Test migrations on staging environment
- [ ] Review generated migration files
- [ ] Schedule during maintenance window
- [ ] Monitor application logs
- [ ] Have rollback plan ready

### Rollback Strategy
If a migration fails:
1. Restore from backup
2. Fix migration issue
3. Test on staging
4. Re-run migration

## Performance Considerations

### Parallel vs Sequential
- **Sequential**: Safer, better logging, easier to debug
- **Parallel**: Faster, but uses more resources

### Large Tenant Counts
For applications with many tenants:
```bash
# Process in batches
npm run migrate:all-tenants -- --continue
```

## Support

For issues or questions:
1. Check this documentation
2. Review migration logs
3. Check database connectivity
4. Verify schema files are correct

## Changelog

### v2.0.0 (Current)
- ✨ New MigrationManager class
- ✨ Enhanced error handling and logging
- ✨ Parallel migration support
- ✨ Database creation automation
- ✨ Comprehensive CLI tools
- 📝 Detailed documentation

### v1.0.0 (Legacy)
- Basic migration support
- Manual database creation
- Limited error handling
