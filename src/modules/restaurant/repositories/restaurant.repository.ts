import { v4 as uuid } from 'uuid';
import { RestaurantModel } from '../models/restaurant.model';

const restaurants = new Map<string, RestaurantModel>();

export class RestaurantRepository {
  async upsert(tenantId: string, payload: Partial<RestaurantModel>) {
    const existing = restaurants.get(tenantId) ?? {
      id: uuid(),
      tenantId,
      name: 'My Restaurant',
      description: '',
      address: '',
      phone: '',
      email: '',
      logo: '',
      timezone: '',
      currency: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = { ...existing, ...payload, updatedAt: new Date(), tenantId };
    restaurants.set(tenantId, updated);
    return updated;
  }

  async get(tenantId: string) {
    return restaurants.get(tenantId) ?? null;
  }
}

export const restaurantRepository = new RestaurantRepository();
