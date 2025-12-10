import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { roles, permissions } from '@/core/database/schemas/tenant/auth.schema';
import { logger } from '@/core/utils/logger.util';

/**
 * Default roles for restaurant SaaS
 */
const DEFAULT_ROLES = [
  {
    name: 'Superadmin',
    description: 'Full system access - manages all restaurant operations',
  },
  {
    name: 'Manager',
    description: 'Restaurant manager - manages staff, orders, and reports',
  },
  {
    name: 'Kitchen Staff',
    description: 'Kitchen staff - manages orders and food preparation',
  },
  {
    name: 'Accountant',
    description: 'Handles financial transactions and payment processing',
  },
];

/**
 * Default permissions for restaurant SaaS
 * Format: { resource: string, action: string, description: string }
 */
const DEFAULT_PERMISSIONS = [
  // Orders Permissions
  { resource: 'orders', action: 'create', description: 'Create new orders' },
  { resource: 'orders', action: 'read', description: 'View orders' },
  { resource: 'orders', action: 'update', description: 'Update order status' },
  { resource: 'orders', action: 'delete', description: 'Delete orders' },

  // Menu Permissions
  { resource: 'menu', action: 'create', description: 'Create menu items' },
  { resource: 'menu', action: 'read', description: 'View menu items' },
  { resource: 'menu', action: 'update', description: 'Update menu items' },
  { resource: 'menu', action: 'delete', description: 'Delete menu items' },

  // QR Code Permissions
  { resource: 'qr', action: 'create', description: 'Generate QR codes' },
  { resource: 'qr', action: 'read', description: 'View QR codes' },
  { resource: 'qr', action: 'update', description: 'Update QR codes' },
  { resource: 'qr', action: 'delete', description: 'Delete QR codes' },

  // Customers Permissions
  { resource: 'customers', action: 'create', description: 'Create customer records' },
  { resource: 'customers', action: 'read', description: 'View customer information' },
  { resource: 'customers', action: 'update', description: 'Update customer information' },
  { resource: 'customers', action: 'delete', description: 'Delete customer records' },

  // Users & Staff Management
  { resource: 'users', action: 'create', description: 'Create user accounts' },
  { resource: 'users', action: 'read', description: 'View user accounts' },
  { resource: 'users', action: 'update', description: 'Update user accounts' },
  { resource: 'users', action: 'delete', description: 'Delete user accounts' },

  // Roles & Permissions Management
  { resource: 'roles', action: 'create', description: 'Create new roles' },
  { resource: 'roles', action: 'read', description: 'View roles' },
  { resource: 'roles', action: 'update', description: 'Update roles' },
  { resource: 'roles', action: 'delete', description: 'Delete roles' },

  { resource: 'permissions', action: 'create', description: 'Create permissions' },
  { resource: 'permissions', action: 'read', description: 'View permissions' },
  { resource: 'permissions', action: 'update', description: 'Update permissions' },
  { resource: 'permissions', action: 'delete', description: 'Delete permissions' },

  // Payments & Billing
  { resource: 'payments', action: 'create', description: 'Process payments' },
  { resource: 'payments', action: 'read', description: 'View payment records' },
  { resource: 'payments', action: 'update', description: 'Update payment records' },
  { resource: 'payments', action: 'delete', description: 'Delete payment records' },

  // Reports & Analytics
  { resource: 'analytics', action: 'create', description: 'Generate reports' },
  { resource: 'analytics', action: 'read', description: 'View analytics and reports' },
  { resource: 'analytics', action: 'update', description: 'Update report settings' },
  { resource: 'analytics', action: 'delete', description: 'Delete reports' },

  // Restaurant Settings
  { resource: 'restaurant', action: 'read', description: 'View restaurant settings' },
  { resource: 'restaurant', action: 'update', description: 'Update restaurant settings' },

  // Subscription Management
  { resource: 'subscription', action: 'read', description: 'View subscription details' },
  { resource: 'subscription', action: 'update', description: 'Update subscription' },
];

/**
 * Role-Permission Mapping
 * Defines which permissions each role has
 */
const ROLE_PERMISSION_MAPPING: Record<string, string[]> = {
  Superadmin: [
    // Superadmin has ALL permissions
    ...DEFAULT_PERMISSIONS.map(p => `${p.resource}:${p.action}`),
  ],
  Manager: [
    // Orders
    'orders:create',
    'orders:read',
    'orders:update',
    // Menu
    'menu:create',
    'menu:read',
    'menu:update',
    'menu:delete',
    // QR
    'qr:create',
    'qr:read',
    'qr:update',
    'qr:delete',
    // Customers
    'customers:create',
    'customers:read',
    'customers:update',
    'customers:delete',
    // Users
    'users:create',
    'users:read',
    'users:update',
    // Reports
    'analytics:read',
    // Restaurant
    'restaurant:read',
    'restaurant:update',
  ],
  'Kitchen Staff': [
    // Orders
    'orders:read',
    'orders:update',
    // Menu
    'menu:read',
    // QR
    'qr:read',
    // Restaurant
    'restaurant:read',
  ],
  Accountant: [
    // Orders
    'orders:read',
    // Payments
    'payments:create',
    'payments:read',
    'payments:update',
    // Reports & Analytics
    'analytics:read',
    'analytics:create',
    // Customers
    'customers:read',
    // Restaurant
    'restaurant:read',
  ],
};

/**
 * Seed default roles and permissions for a new tenant
 */
export class RoleSeedingService {
  /**
   * Seed roles and permissions for a tenant
   */
  async seedRolesAndPermissions(tenantId: string): Promise<void> {
    try {
      logger.info(`Seeding roles and permissions for tenant: ${tenantId}`);

      const db = await tenantConnectionPool.getConnection(tenantId);

      // Step 1: Seed all permissions
      const permissionMap: Record<string, string> = {};
      for (const permission of DEFAULT_PERMISSIONS) {
        const [createdPermission] = await db
          .insert(permissions)
          .values({
            tenantId,
            name: `${permission.resource} - ${permission.action}`,
            description: permission.description,
            resource: permission.resource,
            action: permission.action,
            isActive: true,
          })
          .returning();

        permissionMap[`${permission.resource}:${permission.action}`] = createdPermission.id;
        logger.debug(`✓ Created permission: ${permission.resource}:${permission.action}`);
      }

      logger.info(`✓ Seeded ${DEFAULT_PERMISSIONS.length} permissions`);

      // Step 2: Seed all roles
      for (const role of DEFAULT_ROLES) {
        const [createdRole] = await db
          .insert(roles)
          .values({
            tenantId,
            name: role.name,
            description: role.description,
            isSystem: true, // Mark as system role
            isActive: true,
          })
          .returning();

        logger.debug(`✓ Created role: ${role.name}`);

        // Step 3: Assign permissions to roles
        const rolePermissions = ROLE_PERMISSION_MAPPING[role.name] || [];
        for (const permissionKey of rolePermissions) {
          const permissionId = permissionMap[permissionKey];
          if (permissionId) {
            // Import rolePermissions table to assign permissions
            const { rolePermissions: rolePermissionsTable } = await import(
              '@/core/database/schemas/tenant/auth.schema'
            );

            await db
              .insert(rolePermissionsTable)
              .values({
                roleId: createdRole.id,
                permissionId: permissionId,
              })
              .onConflictDoNothing();

            logger.debug(`  ✓ Assigned permission: ${permissionKey} to role: ${role.name}`);
          }
        }
      }

      logger.info(`✓ Successfully seeded ${DEFAULT_ROLES.length} roles with permissions`);
    } catch (error) {
      logger.error(`Failed to seed roles and permissions:`, error);
      throw error;
    }
  }
}

export const roleSeedingService = new RoleSeedingService();
