import { CustomerRepository, customerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../dto/createCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';

export class CustomerService {
  constructor(private readonly repository: CustomerRepository = customerRepository) {}

  create(tenantId: string, payload: CreateCustomerDto) {
    return this.repository.create(tenantId, { tenantId, ...payload });
  }

  list(tenantId: string) {
    return this.repository.findAll(tenantId);
  }

  findById(tenantId: string, id: string) {
    return this.repository.findById(tenantId, id);
  }

  update(tenantId: string, id: string, payload: UpdateCustomerDto) {
    return this.repository.update(tenantId, id, payload);
  }
}
