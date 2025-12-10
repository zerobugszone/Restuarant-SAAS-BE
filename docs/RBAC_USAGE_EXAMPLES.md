# RBAC Usage Examples

## 1. Creating Roles and Permissions

### Example: Setup Restaurant Manager Role

```bash
# Step 1: Create the role
POST /api/v1/tenants/tenant-123/roles
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Restaurant Manager",
  "description": "Manager with access to orders, menus, and staff"
}

Response:
{
  "success": true,
  "message": "Role created successfully",
  "status_code": 201,
  "data": {
    "id": "role-456",
    "tenantId": "tenant-123",
    "name": "Restaurant Manager",
    "description": "Manager with access to orders, menus, and staff",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}

# Step 2: Create permissions (if not already created)
POST /api/v1/tenants/tenant-123/permissions
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Create Order",
  "description": "Permission to create new orders",
  "resource": "orders",
  "action": "create"
}

# Step 3: Create more permissions
POST /api/v1/tenants/tenant-123/permissions
{ "name": "Read Orders", "resource": "orders", "action": "read" }

POST /api/v1/tenants/tenant-123/permissions
{ "name": "Update Orders", "resource": "orders", "action": "update" }

POST /api/v1/tenants/tenant-123/permissions
{ "name": "Read Menus", "resource": "menus", "action": "read" }

POST /api/v1/tenants/tenant-123/permissions
{ "name": "Update Menus", "resource": "menus", "action": "update" }

# Step 4: Assign permissions to role
POST /api/v1/tenants/tenant-123/roles/role-456/permissions
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "permissionIds": [
    "perm-1",  // orders:create
    "perm-2",  // orders:read
    "perm-3",  // orders:update
    "perm-4",  // menus:read
    "perm-5"   // menus:update
  ]
}

Response:
{
  "success": true,
  "message": "Permissions assigned successfully",
  "status_code": 200,
  "data": null
}
```

## 2. Assigning Roles to Users

```typescript
// In your user service/controller
import { userRoles } from '@/core/database/schemas/tenant/auth.schema';

async assignRoleToUser(tenantId: string, userId: string, roleId: string) {
  const db = await tenantConnectionPool.getConnection(tenantId);

  // Assign role to user
  await db.insert(userRoles).values({
    userId,
    roleId,
  });

  return { message: 'Role assigned to user successfully' };
}

// Usage:
await assignRoleToUser('tenant-123', 'user-789', 'role-456');
```

## 3. Using Role-Based Authorization

```typescript
import { Router } from 'express';
import { authenticate } from '@/core/middleware/authentication.middleware';
import { authorizeByRole } from '@/core/middleware/authorization.middleware';
import { ordersController } from '../controllers/orders.controller';

const router = Router();

// Only admins can create orders
router.post('/', authenticate, authorizeByRole(['admin']), ordersController.createOrder);

// Only managers and admins can update orders
router.put(
  '/:id',
  authenticate,
  authorizeByRole(['admin', 'manager']),
  ordersController.updateOrder
);

// Registered users can view orders
router.get('/', authenticate, ordersController.getOrders);

export default router;
```

## 4. Using Permission-Based Authorization

```typescript
import { Router } from 'express';
import { authenticate } from '@/core/middleware/authentication.middleware';
import { authorizeByPermission } from '@/core/middleware/authorization.middleware';
import { menusController } from '../controllers/menus.controller';

const router = Router();

// Check specific permission
router.post(
  '/',
  authenticate,
  authorizeByPermission('menus', 'create'),
  menusController.createMenu
);

router.put(
  '/:id',
  authenticate,
  authorizeByPermission('menus', 'update'),
  menusController.updateMenu
);

router.delete(
  '/:id',
  authenticate,
  authorizeByPermission('menus', 'delete'),
  menusController.deleteMenu
);

export default router;
```

## 5. Querying Roles and Permissions

### List Roles with Pagination

```bash
GET /api/v1/tenants/tenant-123/roles?page=1&limit=10&search=manager
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Roles retrieved successfully",
  "status_code": 200,
  "data": {
    "pagination": {
      "totalRecords": 3,
      "totalPages": 1,
      "currentPage": 1,
      "perPage": 10,
      "hasNext": false,
      "hasPrevious": false
    },
    "records": [
      {
        "id": "role-456",
        "tenantId": "tenant-123",
        "name": "Restaurant Manager",
        "description": "Manager with access to orders, menus, and staff",
        "isActive": true,
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      },
      // ... more roles
    ]
  }
}
```

### Get Single Role with All Permissions

```bash
GET /api/v1/tenants/tenant-123/roles/role-456
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Role retrieved successfully",
  "status_code": 200,
  "data": {
    "id": "role-456",
    "tenantId": "tenant-123",
    "name": "Restaurant Manager",
    "description": "Manager with access to orders, menus, and staff",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z",
    "permissions": [
      {
        "id": "perm-1",
        "name": "Create Order",
        "resource": "orders",
        "action": "create"
      },
      {
        "id": "perm-2",
        "name": "Read Orders",
        "resource": "orders",
        "action": "read"
      },
      {
        "id": "perm-3",
        "name": "Update Orders",
        "resource": "orders",
        "action": "update"
      },
      {
        "id": "perm-4",
        "name": "Read Menus",
        "resource": "menus",
        "action": "read"
      },
      {
        "id": "perm-5",
        "name": "Update Menus",
        "resource": "menus",
        "action": "update"
      }
    ],
    "userCount": 5
  }
}
```

### List Permissions by Resource

```bash
GET /api/v1/tenants/tenant-123/permissions/resources/orders
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "status_code": 200,
  "data": {
    "resource": "orders",
    "permissions": [
      {
        "id": "perm-1",
        "tenantId": "tenant-123",
        "name": "Create Order",
        "description": "Permission to create new orders",
        "resource": "orders",
        "action": "create",
        "isActive": true,
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      },
      {
        "id": "perm-2",
        "tenantId": "tenant-123",
        "name": "Read Orders",
        "description": "Permission to view orders",
        "resource": "orders",
        "action": "read",
        "isActive": true,
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      }
      // ... more permissions
    ]
  }
}
```

## 6. Updating Roles and Permissions

### Update Role Details

```bash
PUT /api/v1/tenants/tenant-123/roles/role-456
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Senior Manager",
  "description": "Updated description for senior managers",
  "isActive": true
}

Response:
{
  "success": true,
  "message": "Role updated successfully",
  "status_code": 200,
  "data": {
    "id": "role-456",
    "tenantId": "tenant-123",
    "name": "Senior Manager",
    "description": "Updated description for senior managers",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T15:30:00Z"
  }
}
```

### Disable a Role

```bash
PUT /api/v1/tenants/tenant-123/roles/role-456
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "isActive": false
}

# This marks the role as inactive without deleting it
```

## 7. Deleting Roles and Permissions

### Delete a Role

```bash
DELETE /api/v1/tenants/tenant-123/roles/role-456
Authorization: Bearer {admin-token}

# Success if no users are assigned to this role
Response:
{
  "success": true,
  "message": "Role deleted successfully",
  "status_code": 200,
  "data": null
}

# Error if users are assigned
Response:
{
  "success": false,
  "message": "Cannot delete role with assigned users",
  "status_code": 409,
  "data": null
}
```

### Delete a Permission

```bash
DELETE /api/v1/tenants/tenant-123/permissions/perm-1
Authorization: Bearer {admin-token}

# Success if not assigned to any role
Response:
{
  "success": true,
  "message": "Permission deleted successfully",
  "status_code": 200,
  "data": null
}

# Error if assigned to roles
Response:
{
  "success": false,
  "message": "Cannot delete permission assigned to roles",
  "status_code": 409,
  "data": null
}
```

## 8. Complex Permission Scenarios

### Example: Kitchen Staff Role

```bash
# Create role
POST /api/v1/tenants/tenant-123/roles
{
  "name": "Kitchen Staff",
  "description": "Kitchen staff can view and update orders"
}
# Response: role-789

# Assign specific permissions
POST /api/v1/tenants/tenant-123/roles/role-789/permissions
{
  "permissionIds": [
    "perm-2",   // orders:read
    "perm-3"    // orders:update
    // Note: NOT including orders:create or orders:delete
  ]
}

# Kitchen staff cannot create or delete orders, only view and update status
```

### Example: Customer Service Role

```bash
POST /api/v1/tenants/tenant-123/roles
{
  "name": "Customer Service",
  "description": "Can view orders and manage customers"
}
# Response: role-901

POST /api/v1/tenants/tenant-123/roles/role-901/permissions
{
  "permissionIds": [
    "perm-2",    // orders:read
    "perm-10",   // customers:read
    "perm-11"    // customers:update
  ]
}

# Customer service can view orders and manage customer info
# but cannot modify orders or delete customers
```

## 9. Checking User Permissions in Code

```typescript
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { userRoles, roles, rolePermissions } from '@/core/database/schemas/tenant/auth.schema';
import { eq, and, inArray } from 'drizzle-orm';

async function userHasPermission(
  tenantId: string,
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const db = await tenantConnectionPool.getConnection(tenantId);

  // Get user's roles
  const userRoleRecords = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  if (userRoleRecords.length === 0) return false;

  const roleIds = userRoleRecords.map(r => r.roleId);

  // Check if any role has the permission
  const permission = await db
    .select()
    .from(rolePermissions)
    .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
    // Add permission table join here
    .where(
      and(
        inArray(rolePermissions.roleId, roleIds)
        // Add resource:action check
      )
    );

  return permission.length > 0;
}

// Usage:
const canCreateOrders = await userHasPermission('tenant-123', 'user-456', 'orders', 'create');

if (canCreateOrders) {
  // Allow order creation
}
```

## Common Pagination Patterns

### Get Second Page with 20 Results

```bash
GET /api/v1/tenants/tenant-123/roles?page=2&limit=20
```

### Search Roles

```bash
GET /api/v1/tenants/tenant-123/roles?search=manager&page=1&limit=10
```

### Filter Permissions by Resource

```bash
GET /api/v1/tenants/tenant-123/permissions?resource=orders&page=1&limit=10
```

### Combine Search and Filter

```bash
GET /api/v1/tenants/tenant-123/permissions?resource=orders&search=delete&page=1&limit=10
```
