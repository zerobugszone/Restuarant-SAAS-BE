import { IsOptional, IsString } from 'class-validator';

export class UpdateQrDto {
  @IsOptional()
  @IsString()
  tableId?: string;

  @IsOptional()
  @IsString()
  menuSectionId?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  type?: 'table' | 'menu';
}
