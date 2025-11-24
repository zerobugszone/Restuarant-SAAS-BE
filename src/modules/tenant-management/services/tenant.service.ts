import { TenantRepository, tenantRepository } from '../repositories/tenant.repository';
import { CreateTenantDto } from '../dto/createTenant.dto';
import { UpdateTenantDto } from '../dto/updateTenant.dto';

export class TenantService {
  constructor(private readonly repository: TenantRepository = tenantRepository) {}

  create(payload: CreateTenantDto) {
    return this.repository.create(payload);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: string, payload: UpdateTenantDto) {
    return this.repository.update(id, payload);
  }
}
