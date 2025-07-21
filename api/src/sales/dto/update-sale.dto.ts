import { IsUUID, IsString, IsOptional, IsNumber, IsArray, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleItem } from './create-sale.dto';

export class UpdateSaleDto {
  @IsOptional()
  @IsUUID()
  salesPersonId?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalAmount?: number;

  @IsOptional()
  @IsArray()
  items?: SaleItem[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  estimatedCloseDate?: string;

  @IsOptional()
  @IsDateString()
  actualCloseDate?: string;

  @IsOptional()
  @IsString()
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsString()
  lostReason?: string; // Only used when stage is closed_lost
}