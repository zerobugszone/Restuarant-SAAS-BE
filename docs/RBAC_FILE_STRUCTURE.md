# RBAC File Structure & Organization

## Complete File Tree

```
src/
├── core/
│   ├── database/
│   │   └── schemas/tenant/
│   │       └── auth.schema.ts ✏️ MODIFIED
│   │           ├── Enhanced: roles table with tenantId, isActive, timestamps
│   │           ├── Enhanced: permissions table with resource, action
│   │           ├── Maintained: user_roles & role_permissions junction tables
│   │           └── Relations: Full relationship setup between tables
│   │
│   ├── middleware/
│   │   └── authorization.middleware.ts ✏️ MODIFIED
│   │       ├── authorizeByRole(roles: string[]) - Role-based access
│   │       ├── authorizeByPermission(resource, action) - Permission-based access
│   │       └── authorize(roles: string[]) - Backward compatible
│   │
│   ├── utils/
│   │   └── response.util.ts (existing - used by controllers)
│   │
│   └── helper/
│       └── pagination_helper.ts (existing - used by services)
│
├── modules/
│   │
│   ├── roles/
│   │   ├── services/ ✨ NEW
│   │   │   └── roles.service.ts
│   │   │       ├── RolesService class
│   │   │       ├── createRole() - Create new role
│   │   │       ├── getRoles() - List with pagination
│   │   │       ├── getRoleById() - Get with permissions
│   │   │       ├── updateRole() - Update details
│   │   │       ├── deleteRole() - Delete (validates no users)
│   │   │       └── assignPermissionsToRole() - Bulk assign
│   │   │
│   │   ├── controllers/
│   │   │   ├── roles.controller.ts ✏️ REFACTORED
│   │   │   │   ├── RolesController class
│   │   │   │   ├── createRole()
│   │   │   │   ├── getRoles()
│   │   │   │   ├── getRoleById()
│   │   │   │   ├── updateRole()
│   │   │   │   ├── deleteRole()
│   │   │   │   └── assignPermissionsToRole()
│   │   │   │
│   │   │   └── rolePermissions.controller.ts ✏️ REFACTORED
│   │   │       ├── RolePermissionsController class
│   │   │       ├── assignPermissions()
│   │   │       └── getRolePermissions()
│   │   │
│   │   ├── routes/
│   │   │   ├── roles.routes.ts ✏️ UPDATED
│   │   │   │   ├── POST /api/v1/tenants/{tenantId}/roles
│   │   │   │   ├── GET /api/v1/tenants/{tenantId}/roles (paginated)
│   │   │   │   ├── GET /api/v1/tenants/{tenantId}/roles/{roleId}
│   │   │   │   ├── PUT /api/v1/tenants/{tenantId}/roles/{roleId}
│   │   │   │   ├── DELETE /api/v1/tenants/{tenantId}/roles/{roleId}
│   │   │   │   └── POST /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
│   │   │   │
│   │   │   └── rolePermissions.routes.ts ✏️ UPDATED
│   │   │       ├── POST /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
│   │   │       └── GET /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
│   │   │
│   │   └── repositories/
│   │       └── roles.repository.ts (existing - used by service)
│   │
│   └── permissions/
│       ├── services/ ✨ NEW
│       │   └── permissions.service.ts
│       │       ├── PermissionsService class
│       │       ├── createPermission() - Create new permission
│       │       ├── getPermissions() - List with pagination & filtering
│       │       ├── getPermissionById() - Get single permission
│       │       ├── updatePermission() - Update details
│       │       ├── deletePermission() - Delete (validates not assigned)
│       │       └── getPermissionsByResource() - Filter by resource
│       │
│       ├── controllers/
│       │   └── permissions.controller.ts ✏️ REFACTORED
│       │       ├── PermissionsController class
│       │       ├── createPermission()
│       │       ├── getPermissions()
│       │       ├── getPermissionById()
│       │       ├── updatePermission()
│       │       ├── deletePermission()
│       │       └── getPermissionsByResource()
│       │
│       ├── routes/
│       │   └── permissions.routes.ts ✏️ UPDATED
│       │       ├── POST /api/v1/tenants/{tenantId}/permissions
│       │       ├── GET /api/v1/tenants/{tenantId}/permissions (paginated)
│       │       ├── GET /api/v1/tenants/{tenantId}/permissions/{permissionId}
│       │       ├── PUT /api/v1/tenants/{tenantId}/permissions/{permissionId}
│       │       ├── DELETE /api/v1/tenants/{tenantId}/permissions/{permissionId}
│       │       └── GET /api/v1/tenants/{tenantId}/permissions/resources/{resource}
│       │
│       └── repositories/
│           └── permissions.repository.ts (existing - used by service)
│
└── docs/
    ├── RBAC_DESIGN.md ✨ NEW
    │   └── Comprehensive design document (1000+ lines)
    │       ├── Architecture overview
    │       ├── Database schema details
    │       ├── Service layer documentation
    │       ├── Complete API specification
    │       ├── Authorization middleware guide
    │       ├── Pagination format
    │       ├── Response format
    │       ├── Error handling
    │       ├── Multi-tenancy explanation
    │       ├── Best practices
    │       └── Testing guide
    │
    ├── RBAC_IMPLEMENTATION_SUMMARY.md ✨ NEW
    │   └── Executive summary
    │       ├── What was designed
    │       ├── Components overview
    │       ├── Data flow diagram
    │       ├── API endpoints summary
    │       ├── Response format
    │       ├── Permission model
    │       ├── Multi-tenancy details
    │       ├── File changes list
    │       ├── Next steps
    │       └── Architecture benefits
    │
    ├── RBAC_USAGE_EXAMPLES.md ✨ NEW
    │   └── Practical examples (800+ lines)
    │       ├── Setup example: Create roles and permissions
    │       ├── User assignment examples
    │       ├── Role-based authorization examples
    │       ├── Permission-based authorization examples
    │       ├── Query examples with pagination
    │       ├── Update examples
    │       ├── Delete examples
    │       ├── Complex scenarios
    │       ├── Permission checking in code
    │       └── Pagination patterns
    │
    ├── RBAC_QUICK_REFERENCE.md ✨ NEW
    │   └── Quick lookup guide (600+ lines)
    │       ├── Key concepts table
    │       ├── Database tables overview
    │       ├── API endpoints quick list
    │       ├── Authorization middleware examples
    │       ├── Standard permission names
    │       ├── Request/response examples
    │       ├── Query parameters table
    │       ├── HTTP status codes
    │       ├── Setup checklist
    │       ├── Common operations
    │       ├── Best practices
    │       ├── Testing template
    │       ├── File locations
    │       ├── Integration steps
    │       └── Troubleshooting guide
    │
    ├── RBAC_FILE_STRUCTURE.md ✨ NEW (this file)
    │   └── This complete file structure guide
    │
    └── [existing docs]
```

## Legend

- ✨ **NEW** - Completely new file created
- ✏️ **MODIFIED** - Existing file was updated
- 📚 **DOCUMENTATION** - Documentation file
- 🔧 **UTILITY** - Utility/helper file

## Key Service Files

### `roles.service.ts` (New)
- **Location**: `src/modules/roles/services/roles.service.ts`
- **Size**: ~250 lines
- **Class**: `RolesService`
- **Exports**: `rolesService` (singleton instance)
- **Methods**:
  1. `createRole(tenantId, data)` - Creates role with validation
  2. `getRoles(tenantId, page, perPage, search)` - List with pagination
  3. `getRoleById(tenantId, roleId)` - Get with permissions and user count
  4. `updateRole(tenantId, roleId, data)` - Update role details
  5. `deleteRole(tenantId, roleId)` - Delete with cascade validation
  6. `assignPermissionsToRole(tenantId, roleId, permissionIds)` - Bulk assign

### `permissions.service.ts` (New)
- **Location**: `src/modules/permissions/services/permissions.service.ts`
- **Size**: ~200 lines
- **Class**: `PermissionsService`
- **Exports**: `permissionsService` (singleton instance)
- **Methods**:
  1. `createPermission(tenantId, data)` - Creates permission with validation
  2. `getPermissions(tenantId, page, perPage, resource, search)` - List with filtering
  3. `getPermissionById(tenantId, permissionId)` - Get single permission
  4. `updatePermission(tenantId, permissionId, data)` - Update details
  5. `deletePermission(tenantId, permissionId)` - Delete with cascade check
  6. `getPermissionsByResource(tenantId, resource)` - Filter by resource

## Key Controller Files

### `roles.controller.ts` (Refactored)
- **Location**: `src/modules/roles/controllers/roles.controller.ts`
- **Pattern**: Class-based with method binding
- **Methods**: 6 (create, list, get, update, delete, assignPermissions)
- **Features**:
  - Uses sendResponse utility
  - Pagination support
  - Error handling with try-catch-next
  - Input validation

### `permissions.controller.ts` (Refactored)
- **Location**: `src/modules/permissions/controllers/permissions.controller.ts`
- **Pattern**: Class-based with method binding
- **Methods**: 6 (create, list, get, update, delete, getByResource)
- **Features**:
  - Uses sendResponse utility
  - Pagination support
  - Resource filtering
  - Search support

### `rolePermissions.controller.ts` (Refactored)
- **Location**: `src/modules/roles/controllers/rolePermissions.controller.ts`
- **Pattern**: Class-based with method binding
- **Methods**: 2 (assignPermissions, getRolePermissions)
- **Features**:
  - Uses rolesService for operations
  - Validates permission IDs
  - Returns detailed role info

## Key Route Files

### `roles.routes.ts` (Updated)
- **Location**: `src/modules/roles/routes/roles.routes.ts`
- **Base Path**: `/api/v1/tenants/:tenantId/roles`
- **Endpoints**: 6 main + 1 nested
- **Middleware**: 
  - `authenticate` on all endpoints
  - `authorizeByRole(['admin'])` on modify operations
- **Features**:
  - Merge params enabled
  - Full OpenAPI documentation
  - Query parameters: page, limit, search

### `permissions.routes.ts` (Updated)
- **Location**: `src/modules/permissions/routes/permissions.routes.ts`
- **Base Path**: `/api/v1/tenants/:tenantId/permissions`
- **Endpoints**: 5 main + 1 nested (resources)
- **Middleware**:
  - `authenticate` on all endpoints
  - `authorizeByRole(['admin'])` on modify operations
- **Features**:
  - Merge params enabled
  - Full OpenAPI documentation
  - Query parameters: page, limit, search, resource

### `rolePermissions.routes.ts` (Updated)
- **Location**: `src/modules/roles/routes/rolePermissions.routes.ts`
- **Base Path**: `/api/v1/tenants/:tenantId/roles/:roleId/permissions`
- **Endpoints**: 2
- **Middleware**:
  - `authenticate` on all endpoints
  - `authorizeByRole(['admin'])` on POST
- **Features**:
  - Merge params enabled
  - Full OpenAPI documentation

## Database Schema Changes

### `auth.schema.ts` (Modified)

#### Roles Table Enhancement
```typescript
roles {
  id: uuid (PK)
  tenantId: uuid (NOT NULL) ✨ NEW - For tenant isolation
  name: varchar(100) (NOT NULL)
  description: text (nullable)
  isActive: boolean ✨ NEW - For soft delete
  createdAt: timestamp ✨ NEW - Audit trail
  updatedAt: timestamp ✨ NEW - Audit trail
}
```

#### Permissions Table Enhancement
```typescript
permissions {
  id: uuid (PK)
  tenantId: uuid (NOT NULL) ✨ NEW - For tenant isolation
  name: varchar(100) (NOT NULL)
  description: text (nullable)
  resource: varchar(100) ✨ NEW - Resource identifier (e.g., 'orders')
  action: varchar(50) ✨ NEW - Action identifier (e.g., 'create')
  isActive: boolean ✨ NEW - For soft delete
  createdAt: timestamp ✨ NEW - Audit trail
  updatedAt: timestamp ✨ NEW - Audit trail
}
```

#### Junction Tables (Existing)
```typescript
user_roles {
  id: uuid (PK)
  userId: uuid (FK -> users.id, onDelete: CASCADE)
  roleId: uuid (FK -> roles.id, onDelete: CASCADE)
}

role_permissions {
  id: uuid (PK)
  roleId: uuid (FK -> roles.id, onDelete: CASCADE)
  permissionId: uuid (FK -> permissions.id, onDelete: CASCADE)
}
```

## Authorization Middleware Updates

### `authorization.middleware.ts` (Enhanced)

#### New Functions
1. **`authorizeByRole(roles: string[])`**
   - Simple role-based authorization
   - Checks if user's role is in allowed list
   - Returns 403 Forbidden if not authorized

2. **`authorizeByPermission(resource: string, action: string)`**
   - Advanced permission-based authorization
   - Queries user's roles and permissions from database
   - Validates user has required resource:action permission
   - Returns 403 Forbidden if not authorized

3. **`authorize(roles: string[])`** (Existing - kept for backward compatibility)
   - Legacy function maintained
   - Works with existing code
   - Delegates to authorizeByRole internally

## Import Statements Reference

### In Controllers
```typescript
import { sendResponse } from '@/core/utils/response.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { rolesService } from '../services/roles.service';
```

### In Services
```typescript
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { paginatedData } from '@/core/helper/pagination_helper';
import { roles, permissions } from '@/core/database/schemas/tenant/auth.schema';
import { HttpException } from '@/core/exceptions/httpException';
import { eq, and, ilike } from 'drizzle-orm';
```

### In Routes
```typescript
import { Router } from 'express';
import { rolesController } from '../controllers/roles.controller';
import { authenticate } from '@/core/middleware/authentication.middleware';
import { authorizeByRole } from '@/core/middleware/authorization.middleware';
```

## Compilation Status

✅ **All files compile successfully**

```
src/modules/roles/services/roles.service.ts ✓
src/modules/permissions/services/permissions.service.ts ✓
src/modules/roles/controllers/roles.controller.ts ✓
src/modules/permissions/controllers/permissions.controller.ts ✓
src/modules/roles/controllers/rolePermissions.controller.ts ✓
src/modules/roles/routes/roles.routes.ts ✓
src/modules/permissions/routes/permissions.routes.ts ✓
src/modules/roles/routes/rolePermissions.routes.ts ✓
src/core/middleware/authorization.middleware.ts ✓
src/core/database/schemas/tenant/auth.schema.ts ✓
```

## Total Line Count

```
New Code:
- roles.service.ts: ~250 lines
- permissions.service.ts: ~200 lines
- roles.controller.ts: ~130 lines
- permissions.controller.ts: ~130 lines
- rolePermissions.controller.ts: ~55 lines
Subtotal: ~765 lines of new service code

Documentation:
- RBAC_DESIGN.md: ~1000 lines
- RBAC_IMPLEMENTATION_SUMMARY.md: ~400 lines
- RBAC_USAGE_EXAMPLES.md: ~800 lines
- RBAC_QUICK_REFERENCE.md: ~600 lines
Subtotal: ~2800 lines of documentation

Total: ~3565 lines delivered
```

## Next Integration Steps

1. **Update main app.ts** - Register routes with tenant path parameter
2. **Run migration** - Update database schema with new columns
3. **Seed data** - Create default roles and permissions
4. **Update routes** - Add authorization to existing endpoints
5. **Test** - Run unit, integration, and E2E tests
6. **Deploy** - Roll out to production

---

**Version**: 1.0  
**Status**: Ready for Integration ✅  
**Last Updated**: January 2024
