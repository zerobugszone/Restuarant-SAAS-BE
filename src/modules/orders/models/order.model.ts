import { OrderItemModel } from './orderItem.model';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'canceled';

export interface OrderModel {
  id: string;
  tenantId: string;
  customerName: string;
  tableNumber?: string;
  total: number;
  status: OrderStatus;
  items: OrderItemModel[];
  createdAt: Date;
  updatedAt: Date;
}
