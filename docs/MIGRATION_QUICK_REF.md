# Database Migration Quick Reference

## Common Commands

### Initial Setup
```bash
npm run db:setup
```

### Schema Changes

**Master Database:**
```bash
npm run generate:master    # Generate migrations
npm run migrate:master     # Apply migrations
```

**Tenant Databases:**
```bash
npm run generate:tenant       # Generate migrations
npm run migrate:all-tenants   # Apply to all tenants
```

### Single Tenant Operations
```bash
# Migrate specific tenant
npm run migrate:tenant -- <tenantId>

# Example
npm run migrate:tenant -- abc-123
```

### Reset (Development Only)
```bash
npm run db:reset -- --confirm
```

## Migration Workflow

### 1. Modify Schema
Edit files in:
- `src/core/database/schemas/master/` (for master DB)
- `src/core/database/schemas/tenant/` (for tenant DBs)

### 2. Generate Migration
```bash
npm run generate:master   # or generate:tenant
```

### 3. Review Migration
Check generated files in:
- `src/core/database/migrations/master/`
- `src/core/database/migrations/tenant/`

### 4. Apply Migration
```bash
npm run migrate:master        # or migrate:all-tenants
```

## Troubleshooting

### Check Database Connection
```bash
psql -h localhost -U postgres -d restaurant_master
```

### View Migration Files
```bash
ls -la src/core/database/migrations/master/
ls -la src/core/database/migrations/tenant/
```

### Check Running Processes
```bash
ps aux | grep postgres
```

## Environment Setup

Required in `.env`:
```env
MASTER_DB_HOST=localhost
MASTER_DB_PORT=5432
MASTER_DB_NAME=restaurant_master
MASTER_DB_USER=postgres
MASTER_DB_PASSWORD=postgres
```

## Safety Tips

✅ **DO:**
- Backup before migrations
- Test on staging first
- Review generated migrations
- Use sequential mode in production

❌ **DON'T:**
- Modify existing migration files
- Run reset in production
- Skip testing migrations
- Ignore migration errors

## Need Help?

See full documentation: `docs/DATABASE_MIGRATIONS.md`
