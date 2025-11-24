import { TenantModel } from '../models/tenant.model';
import { v4 as uuid } from 'uuid';

const tenants: TenantModel[] = [];

export class TenantRepository {
  async create(payload: Partial<TenantModel>): Promise<TenantModel> {
    const tenant: TenantModel = {
      id: uuid(),
      name: payload.name ?? 'Unnamed Tenant',
      subdomain: payload.subdomain ?? 'example',
      status: (payload.status as TenantModel['status']) ?? 'active',
      plan: payload.plan ?? 'basic',
      createdAt: new Date()
    };

    tenants.push(tenant);
    return tenant;
  }

  async findAll(): Promise<TenantModel[]> {
    return tenants;
  }

  async findById(id: string): Promise<TenantModel | undefined> {
    return tenants.find(tenant => tenant.id === id);
  }

  async update(id: string, payload: Partial<TenantModel>): Promise<TenantModel | undefined> {
    const tenant = await this.findById(id);
    if (tenant) {
      Object.assign(tenant, payload);
    }
    return tenant;
  }
}

export const tenantRepository = new TenantRepository();
