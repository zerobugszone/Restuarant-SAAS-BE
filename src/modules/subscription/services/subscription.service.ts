import { SubscriptionRepository, subscriptionRepository } from '../repositories/subscription.repository';
import { CreateSubscriptionDto } from '../dto/createSubscription.dto';
import { UpdateSubscriptionDto } from '../dto/updateSubscription.dto';

export class SubscriptionService {
  constructor(private readonly repository: SubscriptionRepository = subscriptionRepository) {}

  create(payload: CreateSubscriptionDto) {
    return this.repository.create({
      tenantId: payload.tenantId,
      planType: payload.planType,
      status: payload.status,
      startDate: new Date(payload.startDate),
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      amount: payload.amount
    });
  }

  findByTenant(tenantId: string) {
    return this.repository.findByTenant(tenantId);
  }

  update(id: string, payload: UpdateSubscriptionDto) {
    const parsed: Partial<CreateSubscriptionDto> = {
      planType: payload.planType,
      status: payload.status,
      endDate: payload.endDate,
      amount: payload.amount
    };

    return this.repository.update(id, {
      ...parsed,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined
    });
  }
}
