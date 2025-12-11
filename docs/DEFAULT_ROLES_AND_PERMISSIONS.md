# Default Roles & Permissions Reference

## Default Roles Configuration

### Role 1: Superadmin

```
Name: Superadmin
Description: Full system access - manages all restaurant operations
Permissions: ALL 38 permissions
```

### Role 2: Manager

```
Name: Manager
Description: Restaurant manager - manages staff, orders, and reports
Permissions: 24 permissions (see matrix below)
```

### Role 3: Kitchen Staff

```
Name: Kitchen Staff
Description: Kitchen staff - manages orders and food preparation
Permissions: 4 permissions (see matrix below)
```

### Role 4: Accountant

```
Name: Accountant
Description: Handles financial transactions and payment processing
Permissions: 9 permissions (see matrix below)
```

## Complete Permission List

### Orders (4 permissions)

| Permission   | Code            | Description         |
| ------------ | --------------- | ------------------- |
| Create Order | `orders:create` | Create new orders   |
| Read Order   | `orders:read`   | View orders         |
| Update Order | `orders:update` | Update order status |
| Delete Order | `orders:delete` | Delete orders       |

### Menu (4 permissions)

| Permission       | Code          | Description       |
| ---------------- | ------------- | ----------------- |
| Create Menu Item | `menu:create` | Create menu items |
| Read Menu Item   | `menu:read`   | View menu items   |
| Update Menu Item | `menu:update` | Update menu items |
| Delete Menu Item | `menu:delete` | Delete menu items |

### QR Codes (4 permissions)

| Permission | Code        | Description       |
| ---------- | ----------- | ----------------- |
| Create QR  | `qr:create` | Generate QR codes |
| Read QR    | `qr:read`   | View QR codes     |
| Update QR  | `qr:update` | Update QR codes   |
| Delete QR  | `qr:delete` | Delete QR codes   |

### Customers (4 permissions)

| Permission      | Code               | Description                 |
| --------------- | ------------------ | --------------------------- |
| Create Customer | `customers:create` | Create customer records     |
| Read Customer   | `customers:read`   | View customer information   |
| Update Customer | `customers:update` | Update customer information |
| Delete Customer | `customers:delete` | Delete customer records     |

### Users (4 permissions)

| Permission  | Code           | Description          |
| ----------- | -------------- | -------------------- |
| Create User | `users:create` | Create user accounts |
| Read User   | `users:read`   | View user accounts   |
| Update User | `users:update` | Update user accounts |
| Delete User | `users:delete` | Delete user accounts |

### Roles (4 permissions)

| Permission  | Code           | Description      |
| ----------- | -------------- | ---------------- |
| Create Role | `roles:create` | Create new roles |
| Read Role   | `roles:read`   | View roles       |
| Update Role | `roles:update` | Update roles     |
| Delete Role | `roles:delete` | Delete roles     |

### Permissions (4 permissions)

| Permission        | Code                 | Description        |
| ----------------- | -------------------- | ------------------ |
| Create Permission | `permissions:create` | Create permissions |
| Read Permission   | `permissions:read`   | View permissions   |
| Update Permission | `permissions:update` | Update permissions |
| Delete Permission | `permissions:delete` | Delete permissions |

### Payments (4 permissions)

| Permission     | Code              | Description            |
| -------------- | ----------------- | ---------------------- |
| Create Payment | `payments:create` | Process payments       |
| Read Payment   | `payments:read`   | View payment records   |
| Update Payment | `payments:update` | Update payment records |
| Delete Payment | `payments:delete` | Delete payment records |

### Analytics (4 permissions)

| Permission       | Code               | Description                |
| ---------------- | ------------------ | -------------------------- |
| Create Analytics | `analytics:create` | Generate reports           |
| Read Analytics   | `analytics:read`   | View analytics and reports |
| Update Analytics | `analytics:update` | Update report settings     |
| Delete Analytics | `analytics:delete` | Delete reports             |

### Restaurant (2 permissions)

| Permission        | Code                | Description                |
| ----------------- | ------------------- | -------------------------- |
| Read Restaurant   | `restaurant:read`   | View restaurant settings   |
| Update Restaurant | `restaurant:update` | Update restaurant settings |

### Subscription (2 permissions)

| Permission          | Code                  | Description               |
| ------------------- | --------------------- | ------------------------- |
| Read Subscription   | `subscription:read`   | View subscription details |
| Update Subscription | `subscription:update` | Update subscription       |

## Role-Permission Matrix

### Superadmin Permissions (38/38)

```
✅ orders:create      ✅ orders:read        ✅ orders:update      ✅ orders:delete
✅ menu:create        ✅ menu:read          ✅ menu:update        ✅ menu:delete
✅ qr:create          ✅ qr:read            ✅ qr:update          ✅ qr:delete
✅ customers:create   ✅ customers:read     ✅ customers:update   ✅ customers:delete
✅ users:create       ✅ users:read         ✅ users:update       ✅ users:delete
✅ roles:create       ✅ roles:read         ✅ roles:update       ✅ roles:delete
✅ permissions:create ✅ permissions:read   ✅ permissions:update ✅ permissions:delete
✅ payments:create    ✅ payments:read      ✅ payments:update    ✅ payments:delete
✅ analytics:create   ✅ analytics:read     ✅ analytics:update   ✅ analytics:delete
✅ restaurant:read    ✅ restaurant:update
✅ subscription:read  ✅ subscription:update
```

### Manager Permissions (24/38)

```
✅ orders:create      ✅ orders:read        ✅ orders:update      ❌ orders:delete
✅ menu:create        ✅ menu:read          ✅ menu:update        ✅ menu:delete
✅ qr:create          ✅ qr:read            ✅ qr:update          ✅ qr:delete
✅ customers:create   ✅ customers:read     ✅ customers:update   ✅ customers:delete
✅ users:create       ✅ users:read         ✅ users:update       ❌ users:delete
❌ roles:create       ❌ roles:read         ❌ roles:update       ❌ roles:delete
❌ permissions:create ❌ permissions:read   ❌ permissions:update ❌ permissions:delete
❌ payments:create    ❌ payments:read      ❌ payments:update    ❌ payments:delete
❌ analytics:create   ✅ analytics:read     ❌ analytics:update   ❌ analytics:delete
✅ restaurant:read    ✅ restaurant:update
❌ subscription:read  ❌ subscription:update
```

### Kitchen Staff Permissions (4/38)

```
❌ orders:create      ✅ orders:read        ✅ orders:update      ❌ orders:delete
❌ menu:create        ✅ menu:read          ❌ menu:update        ❌ menu:delete
❌ qr:create          ✅ qr:read            ❌ qr:update          ❌ qr:delete
❌ customers:create   ❌ customers:read     ❌ customers:update   ❌ customers:delete
❌ users:create       ❌ users:read         ❌ users:update       ❌ users:delete
❌ roles:create       ❌ roles:read         ❌ roles:update       ❌ roles:delete
❌ permissions:create ❌ permissions:read   ❌ permissions:update ❌ permissions:delete
❌ payments:create    ❌ payments:read      ❌ payments:update    ❌ payments:delete
❌ analytics:create   ❌ analytics:read     ❌ analytics:update   ❌ analytics:delete
✅ restaurant:read    ❌ restaurant:update
❌ subscription:read  ❌ subscription:update
```

### Accountant Permissions (9/38)

```
❌ orders:create      ✅ orders:read        ❌ orders:update      ❌ orders:delete
❌ menu:create        ❌ menu:read          ❌ menu:update        ❌ menu:delete
❌ qr:create          ❌ qr:read            ❌ qr:update          ❌ qr:delete
❌ customers:create   ✅ customers:read     ❌ customers:update   ❌ customers:delete
❌ users:create       ❌ users:read         ❌ users:update       ❌ users:delete
❌ roles:create       ❌ roles:read         ❌ roles:update       ❌ roles:delete
❌ permissions:create ❌ permissions:read   ❌ permissions:update ❌ permissions:delete
✅ payments:create    ✅ payments:read      ✅ payments:update    ❌ payments:delete
✅ analytics:create   ✅ analytics:read     ❌ analytics:update   ❌ analytics:delete
✅ restaurant:read    ❌ restaurant:update
❌ subscription:read  ❌ subscription:update
```

## Summary Statistics

| Metric                      | Value     |
| --------------------------- | --------- |
| Total Roles                 | 4         |
| Total Permissions           | 38        |
| Superadmin Permissions      | 38 (100%) |
| Manager Permissions         | 24 (63%)  |
| Kitchen Staff Permissions   | 4 (11%)   |
| Accountant Permissions      | 9 (24%)   |
| Total Role-Permission Links | 75        |

## JSON Schema

### Role Structure

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "string",
  "description": "string",
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Permission Structure

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "string",
  "description": "string",
  "resource": "string",
  "action": "string",
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Role-Permission Junction

```json
{
  "id": "uuid",
  "roleId": "uuid",
  "permissionId": "uuid"
}
```

## Usage Example

### Check if user can perform action

```typescript
// User has Kitchen Staff role
const userRole = 'Kitchen Staff';

// Check permission
const hasPermission = ROLE_PERMISSION_MAPPING[userRole].includes('orders:update');
// Result: true ✅

// Try restricted action
const canDelete = ROLE_PERMISSION_MAPPING[userRole].includes('orders:delete');
// Result: false ❌
```

### Add new role with custom permissions

```typescript
// 1. Create new role
const newRole = await rolesService.createRole(tenantId, {
  name: 'Waiter',
  description: 'Takes orders and serves customers',
});

// 2. Assign specific permissions
const permissionIds = [
  permissionMap['orders:create'],
  permissionMap['orders:read'],
  permissionMap['customers:read'],
];

await rolesService.assignPermissionsToRole(tenantId, newRole.id, permissionIds);
```

## Modification Guide

### Add New Permission

1. Add to `DEFAULT_PERMISSIONS` in `roleSeeding.service.ts`
2. Update relevant roles in `ROLE_PERMISSION_MAPPING`
3. Redeploy

### Add New Role

1. Add to `DEFAULT_ROLES` in `roleSeeding.service.ts`
2. Add permissions mapping in `ROLE_PERMISSION_MAPPING`
3. Redeploy

### Change Permission Assignment

1. Modify `ROLE_PERMISSION_MAPPING` in `roleSeeding.service.ts`
2. Manually update existing tenant records or run seeding script
3. Redeploy
