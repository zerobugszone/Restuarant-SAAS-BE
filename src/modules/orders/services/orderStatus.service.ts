import { OrderStatus } from '../models/order.model';

const statuses: OrderStatus[] = ['pending', 'in_progress', 'completed', 'canceled'];

export const listOrderStatuses = () => statuses;
