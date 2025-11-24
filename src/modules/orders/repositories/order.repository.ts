import { v4 as uuid } from 'uuid';
import { OrderModel } from '../models/order.model';

const ordersByTenant = new Map<string, OrderModel[]>();

const getCollection = (tenantId: string) => {
  if (!ordersByTenant.has(tenantId)) {
    ordersByTenant.set(tenantId, []);
  }
  return ordersByTenant.get(tenantId)!;
};

export class OrderRepository {
  async create(tenantId: string, order: Omit<OrderModel, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>) {
    const collection = getCollection(tenantId);
    const entity: OrderModel = {
      ...order,
      id: uuid(),
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    collection.push(entity);
    return entity;
  }

  async findAll(tenantId: string) {
    return getCollection(tenantId);
  }

  async findById(tenantId: string, id: string) {
    return getCollection(tenantId).find(order => order.id === id);
  }

  async update(tenantId: string, id: string, payload: Partial<OrderModel>) {
    const order = await this.findById(tenantId, id);
    if (order) {
      Object.assign(order, payload, { updatedAt: new Date() });
    }
    return order;
  }
}

export const orderRepository = new OrderRepository();
