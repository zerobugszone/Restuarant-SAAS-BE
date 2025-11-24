import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name!: string;

  @IsString()
  subdomain!: string;

  @IsEmail()
  email!: string;

  @IsString()
  plan!: string;

  @IsOptional()
  settings?: Record<string, unknown>;
}
