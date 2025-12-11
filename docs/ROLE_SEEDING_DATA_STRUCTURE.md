# Role Seeding Data Structure

## Seeding Execution Order

When a tenant is created, the seeding happens in this exact order:

### Phase 1: Permissions (38 inserts)

```
1. orders:create          → INSERT permission
2. orders:read            → INSERT permission
3. orders:update          → INSERT permission
4. orders:delete          → INSERT permission
5. menu:create            → INSERT permission
... (continues for all 38 permissions)
```

### Phase 2: Roles (4 inserts)

```
1. Superadmin      → INSERT role
2. Manager         → INSERT role
3. Kitchen Staff   → INSERT role
4. Accountant      → INSERT role
```

### Phase 3: Role-Permission Associations (75 inserts)

```
Superadmin associations (38):
1. Superadmin → orders:create
2. Superadmin → orders:read
... (all 38 permissions)

Manager associations (24):
1. Manager → orders:create
2. Manager → orders:read
3. Manager → orders:update
... (24 permissions)

Kitchen Staff associations (4):
1. Kitchen Staff → orders:read
2. Kitchen Staff → orders:update
3. Kitchen Staff → menu:read
4. Kitchen Staff → qr:read

Accountant associations (9):
1. Accountant → orders:read
2. Accountant → customers:read
... (9 permissions)
```

## Database Schema (After Seeding)

### auth.roles table

```sql
id                              | tenantId                        | name           | description                                    | isActive | createdAt        | updatedAt
--------------------------------|---------------------------------|----------------|------------------------------------------------|----------|------------------|------------------
uuid1                           | tenant-uuid                     | Superadmin     | Full system access - manages...               | true     | 2024-01-01...    | 2024-01-01...
uuid2                           | tenant-uuid                     | Manager        | Restaurant manager - manages...                | true     | 2024-01-01...    | 2024-01-01...
uuid3                           | tenant-uuid                     | Kitchen Staff  | Kitchen staff - manages orders...             | true     | 2024-01-01...    | 2024-01-01...
uuid4                           | tenant-uuid                     | Accountant     | Handles financial transactions...             | true     | 2024-01-01...    | 2024-01-01...
```

### auth.permissions table

```sql
id     | tenantId    | name                | description           | resource  | action | isActive | createdAt | updatedAt
--------|-------------|---------------------|-----------------------|-----------|--------|----------|-----------|----------
uuid1   | tenant-uuid | orders - create    | Create new orders     | orders    | create | true     | ...       | ...
uuid2   | tenant-uuid | orders - read      | View orders           | orders    | read   | true     | ...       | ...
uuid3   | tenant-uuid | orders - update    | Update order status   | orders    | update | true     | ...       | ...
uuid4   | tenant-uuid | orders - delete    | Delete orders         | orders    | delete | true     | ...       | ...
uuid5   | tenant-uuid | menu - create      | Create menu items     | menu      | create | true     | ...       | ...
... (38 total rows)
```

### auth.role_permissions table

```sql
id     | roleId | permissionId
--------|--------|---------------
uuid1   | uuid1  | uuid1     (Superadmin → orders:create)
uuid2   | uuid1  | uuid2     (Superadmin → orders:read)
uuid3   | uuid1  | uuid3     (Superadmin → orders:update)
... (75 total rows)
uuid75  | uuid4  | uuid41    (Accountant → subscription:update)
```

## TypeScript Data Structures

### Role Object (After Seeding)

```typescript
interface Role {
  id: string; // UUID - generated
  tenantId: string; // UUID - tenant's ID
  name: string; // 'Superadmin' | 'Manager' | 'Kitchen Staff' | 'Accountant'
  description: string; // Role description
  isActive: boolean; // true (always true for seeded roles)
  createdAt: Date; // Timestamp when inserted
  updatedAt: Date; // Timestamp when inserted
}
```

### Permission Object (After Seeding)

```typescript
interface Permission {
  id: string; // UUID - generated
  tenantId: string; // UUID - tenant's ID
  name: string; // e.g., 'orders - create'
  description: string; // e.g., 'Create new orders'
  resource: string; // 'orders' | 'menu' | 'qr' | 'customers' | ...
  action: string; // 'create' | 'read' | 'update' | 'delete'
  isActive: boolean; // true (always true for seeded permissions)
  createdAt: Date; // Timestamp when inserted
  updatedAt: Date; // Timestamp when inserted
}
```

### RolePermission Junction (After Seeding)

```typescript
interface RolePermission {
  id: string; // UUID - generated
  roleId: string; // UUID - foreign key to roles table
  permissionId: string; // UUID - foreign key to permissions table
}
```

## Sample Seeded Data (JSON)

### Sample Roles After Seeding

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tenantId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "Superadmin",
    "description": "Full system access - manages all restaurant operations",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "tenantId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "Manager",
    "description": "Restaurant manager - manages staff, orders, and reports",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:01Z",
    "updatedAt": "2024-01-15T10:30:01Z"
  }
]
```

### Sample Permissions After Seeding

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "tenantId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "orders - create",
    "description": "Create new orders",
    "resource": "orders",
    "action": "create",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "tenantId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "orders - read",
    "description": "View orders",
    "resource": "orders",
    "action": "read",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## Programmatic Access Examples

### Get All Roles for Tenant

```sql
SELECT * FROM auth.roles
WHERE tenant_id = $1
ORDER BY name;

-- Returns: 4 rows (Superadmin, Manager, Kitchen Staff, Accountant)
```

### Get All Permissions for Tenant

```sql
SELECT * FROM auth.permissions
WHERE tenant_id = $1
ORDER BY resource, action;

-- Returns: 38 rows
```

### Get All Permissions for a Role

```sql
SELECT p.* FROM auth.permissions p
INNER JOIN auth.role_permissions rp ON p.id = rp.permission_id
WHERE rp.role_id = $1
ORDER BY p.resource, p.action;

-- Example for Kitchen Staff: 4 rows
-- Example for Superadmin: 38 rows
-- Example for Manager: 24 rows
```

### Get Role Details with Permissions

```sql
SELECT
  r.id, r.name, r.description,
  json_agg(json_build_object(
    'id', p.id,
    'resource', p.resource,
    'action', p.action
  )) as permissions
FROM auth.roles r
LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
LEFT JOIN auth.permissions p ON rp.permission_id = p.id
WHERE r.tenant_id = $1
GROUP BY r.id, r.name, r.description
ORDER BY r.name;
```

## Seeding Statistics

```
Metric                     | Value
---------------------------|--------
Total Roles Seeded         | 4
Total Permissions Seeded   | 38
Total Associations Created | 75

By Role:
- Superadmin Permissions   | 38
- Manager Permissions      | 24
- Kitchen Staff Permissions| 4
- Accountant Permissions   | 9

By Operation:
- Permissions INSERT       | 38 rows
- Roles INSERT            | 4 rows
- RolePermissions INSERT  | 75 rows
- Total Database Operations| 117

Execution Time: ~50-100ms per tenant
```

## Unique Constraints

### Permissions (Per Tenant)

```
UNIQUE (tenant_id, resource, action)
```

Ensures no duplicate permission combinations per tenant.

### Role Permissions

```
UNIQUE (role_id, permission_id)
```

Ensures a role can't have the same permission twice.

## Data Integrity

### Foreign Keys

```
role_permissions.role_id → roles.id (CASCADE DELETE)
role_permissions.permission_id → permissions.id (CASCADE DELETE)
```

If a role or permission is deleted, all associations are automatically removed.

### Cascading Effects

- Delete Role → Deletes all role-permission associations
- Delete Permission → Deletes all role-permission associations
- Delete Tenant → (Not handled by seeding; handled elsewhere)

## Validation Checks

### During Seeding

```typescript
✓ TenantId provided and valid
✓ Database connection available
✓ All INSERT operations succeed
✓ All foreign key constraints satisfied
✓ No duplicate permissions created
✓ No duplicate role-permission associations
```

### On Failure

```typescript
✗ Rollback all inserts
✗ Log error details
✗ Cascade failure to tenant creation
✗ Return error to user
```

## Performance Characteristics

### Indexes (Recommended)

```sql
-- For fast lookups
CREATE INDEX idx_roles_tenant_id ON auth.roles(tenant_id);
CREATE INDEX idx_permissions_tenant_id ON auth.permissions(tenant_id);
CREATE INDEX idx_role_permissions_role_id ON auth.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON auth.role_permissions(permission_id);

-- For unique constraints
CREATE UNIQUE INDEX idx_permissions_tenant_resource_action
  ON auth.permissions(tenant_id, resource, action);
```

### Query Performance

- Get role permissions: ~1-5ms (depends on role size)
- Get all roles: ~1-3ms
- Get all permissions: ~5-10ms
- Check single permission: <1ms

## Migration Path

If you need to update seeded data for existing tenants:

```typescript
// 1. Update ROLE_PERMISSION_MAPPING in roleSeeding.service.ts
// 2. Create migration script
async function updateExistingTenants() {
  const tenants = await getTenants();
  for (const tenant of tenants) {
    await updateRolePermissions(tenant.id);
  }
}

// 3. Run script
await updateExistingTenants();
```

## Backup & Recovery

To backup seeded data:

```sql
-- Backup permissions
COPY auth.permissions TO '/path/to/permissions.csv' WITH (FORMAT csv, HEADER);

-- Backup roles
COPY auth.roles TO '/path/to/roles.csv' WITH (FORMAT csv, HEADER);

-- Backup associations
COPY auth.role_permissions TO '/path/to/role_permissions.csv' WITH (FORMAT csv, HEADER);
```

To restore:

```sql
-- Restore permissions
COPY auth.permissions FROM '/path/to/permissions.csv' WITH (FORMAT csv, HEADER);

-- Similar for roles and associations
```
