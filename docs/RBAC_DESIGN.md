# RBAC (Role-Based Access Control) Design Documentation

## Overview

This document outlines the comprehensive Role-Based Access Control system implemented for the Restaurant SaaS platform. The RBAC system is multi-tenant aware and follows a three-tier permission model: Resources → Actions → Permissions.

## Architecture

### Database Schema

#### Core Tables

1. **Roles Table** (`auth.roles`)
   - `id`: UUID (Primary Key)
   - `tenantId`: UUID (Tenant identifier)
   - `name`: VARCHAR(100) - Role name
   - `description`: TEXT - Role description
   - `isActive`: BOOLEAN - Active/inactive status
   - `createdAt`: TIMESTAMP
   - `updatedAt`: TIMESTAMP

2. **Permissions Table** (`auth.permissions`)
   - `id`: UUID (Primary Key)
   - `tenantId`: UUID (Tenant identifier)
   - `name`: VARCHAR(100) - Permission name
   - `description`: TEXT - Permission description
   - `resource`: VARCHAR(100) - Resource type (e.g., 'orders', 'menus', 'users')
   - `action`: VARCHAR(50) - Action type (e.g., 'create', 'read', 'update', 'delete')
   - `isActive`: BOOLEAN - Active/inactive status
   - `createdAt`: TIMESTAMP
   - `updatedAt`: TIMESTAMP

3. **User Roles Junction Table** (`auth.user_roles`)
   - `id`: UUID (Primary Key)
   - `userId`: UUID (Foreign Key → users.id)
   - `roleId`: UUID (Foreign Key → roles.id)

4. **Role Permissions Junction Table** (`auth.role_permissions`)
   - `id`: UUID (Primary Key)
   - `roleId`: UUID (Foreign Key → roles.id)
   - `permissionId`: UUID (Foreign Key → permissions.id)

### Permission Model

Permissions follow the Resource:Action pattern:

```
resource:action

Examples:
- orders:create
- orders:read
- orders:update
- orders:delete
- menus:read
- menus:update
- users:create
- users:delete
```

## Service Layer

### RolesService

Handles all role-related operations with tenant isolation.

**Methods:**

- `createRole(tenantId, data)` - Create a new role
- `getRoles(tenantId, page, perPage, search)` - Get roles with pagination
- `getRoleById(tenantId, roleId)` - Get role with assigned permissions
- `updateRole(tenantId, roleId, data)` - Update role details
- `deleteRole(tenantId, roleId)` - Delete role (validates no users assigned)
- `assignPermissionsToRole(tenantId, roleId, permissionIds)` - Bulk assign permissions

### PermissionsService

Manages permission definitions and queries.

**Methods:**

- `createPermission(tenantId, data)` - Create a new permission
- `getPermissions(tenantId, page, perPage, resource, search)` - Get permissions with pagination
- `getPermissionById(tenantId, permissionId)` - Get single permission
- `updatePermission(tenantId, permissionId, data)` - Update permission
- `deletePermission(tenantId, permissionId)` - Delete permission (validates not assigned)
- `getPermissionsByResource(tenantId, resource)` - Get all permissions for a resource

## API Endpoints

### Roles Endpoints

#### Create Role

```
POST /api/v1/tenants/{tenantId}/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Manager",
  "description": "Restaurant manager role"
}

Response (201):
{
  "success": true,
  "message": "Role created successfully",
  "status_code": 201,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Manager",
    "description": "Restaurant manager role",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### List Roles with Pagination

```
GET /api/v1/tenants/{tenantId}/roles?page=1&limit=10&search=manager
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Roles retrieved successfully",
  "status_code": 200,
  "data": {
    "pagination": {
      "totalRecords": 5,
      "totalPages": 1,
      "currentPage": 1,
      "perPage": 10,
      "hasNext": false,
      "hasPrevious": false
    },
    "records": [
      {
        "id": "uuid",
        "tenantId": "uuid",
        "name": "Manager",
        "description": "...",
        "isActive": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

#### Get Role with Permissions

```
GET /api/v1/tenants/{tenantId}/roles/{roleId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Role retrieved successfully",
  "status_code": 200,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Manager",
    "description": "...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "...",
    "permissions": [
      {
        "id": "uuid",
        "name": "Create Orders",
        "resource": "orders",
        "action": "create"
      },
      {
        "id": "uuid",
        "name": "Read Orders",
        "resource": "orders",
        "action": "read"
      }
    ],
    "userCount": 3
  }
}
```

#### Update Role

```
PUT /api/v1/tenants/{tenantId}/roles/{roleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Senior Manager",
  "description": "Updated description",
  "isActive": true
}

Response (200): Same as create response
```

#### Assign Permissions to Role

```
POST /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permissionIds": ["uuid1", "uuid2", "uuid3"]
}

Response (200):
{
  "success": true,
  "message": "Permissions assigned successfully",
  "status_code": 200,
  "data": null
}
```

#### Delete Role

```
DELETE /api/v1/tenants/{tenantId}/roles/{roleId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Role deleted successfully",
  "status_code": 200,
  "data": null
}
```

### Permissions Endpoints

#### Create Permission

```
POST /api/v1/tenants/{tenantId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Create Orders",
  "description": "Allow creating new orders",
  "resource": "orders",
  "action": "create"
}

Response (201):
{
  "success": true,
  "message": "Permission created successfully",
  "status_code": 201,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Create Orders",
    "description": "...",
    "resource": "orders",
    "action": "create",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### List Permissions with Pagination

```
GET /api/v1/tenants/{tenantId}/permissions?page=1&limit=10&resource=orders&search=create
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "status_code": 200,
  "data": {
    "pagination": {
      "totalRecords": 4,
      "totalPages": 1,
      "currentPage": 1,
      "perPage": 10,
      "hasNext": false,
      "hasPrevious": false
    },
    "records": [...]
  }
}
```

#### Get Permissions by Resource

```
GET /api/v1/tenants/{tenantId}/permissions/resources/{resource}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "status_code": 200,
  "data": {
    "resource": "orders",
    "permissions": [
      {
        "id": "uuid",
        "name": "Create Orders",
        "resource": "orders",
        "action": "create"
      },
      {
        "id": "uuid",
        "name": "Read Orders",
        "resource": "orders",
        "action": "read"
      }
    ]
  }
}
```

#### Update Permission

```
PUT /api/v1/tenants/{tenantId}/permissions/{permissionId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Create Orders (Updated)",
  "description": "Updated description",
  "isActive": true
}

Response (200): Same structure as create
```

#### Delete Permission

```
DELETE /api/v1/tenants/{tenantId}/permissions/{permissionId}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Permission deleted successfully",
  "status_code": 200,
  "data": null
}
```

### Role Permissions Endpoints

#### Get All Permissions for a Role

```
GET /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Role permissions retrieved successfully",
  "status_code": 200,
  "data": {
    "roleId": "uuid",
    "roleName": "Manager",
    "permissions": [
      {
        "id": "uuid",
        "name": "Create Orders",
        "resource": "orders",
        "action": "create"
      }
    ],
    "permissionCount": 5
  }
}
```

## Authorization Middleware

### 1. Role-Based Authorization

```typescript
// Protect endpoint with specific roles
router.post('/orders', authenticate, authorizeByRole(['manager', 'admin']), controller.createOrder);
```

### 2. Permission-Based Authorization

```typescript
// Protect endpoint with specific permission
router.post(
  '/orders',
  authenticate,
  authorizeByPermission('orders', 'create'),
  controller.createOrder
);
```

## Pagination Format

All list endpoints return paginated results with consistent format:

```typescript
{
  pagination: {
    totalRecords: number;        // Total records in database
    totalPages: number;          // Total pages available
    currentPage: number;         // Current page number
    perPage: number;             // Records per page
    hasNext: boolean;            // Whether next page exists
    hasPrevious: boolean;        // Whether previous page exists
  },
  records: Array<T>;             // Array of records
}
```

## Response Format

All API responses follow this consistent format:

```typescript
{
  success: boolean; // Operation success status
  message: string; // Human-readable message
  status_code: number; // HTTP status code
  data: T | null; // Response payload
}
```

## Error Handling

### Error Codes

- `VALIDATION_ERROR` - Invalid input data (400)
- `AUTHENTICATION_FAILED` - User not authenticated (401)
- `AUTHORIZATION_FAILED` - User not authorized (403)
- `NOT_FOUND` - Resource not found (404)
- `CONFLICT` - Conflict operation (409)

### Error Response Format

```typescript
{
  success: false,
  message: "Error description",
  status_code: 400,
  data: null
}
```

## Multi-Tenancy

All RBAC operations are fully tenant-isolated:

1. **Tenant in Route**: `tenantId` is part of the URL path
2. **Tenant in Database Queries**: All queries filter by `tenantId`
3. **Tenant Connection Pool**: Each tenant uses its own database connection

This ensures:

- Roles created in tenant A don't appear in tenant B
- Permissions are scoped to specific tenants
- Complete data isolation

## Best Practices

1. **Role Naming**: Use clear, descriptive names (e.g., "Order Manager", "Kitchen Staff")
2. **Permission Granularity**: Keep permissions granular (one resource:action per permission)
3. **Role Composition**: Assign multiple permissions to roles rather than creating multiple roles
4. **Soft Deletes**: Consider marking roles/permissions as inactive instead of deleting
5. **Audit Trail**: Log role and permission changes for compliance
6. **Default Roles**: Create default roles (admin, manager, staff) during tenant onboarding

## Testing Guide

### Create Test Data

```bash
# Create admin role
POST /api/v1/tenants/{tenantId}/roles
{ "name": "admin", "description": "Administrator" }

# Create permissions
POST /api/v1/tenants/{tenantId}/permissions
{
  "name": "Create Orders",
  "resource": "orders",
  "action": "create"
}

# Assign permissions to role
POST /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
{ "permissionIds": ["perm-id-1", "perm-id-2"] }
```

### Test Authorization

```bash
# Request with authorization
GET /api/v1/tenants/{tenantId}/roles
Authorization: Bearer {valid-token}

# Request without authorization
GET /api/v1/tenants/{tenantId}/roles
# Response: 401 Unauthorized
```

## Migration Notes

If migrating from existing system:

1. Map existing roles to new role structure
2. Create permission definitions for each resource:action
3. Assign permissions to migrated roles
4. Update route guards to use new middleware
5. Test thoroughly before production deployment
