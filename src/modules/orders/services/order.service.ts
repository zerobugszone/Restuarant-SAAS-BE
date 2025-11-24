import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { OrderRepository, orderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';
import { canTransitionStatus } from '../validators/order.validator';

export class OrderService {
  constructor(private readonly repository: OrderRepository = orderRepository) {}

  create(tenantId: string, payload: CreateOrderDto) {
    return this.repository.create(tenantId, {
      customerName: payload.customerName,
      tableNumber: payload.tableNumber,
      total: payload.total,
      status: 'pending',
      items: payload.items
    });
  }

  findAll(tenantId: string) {
    return this.repository.findAll(tenantId);
  }

  findById(tenantId: string, id: string) {
    return this.repository.findById(tenantId, id);
  }

  async update(tenantId: string, id: string, payload: UpdateOrderDto) {
    if (payload.status) {
      await this.ensureValidStatusTransition(tenantId, id, payload.status);
    }
    return this.repository.update(tenantId, id, payload);
  }

  async updateStatus(tenantId: string, id: string, status: UpdateOrderDto['status']) {
    await this.ensureValidStatusTransition(tenantId, id, status);
    return this.repository.update(tenantId, id, { status });
  }

  private async ensureValidStatusTransition(tenantId: string, id: string, nextStatus?: UpdateOrderDto['status']) {
    if (!nextStatus) return;
    const order = await this.repository.findById(tenantId, id);
    if (!order) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Order not found', errorCodes.NOT_FOUND);
    }
    if (!canTransitionStatus(order.status, nextStatus)) {
      throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid status transition', errorCodes.VALIDATION_ERROR);
    }
  }
}
