import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  tenantId!: string;

  @IsString()
  planType!: string;

  @IsString()
  status!: 'active' | 'canceled' | 'past_due';

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
