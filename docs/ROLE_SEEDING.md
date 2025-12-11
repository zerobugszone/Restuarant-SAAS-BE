# Role Seeding Logic Documentation

## Overview

The role seeding system automatically creates default roles, permissions, and their associations when a new tenant is provisioned. This ensures every tenant starts with a consistent RBAC structure tailored for restaurant management systems.

## Architecture

### Flow Diagram

```
Tenant Creation Request
    ↓
Create Tenant Record (Master DB)
    ↓
Create & Migrate Tenant Database
    ↓
Seed Default Roles & Permissions ← NEW
    ↓
Tenant Ready
```

## Default Roles

Every new tenant receives **4 default roles**:

### 1. Superadmin

- **Description**: Full system access - manages all restaurant operations
- **Permissions**: ALL permissions (full CRUD on all resources)
- **Use Case**: Restaurant owner, system administrator

### 2. Manager

- **Description**: Restaurant manager - manages staff, orders, and reports
- **Key Permissions**:
  - Orders: create, read, update
  - Menu: create, read, update, delete
  - QR Codes: create, read, update, delete
  - Customers: full CRUD
  - Users: create, read, update (limited)
  - Reports: read
  - Restaurant Settings: read, update
- **Use Case**: Restaurant management personnel

### 3. Kitchen Staff

- **Description**: Kitchen staff - manages orders and food preparation
- **Key Permissions**:
  - Orders: read, update (status updates only)
  - Menu: read (view items)
  - QR Codes: read
  - Restaurant: read
- **Use Case**: Kitchen workers, order coordinators

### 4. Accountant

- **Description**: Handles financial transactions and payment processing
- **Key Permissions**:
  - Orders: read
  - Payments: full CRUD
  - Reports: read, create
  - Customers: read
  - Restaurant: read
- **Use Case**: Accounting staff, financial managers

## Default Permissions

Total: **38 permissions** organized by resource

### Permission Format

```
resource:action
```

### Resources & Actions

#### Orders (4 permissions)

- `orders:create` - Create new orders
- `orders:read` - View orders
- `orders:update` - Update order status
- `orders:delete` - Delete orders

#### Menu (4 permissions)

- `menu:create` - Create menu items
- `menu:read` - View menu items
- `menu:update` - Update menu items
- `menu:delete` - Delete menu items

#### QR Codes (4 permissions)

- `qr:create` - Generate QR codes
- `qr:read` - View QR codes
- `qr:update` - Update QR codes
- `qr:delete` - Delete QR codes

#### Customers (4 permissions)

- `customers:create` - Create customer records
- `customers:read` - View customer information
- `customers:update` - Update customer information
- `customers:delete` - Delete customer records

#### Users & Staff (4 permissions)

- `users:create` - Create user accounts
- `users:read` - View user accounts
- `users:update` - Update user accounts
- `users:delete` - Delete user accounts

#### Roles (4 permissions)

- `roles:create` - Create new roles
- `roles:read` - View roles
- `roles:update` - Update roles
- `roles:delete` - Delete roles

#### Permissions (4 permissions)

- `permissions:create` - Create permissions
- `permissions:read` - View permissions
- `permissions:update` - Update permissions
- `permissions:delete` - Delete permissions

#### Payments & Billing (4 permissions)

- `payments:create` - Process payments
- `payments:read` - View payment records
- `payments:update` - Update payment records
- `payments:delete` - Delete payment records

#### Reports & Analytics (4 permissions)

- `analytics:create` - Generate reports
- `analytics:read` - View analytics and reports
- `analytics:update` - Update report settings
- `analytics:delete` - Delete reports

#### Restaurant Settings (2 permissions)

- `restaurant:read` - View restaurant settings
- `restaurant:update` - Update restaurant settings

#### Subscription (2 permissions)

- `subscription:read` - View subscription details
- `subscription:update` - Update subscription

## Implementation Details

### Service: `RoleSeedingService`

**Location**: `src/modules/roles/services/roleSeeding.service.ts`

#### Method: `seedRolesAndPermissions(tenantId: string)`

**What it does**:

1. Creates all default permissions in the tenant's database
2. Creates all default roles in the tenant's database
3. Associates each role with its respective permissions via the `role_permissions` junction table

**Flow**:

```typescript
// Step 1: Create all permissions
for each permission in DEFAULT_PERMISSIONS:
  - Insert into permissions table
  - Store permission ID in memory map

// Step 2: Create all roles
for each role in DEFAULT_ROLES:
  - Insert into roles table

// Step 3: Assign permissions to roles
for each role in DEFAULT_ROLES:
  - Get role's assigned permissions from ROLE_PERMISSION_MAPPING
  - Insert into role_permissions junction table for each permission
```

### Integration Point: Tenant Repository

**Location**: `src/modules/tenant-management/repositories/tenant.repository.ts`

**Modified Method**: `createAndMigrateTenantDatabase()`

**Modification**:

```typescript
// After migrations complete
await roleSeedingService.seedRolesAndPermissions(tenantId);
```

This is called automatically after:

1. Tenant record created in master database
2. Tenant database created
3. All migrations applied

## Database Tables Affected

### Creating/Seeding Into:

- `auth.roles` - Default role records
- `auth.permissions` - Default permission records
- `auth.role_permissions` - Role-permission associations

### Related Tables (Not Modified by Seeding):

- `auth.users` - Created empty (users added separately)
- `auth.user_roles` - Created empty (assignments added separately)

## Example: Tenant Creation Flow with Seeding

```bash
# 1. Create tenant (API call)
POST /api/tenants
{
  "name": "My Restaurant",
  "subdomain": "my-restaurant"
}

# Backend automatically:
# 1. Insert tenant in master DB
# 2. Create tenant database
# 3. Run migrations
# 4. Seed 4 roles
# 5. Seed 38 permissions
# 6. Create 38 role-permission associations

# Result: Tenant ready with complete RBAC structure!
```

## Adding New Roles or Permissions

### To Add a New Default Role

1. Add to `DEFAULT_ROLES` constant:

```typescript
{
  name: 'New Role',
  description: 'Role description'
}
```

2. Add permissions mapping in `ROLE_PERMISSION_MAPPING`:

```typescript
'New Role': [
  'resource:action',
  'resource:action'
]
```

3. Redeploy or manually seed existing tenants

### To Add a New Permission

1. Add to `DEFAULT_PERMISSIONS` constant:

```typescript
{
  resource: 'resource_name',
  action: 'action_name',
  description: 'What it allows'
}
```

2. Add to `ROLE_PERMISSION_MAPPING` for affected roles

3. Redeploy or manually seed existing tenants

## Manual Seeding for Existing Tenants

If you need to seed existing tenants (e.g., after adding new permissions):

```typescript
// Create an API endpoint or one-time script
import { roleSeedingService } from '@/modules/roles/services/roleSeeding.service';

await roleSeedingService.seedRolesAndPermissions(existingTenantId);
```

## Error Handling

If seeding fails:

- The entire tenant creation fails and rolls back
- No partial data is left in the tenant database
- Error is logged with details
- User receives clear error message

## Logging

The seeding process logs:

```
✓ Seeding roles and permissions for tenant: [tenantId]
✓ Created permission: resource:action
...
✓ Created role: Role Name
  ✓ Assigned permission: resource:action to role: Role Name
  ...
✓ Successfully seeded 4 roles with permissions
```

## Performance Considerations

- **Time**: Seeding typically completes in <100ms
- **Queries**: 1 + 38 + 4 + ~152 inserts (193 total)
- **Order**: Sequential (required for FK relationships)

## Testing

### Test Seeding Function

```typescript
// In a test file
import { roleSeedingService } from '@/modules/roles/services/roleSeeding.service';

it('should seed roles and permissions', async () => {
  const testTenantId = 'test-tenant-123';

  await roleSeedingService.seedRolesAndPermissions(testTenantId);

  // Verify 4 roles created
  const roles = await db.select().from(rolesTable);
  expect(roles).toHaveLength(4);

  // Verify permissions created
  const perms = await db.select().from(permissionsTable);
  expect(perms).toHaveLength(38);

  // Verify associations
  const associations = await db.select().from(rolePermissionsTable);
  expect(associations.length).toBeGreaterThan(0);
});
```

## FAQ

**Q: Can I customize default roles per tenant?**  
A: Currently, all tenants get the same roles. To customize, you could modify the seeding service to accept parameters.

**Q: What if a tenant already has roles?**  
A: The seeding only runs on new tenants during creation. Existing tenants won't be affected.

**Q: Can users create custom roles?**  
A: Yes! The RBAC system allows creating custom roles via the roles API after tenant initialization.

**Q: Are seeded roles immutable?**  
A: No, they can be modified or deleted like any other role. However, it's recommended to keep at least the Superadmin role.

**Q: What happens to permissions that aren't assigned to any role?**  
A: They exist but aren't used. Users without a role that includes them can't perform those actions.

## Related Documentation

- [RBAC Design](./RBAC_DESIGN.md) - Complete RBAC architecture
- [RBAC Implementation](./RBAC_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [RBAC Usage Examples](./RBAC_USAGE_EXAMPLES.md) - API examples
- [Tenant Management](./MIGRATION_QUICK_REF.md) - Tenant creation process
