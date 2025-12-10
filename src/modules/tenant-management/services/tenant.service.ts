import tenantRepository from '../repositories/tenant.repository';
import { CreateTenantDto } from '../dto/createTenant.dto';
import { UpdateTenantDto } from '../dto/updateTenant.dto';

class TenantService {
  async create(payload: CreateTenantDto) {
    return await tenantRepository.create(payload);
  }

  async getAllTenants(
    matchData: Record<string, any>,
    sortData: Record<string, 'asc' | 'desc'>,
    page: number,
    perPage: number
  ) {
    return await tenantRepository.getAllTenants(matchData, sortData, page, perPage);
  }
}

export default new TenantService();
