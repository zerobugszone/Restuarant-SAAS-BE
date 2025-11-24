import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  planType?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'canceled' | 'past_due';

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
