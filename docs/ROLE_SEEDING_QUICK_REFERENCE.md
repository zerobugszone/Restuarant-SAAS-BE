# Role Seeding Quick Reference

## What Gets Created When a Tenant is Made?

When you create a new tenant, the system automatically creates:

### 4 Default Roles

1. **Superadmin** - Full access to everything
2. **Manager** - Manages restaurant operations
3. **Kitchen Staff** - Manages orders and food prep
4. **Accountant** - Handles payments and reports

### 38 Default Permissions

Organized by resource (orders, menu, QR codes, customers, users, roles, permissions, payments, analytics, restaurant, subscription)

### Complete Role-Permission Mapping

Each role is pre-configured with appropriate permissions

## Quick Overview

| Role       | Orders | Menu   | QR     | Customers | Users  | Payments | Analytics |
| ---------- | ------ | ------ | ------ | --------- | ------ | -------- | --------- |
| Superadmin | ✅ All | ✅ All | ✅ All | ✅ All    | ✅ All | ✅ All   | ✅ All    |
| Manager    | ✅ CRU | ✅ All | ✅ All | ✅ All    | ✅ CR  | ❌       | ✅ R      |
| Kitchen    | ✅ RU  | ✅ R   | ✅ R   | ❌        | ❌     | ❌       | ❌        |
| Accountant | ✅ R   | ❌     | ❌     | ✅ R      | ❌     | ✅ All   | ✅ RC     |

_C=Create, R=Read, U=Update, D=Delete_

## Where to Find It

```
src/modules/roles/services/
├── roles.service.ts           (Existing CRUD service)
├── roleSeeding.service.ts     (NEW - Seeding logic)
└── ...

src/modules/tenant-management/repositories/
└── tenant.repository.ts       (Modified - Calls seeding)

docs/
└── ROLE_SEEDING.md           (Detailed documentation)
```

## How It Works

```
1. Tenant created
2. Database created & migrated
3. 38 permissions inserted
4. 4 roles inserted
5. Role-permission links created
6. Tenant ready with full RBAC
```

## Permissions by Resource

### Core Restaurant Operations

- **Orders**: create, read, update, delete
- **Menu**: create, read, update, delete
- **QR**: create, read, update, delete

### Customer & Staff

- **Customers**: create, read, update, delete
- **Users**: create, read, update, delete

### Administration

- **Roles**: create, read, update, delete
- **Permissions**: create, read, update, delete

### Financial

- **Payments**: create, read, update, delete
- **Analytics**: create, read, update, delete

### System

- **Restaurant**: read, update
- **Subscription**: read, update

## Using Seeded Roles

After tenant creation, assign users to roles:

```typescript
// Example: Assign user to Kitchen Staff role
const kitchenRole = await rolesService.getRoleByName(tenantId, 'Kitchen Staff');
await userRolesService.assignRoleToUser(userId, kitchenRole.id);
```

The user now has all Kitchen Staff permissions!

## Customizing for Your Tenant

To add more roles or permissions after seeding:

```typescript
// Create new role
const newRole = await rolesService.createRole(tenantId, {
  name: 'Waiter',
  description: 'Takes customer orders',
});

// Add specific permissions
await rolesService.assignPermissionsToRole(tenantId, newRole.id, [
  'orders:create',
  'customers:read',
]);
```

## File Structure

```
roleSeeding.service.ts
├── DEFAULT_ROLES (4 roles)
├── DEFAULT_PERMISSIONS (38 permissions)
├── ROLE_PERMISSION_MAPPING (role→permission assignments)
└── seedRolesAndPermissions() function
```

## Testing Seeding

```bash
# Create new tenant via API
POST /api/tenants
{
  "name": "Test Restaurant",
  "subdomain": "test-rest"
}

# Check seeded roles
GET /api/roles

# Check seeded permissions
GET /api/permissions

# Check role permissions
GET /api/roles/:roleId/permissions
```

## Environment Requirements

- Tenant database must be created and migrated
- `tenantConnectionPool` must be initialized
- Logger utility available

## Troubleshooting

**Seeding fails?**

- Check tenant database creation succeeded
- Verify migrations ran completely
- Check logs for specific error

**Roles not visible?**

- Verify seeding completed (check logs)
- Query tenant database directly
- Check tenantId matches

## Related Commands

```bash
# Full rebuild (includes seeding logic)
npm run build

# Run migrations only (seeding happens after)
npm run migrate:tenant

# Check migration status
npm run migrate:status
```

## Key Takeaway

✅ **Automatic** - Happens on tenant creation  
✅ **Complete** - All roles and permissions created  
✅ **Consistent** - Same structure for every tenant  
✅ **Customizable** - Can add more roles/permissions later

New tenants are immediately ready for RBAC operations!
