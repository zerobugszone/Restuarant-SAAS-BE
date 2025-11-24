import { OrderModel } from '../models/order.model';

export const canTransitionStatus = (current: OrderModel['status'], next: OrderModel['status']) => {
  const allowed: Record<OrderModel['status'], OrderModel['status'][]> = {
    pending: ['in_progress', 'canceled'],
    in_progress: ['completed', 'canceled'],
    completed: [],
    canceled: []
  };

  return allowed[current].includes(next);
};
