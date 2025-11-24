import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { OrderStatus } from '../models/order.model';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'canceled'])
  status?: OrderStatus;
}
