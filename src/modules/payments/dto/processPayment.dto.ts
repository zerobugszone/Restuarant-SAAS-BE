import { IsNumber, IsString } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  orderId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  method!: string;
}
