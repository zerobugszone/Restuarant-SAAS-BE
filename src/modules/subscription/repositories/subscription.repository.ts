import { v4 as uuid } from 'uuid';
import { SubscriptionModel } from '../models/subscription.model';

const subscriptions: SubscriptionModel[] = [];

export class SubscriptionRepository {
  async create(payload: Omit<SubscriptionModel, 'id'>): Promise<SubscriptionModel> {
    const subscription: SubscriptionModel = { ...payload, id: uuid() };
    subscriptions.push(subscription);
    return subscription;
  }

  async findById(id: string) {
    return subscriptions.find(sub => sub.id === id);
  }

  async findByTenant(tenantId: string) {
    return subscriptions.filter(sub => sub.tenantId === tenantId);
  }

  async update(id: string, payload: Partial<SubscriptionModel>) {
    const subscription = await this.findById(id);
    if (subscription) {
      Object.assign(subscription, payload);
    }
    return subscription;
  }
}

export const subscriptionRepository = new SubscriptionRepository();
