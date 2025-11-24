import { PaymentRepository, paymentRepository } from '../repositories/payment.repository';
import { ProcessPaymentDto } from '../dto/processPayment.dto';
import { PaymentGatewayService, paymentGatewayService } from './paymentGateway.service';

export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository = paymentRepository,
    private readonly gateway: PaymentGatewayService = paymentGatewayService
  ) {}

  async process(tenantId: string, payload: ProcessPaymentDto) {
    const result = await this.gateway.charge(payload.amount, payload.method);
    return this.repository.create(tenantId, {
      tenantId,
      orderId: payload.orderId,
      amount: payload.amount,
      method: payload.method,
      status: result.status as 'succeeded',
      reference: result.reference
    });
  }

  listByOrder(tenantId: string, orderId: string) {
    return this.repository.findByOrder(tenantId, orderId);
  }

  getById(tenantId: string, id: string) {
    return this.repository.findById(tenantId, id);
  }
}
