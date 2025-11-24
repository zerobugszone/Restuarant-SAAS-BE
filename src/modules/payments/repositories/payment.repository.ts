import { v4 as uuid } from 'uuid';
import { PaymentModel } from '../models/payment.model';

const payments = new Map<string, PaymentModel[]>();

const list = (tenantId: string) => {
  if (!payments.has(tenantId)) {
    payments.set(tenantId, []);
  }
  return payments.get(tenantId)!;
};

export class PaymentRepository {
  async create(tenantId: string, payload: Omit<PaymentModel, 'id' | 'createdAt'>) {
    const payment: PaymentModel = { ...payload, id: uuid(), createdAt: new Date(), tenantId };
    list(tenantId).push(payment);
    return payment;
  }

  async findById(tenantId: string, id: string) {
    return list(tenantId).find(payment => payment.id === id);
  }

  async findByOrder(tenantId: string, orderId: string) {
    return list(tenantId).filter(payment => payment.orderId === orderId);
  }
}

export const paymentRepository = new PaymentRepository();
