import { IsUUID, IsString, IsOptional, IsNumber, IsArray, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export interface SaleItem {
  inventoryId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  notes?: string;
}

export class CreateSaleDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  dealershipId: string;

  @IsOptional()
  @IsUUID()
  salesPersonId?: string;

  @IsOptional()
  @IsString()
  stage?: string = 'lead'; // lead, qualified, proposal, negotiation, closed_won, closed_lost

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
  @IsString()
  source?: string; // website, referral, walk_in, phone, etc.

  @IsOptional()
  @IsString()
  priority?: 'low' | 'medium' | 'high' = 'medium';
}