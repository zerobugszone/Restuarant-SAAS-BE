import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsString()
  menuItemId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsString()
  customerName!: string;

  @IsOptional()
  @IsString()
  tableNumber?: string;

  @IsNumber()
  total!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
