import {
  roles,
  userRoles,
  rolePermissions,
  permissions,
} from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { paginatedData } from '@/core/helper/pagination_helper';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { eq, and, ilike } from 'drizzle-orm';

export interface CreateRoleDTO {
  name: string;
  description?: string;
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface RoleWithPermissions {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: Array<{
    id: string;
    name: string;
    resource: string;
    action: string;
  }>;
  userCount: number;
}

export class RolesService {
  async createRole(tenantId: string, data: CreateRoleDTO) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    // Check if role already exists
    const existing = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.name, data.name)));

    if (existing.length > 0) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Role already exists',
        errorCodes.VALIDATION_ERROR
      );
    }

    const result = await db
      .insert(roles)
      .values({
        tenantId,
        name: data.name,
        description: data.description,
        isActive: true,
      })
      .returning();

    return result[0];
  }

  async getRoles(
    tenantId: string,
    page: number = 1,
    perPage: number = 10,
    search?: string
  ): Promise<any> {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const match: Record<string, any> = { tenantId };
    if (search) {
      // Using ilike for search
      const searchRoles = await db
        .select()
        .from(roles)
        .where(and(eq(roles.tenantId, tenantId), ilike(roles.name, `%${search}%`)));

      if (searchRoles.length === 0) {
        return {
          totalRecords: 0,
          records: [],
          perPage,
          currentPage: page,
          next: null,
          prev: null,
          totalPages: 0,
          pagingCounter: 0,
          hasPrevious: false,
          hasNext: false,
          recordShown: 0,
        };
      }
    }

    return paginatedData(db, roles, match, { createdAt: -1 }, page, perPage);
  }

  async getRoleByName(tenantId: string, roleName: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.name, roleName)));

    return role && role.length > 0 ? role[0] : null;
  }

  async getRoleById(tenantId: string, roleId: string): Promise<RoleWithPermissions | null> {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)));

    if (!role || role.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Role not found', errorCodes.NOT_FOUND);
    }

    // Get role permissions
    const rolePerms = await db
      .select({
        permissionId: rolePermissions.permissionId,
        name: permissions.name,
        resource: permissions.resource,
        action: permissions.action,
        id: permissions.id,
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    // Get user count
    const userCount = await db.select().from(userRoles).where(eq(userRoles.roleId, roleId));

    const filteredPerms = rolePerms
      .filter(p => p.id !== null)
      .map(p => ({
        id: p.id!,
        name: p.name!,
        resource: p.resource!,
        action: p.action!,
      }));

    return {
      ...role[0],
      permissions: filteredPerms,
      userCount: userCount.length,
    };
  }

  async updateRole(tenantId: string, roleId: string, data: UpdateRoleDTO) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)));

    if (!role || role.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Role not found', errorCodes.NOT_FOUND);
    }

    const updateData: Record<string, any> = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .update(roles)
      .set(updateData)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)))
      .returning();

    return result[0];
  }

  async deleteRole(tenantId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)));

    if (!role || role.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Role not found', errorCodes.NOT_FOUND);
    }

    // Check if role has users
    const userCount = await db.select().from(userRoles).where(eq(userRoles.roleId, roleId));

    if (userCount.length > 0) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Cannot delete role with assigned users',
        errorCodes.VALIDATION_ERROR
      );
    }

    await db.delete(roles).where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)));

    return { message: 'Role deleted successfully' };
  }

  async assignPermissionsToRole(tenantId: string, roleId: string, permissionIds: string[]) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    // Verify role exists
    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.id, roleId)));

    if (!role || role.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Role not found', errorCodes.NOT_FOUND);
    }

    // Delete existing permissions
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    // Insert new permissions
    if (permissionIds.length > 0) {
      await db.insert(rolePermissions).values(
        permissionIds.map(permissionId => ({
          roleId,
          permissionId,
        }))
      );
    }

    return { message: 'Permissions assigned successfully' };
  }
}

export const rolesService = new RolesService();
