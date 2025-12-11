# RBAC Quick Reference Guide

## 🎯 Key Concepts

| Concept        | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| **Role**       | A collection of permissions assigned to users (e.g., "Manager", "Staff") |
| **Permission** | A specific action on a resource (e.g., "orders:create")                  |
| **Resource**   | A domain entity (e.g., "orders", "menus", "users")                       |
| **Action**     | An operation type (e.g., "create", "read", "update", "delete")           |
| **Tenant**     | Isolated environment for each restaurant/organization                    |

## 📋 Database Tables

```sql
-- Roles for a tenant
auth.roles (id, tenantId, name, description, isActive, createdAt, updatedAt)

-- Permissions available in system
auth.permissions (id, tenantId, name, resource, action, description, isActive, createdAt, updatedAt)

-- User to Role mapping
auth.user_roles (id, userId, roleId)

-- Role to Permission mapping
auth.role_permissions (id, roleId, permissionId)
```

## 🔌 API Endpoints Quick List

### Roles

```
POST   /api/v1/tenants/{tenantId}/roles
GET    /api/v1/tenants/{tenantId}/roles
GET    /api/v1/tenants/{tenantId}/roles/{roleId}
PUT    /api/v1/tenants/{tenantId}/roles/{roleId}
DELETE /api/v1/tenants/{tenantId}/roles/{roleId}
POST   /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
GET    /api/v1/tenants/{tenantId}/roles/{roleId}/permissions
```

### Permissions

```
POST   /api/v1/tenants/{tenantId}/permissions
GET    /api/v1/tenants/{tenantId}/permissions
GET    /api/v1/tenants/{tenantId}/permissions/{permissionId}
GET    /api/v1/tenants/{tenantId}/permissions/resources/{resource}
PUT    /api/v1/tenants/{tenantId}/permissions/{permissionId}
DELETE /api/v1/tenants/{tenantId}/permissions/{permissionId}
```

## 🔐 Authorization Middleware

```typescript
// Role-based protection
authorizeByRole(['admin', 'manager']);

// Permission-based protection (advanced)
authorizeByPermission('orders', 'create');
```

## 📝 Standard Permission Names

### Orders Resource

```
- orders:create    → Create new orders
- orders:read      → View orders
- orders:update    → Modify orders
- orders:delete    → Cancel/delete orders
- orders:export    → Export order data
```

### Menus Resource

```
- menus:read       → View menus
- menus:create     → Add menu items
- menus:update     → Edit menu items
- menus:delete     → Remove menu items
```

### Customers Resource

```
- customers:create → Add new customers
- customers:read   → View customer information
- customers:update → Edit customer details
- customers:delete → Remove customers
```

### Users Resource

```
- users:create     → Create user accounts
- users:read       → View users
- users:update     → Edit user profiles
- users:delete     → Deactivate users
- users:manage-roles → Assign/revoke roles
```

### Analytics Resource

```
- analytics:read   → View reports
- analytics:export → Download data
```

## 🔄 Request/Response Examples

### Create Role

```bash
POST /api/v1/tenants/abc-123/roles
Authorization: Bearer token
Content-Type: application/json

Request:
{
  "name": "Manager",
  "description": "Restaurant manager"
}

Response (201):
{
  "success": true,
  "message": "Role created successfully",
  "status_code": 201,
  "data": {
    "id": "role-456",
    "tenantId": "abc-123",
    "name": "Manager",
    "description": "Restaurant manager",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

### List Roles with Pagination

```bash
GET /api/v1/tenants/abc-123/roles?page=1&limit=10&search=manage
Authorization: Bearer token

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
    "records": [...]
  }
}
```

### Error Response

```bash
Response (403):
{
  "success": false,
  "message": "Access denied. Required role not found.",
  "status_code": 403,
  "data": null
}
```

## 📊 Query Parameters

| Parameter  | Type   | Default | Description                        |
| ---------- | ------ | ------- | ---------------------------------- |
| `page`     | number | 1       | Page number for pagination         |
| `limit`    | number | 10      | Records per page                   |
| `search`   | string | -       | Search by name (roles/permissions) |
| `resource` | string | -       | Filter by resource (permissions)   |

## ✅ HTTP Status Codes

| Code | Meaning      | Common Cause                 |
| ---- | ------------ | ---------------------------- |
| 200  | OK           | Successful GET, PUT, DELETE  |
| 201  | Created      | Successful POST              |
| 400  | Bad Request  | Invalid input data           |
| 401  | Unauthorized | Missing/invalid token        |
| 403  | Forbidden    | Insufficient permissions     |
| 404  | Not Found    | Resource doesn't exist       |
| 409  | Conflict     | Can't delete role with users |

## 🛠️ Setup Checklist

- [ ] Database migrations applied (schema updated with tenantId, timestamps)
- [ ] Services created (RolesService, PermissionsService)
- [ ] Controllers updated (use class-based pattern)
- [ ] Routes registered (with path parameters)
- [ ] Middleware configured (authenticate + authorize)
- [ ] Default roles created (admin, manager, staff)
- [ ] Default permissions defined (for each resource)
- [ ] Tests written (unit, integration, E2E)
- [ ] Documentation updated (swagger, guides)
- [ ] Frontend updated (to use new endpoints)

## 🔍 Common Operations

### Assign Role to User

```typescript
// In user service
const userRole = await db.insert(userRoles).values({
  userId: userId,
  roleId: roleId,
});
```

### Remove Role from User

```typescript
// In user service
await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
```

### Change User's Permissions

```typescript
// 1. Get current role
// 2. Remove old permissions
await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

// 3. Add new permissions
await db.insert(rolePermissions).values(newPermissionIds.map(id => ({ roleId, permissionId: id })));
```

## 🎓 Best Practices

✅ **DO:**

- Use meaningful role names (e.g., "Order Manager", not "role1")
- Keep permissions granular (one resource:action per permission)
- Use role-based auth for simple cases
- Use permission-based auth for complex authorization
- Soft delete roles by setting `isActive: false`
- Document custom permissions in code comments
- Log all role/permission changes for audit
- Test authorization on every protected endpoint

❌ **DON'T:**

- Use generic names like "user", "member", "admin2"
- Create permissions for every possible variation
- Hard-code role names in application
- Forget to add tenantId to queries
- Delete roles without checking for users first
- Assign permissions directly to users (use roles)
- Skip authorization middleware
- Forget to validate permission IDs are from same tenant

## 🧪 Testing Template

```typescript
describe('RBAC Authorization', () => {
  it('should allow admin to create orders', async () => {
    // 1. Create test user with admin role
    // 2. Login and get token
    // 3. POST /api/v1/tenants/{id}/orders
    // 4. Expect 201 Created
  });

  it('should block staff from deleting orders', async () => {
    // 1. Create test user with staff role
    // 2. Login and get token
    // 3. DELETE /api/v1/tenants/{id}/orders/{id}
    // 4. Expect 403 Forbidden
  });

  it('should list permissions by resource', async () => {
    // 1. Get /api/v1/tenants/{id}/permissions/resources/orders
    // 2. Expect response with orders:* permissions
  });
});
```

## 📚 File Locations

```
src/
├── core/
│   ├── middleware/
│   │   └── authorization.middleware.ts (updated)
│   └── database/
│       └── schemas/tenant/auth.schema.ts (updated)
├── modules/
│   ├── roles/
│   │   ├── services/
│   │   │   └── roles.service.ts (new)
│   │   ├── controllers/
│   │   │   ├── roles.controller.ts (refactored)
│   │   │   └── rolePermissions.controller.ts (refactored)
│   │   └── routes/
│   │       ├── roles.routes.ts (updated)
│   │       └── rolePermissions.routes.ts (updated)
│   └── permissions/
│       ├── services/
│       │   └── permissions.service.ts (new)
│       ├── controllers/
│       │   └── permissions.controller.ts (refactored)
│       └── routes/
│           └── permissions.routes.ts (updated)
docs/
├── RBAC_DESIGN.md (comprehensive design)
├── RBAC_IMPLEMENTATION_SUMMARY.md (overview)
└── RBAC_USAGE_EXAMPLES.md (practical examples)
```

## 🚀 Integration Steps

1. **Merge Schema Changes**

   ```sql
   ALTER TABLE auth.roles ADD COLUMN tenant_id UUID NOT NULL;
   ALTER TABLE auth.permissions ADD COLUMN tenant_id UUID NOT NULL;
   ```

2. **Deploy New Services**
   - Deploy RolesService
   - Deploy PermissionsService

3. **Update Controllers**
   - Use new class-based controllers
   - Apply response format

4. **Register Routes**
   - Add to main app.ts
   - Test all endpoints

5. **Migrate Existing Data**
   - Create default roles
   - Create all permissions
   - Assign roles to existing users

## 🆘 Troubleshooting

| Issue                            | Solution                                         |
| -------------------------------- | ------------------------------------------------ |
| 403 Forbidden on valid user      | Check user has role, role has permission         |
| Permissions not showing for user | Verify role → rolePermissions → permission chain |
| Different results per tenant     | Ensure tenantId in all WHERE clauses             |
| Pagination showing wrong count   | Check match object is correctly formatted        |
| "Cannot delete role" error       | Remove all users from role first                 |

---

**Last Updated:** January 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
