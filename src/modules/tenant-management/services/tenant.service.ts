import tenantRepository from '../repositories/tenant.repository';
import { CreateTenantDto } from '../dto/createTenant.dto';
import { UpdateTenantDto } from '../dto/updateTenant.dto';

class TenantService {
  async create(payload: CreateTenantDto) {
    return await tenantRepository.create(payload);
  }

  async getAllTenants() {
    return await tenantRepository.getAllTenants();
  }
}

export default new TenantService();
