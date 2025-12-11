import { permissions, rolePermissions } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { paginatedData } from '@/core/helper/pagination_helper';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { eq, and, ilike } from 'drizzle-orm';

export interface CreatePermissionDTO {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface UpdatePermissionDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export class PermissionsService {
  async createPermission(tenantId: string, data: CreatePermissionDTO) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    // Check if permission already exists
    const existing = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.tenantId, tenantId),
          eq(permissions.resource, data.resource),
          eq(permissions.action, data.action)
        )
      );

    if (existing.length > 0) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Permission already exists',
        errorCodes.VALIDATION_ERROR
      );
    }

    const result = await db
      .insert(permissions)
      .values({
        tenantId,
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        isActive: true,
      })
      .returning();

    return result[0];
  }

  async getPermissions(
    tenantId: string,
    page: number = 1,
    perPage: number = 10,
    resource?: string,
    search?: string
  ): Promise<any> {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const match: Record<string, any> = { tenantId };

    if (resource) {
      match.resource = resource;
    }

    if (search) {
      const searchPerms = await db
        .select()
        .from(permissions)
        .where(and(eq(permissions.tenantId, tenantId), ilike(permissions.name, `%${search}%`)));

      if (searchPerms.length === 0) {
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

    return paginatedData(db, permissions, match, { createdAt: -1 }, page, perPage);
  }

  async getPermissionById(tenantId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const permission = await db
      .select()
      .from(permissions)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.id, permissionId)));

    if (!permission || permission.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Permission not found', errorCodes.NOT_FOUND);
    }

    return permission[0];
  }

  async updatePermission(tenantId: string, permissionId: string, data: UpdatePermissionDTO) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const permission = await db
      .select()
      .from(permissions)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.id, permissionId)));

    if (!permission || permission.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Permission not found', errorCodes.NOT_FOUND);
    }

    const updateData: Record<string, any> = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .update(permissions)
      .set(updateData)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.id, permissionId)))
      .returning();

    return result[0];
  }

  async deletePermission(tenantId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);

    const permission = await db
      .select()
      .from(permissions)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.id, permissionId)));

    if (!permission || permission.length === 0) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Permission not found', errorCodes.NOT_FOUND);
    }

    // Check if permission is assigned to any roles
    const roleCount = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.permissionId, permissionId));

    if (roleCount.length > 0) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Cannot delete permission assigned to roles',
        errorCodes.VALIDATION_ERROR
      );
    }

    await db
      .delete(permissions)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.id, permissionId)));

    return { message: 'Permission deleted successfully' };
  }

  async getPermissionsByResource(tenantId: string, resource: string): Promise<any[]> {
    const db = await tenantConnectionPool.getConnection(tenantId);

    return db
      .select()
      .from(permissions)
      .where(and(eq(permissions.tenantId, tenantId), eq(permissions.resource, resource)));
  }
}

export const permissionsService = new PermissionsService();
