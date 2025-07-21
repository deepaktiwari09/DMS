import { IsString, IsUUID, IsOptional, IsNumber, Min, IsObject, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsUUID()
  dealershipId: string;

  @IsString()
  sku: string;

  @IsString()
  type: string; // motorcycle, part, accessory

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  costPrice?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  sellingPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantityOnHand?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderPoint?: number;

  @IsOptional()
  @IsObject()
  supplierInfo?: {
    name?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    leadTime?: number;
    minimumOrder?: number;
  };
}