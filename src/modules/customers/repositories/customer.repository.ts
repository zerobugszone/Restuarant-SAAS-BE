import { v4 as uuid } from 'uuid';
import { CustomerModel } from '../models/customer.model';

const customers = new Map<string, CustomerModel[]>();

const bucket = (tenantId: string) => {
  if (!customers.has(tenantId)) {
    customers.set(tenantId, []);
  }
  return customers.get(tenantId)!;
};

export class CustomerRepository {
  async create(tenantId: string, payload: Omit<CustomerModel, 'id' | 'createdAt'>) {
    const customer: CustomerModel = { ...payload, id: uuid(), createdAt: new Date(), tenantId };
    bucket(tenantId).push(customer);
    return customer;
  }

  async findAll(tenantId: string) {
    return bucket(tenantId);
  }

  async findById(tenantId: string, id: string) {
    return bucket(tenantId).find(customer => customer.id === id);
  }

  async update(tenantId: string, id: string, payload: Partial<CustomerModel>) {
    const customer = await this.findById(tenantId, id);
    if (customer) {
      Object.assign(customer, payload);
    }
    return customer;
  }
}

export const customerRepository = new CustomerRepository();
