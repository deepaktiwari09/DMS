import { IsOptional, IsString, IsUUID, IsNumber, Min, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in name, sku, description

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsOptional()
  @IsString()
  type?: string; // motorcycle, part, accessory

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string = 'name'; // name, sku, type, category, sellingPrice, quantityOnHand, createdAt

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  groupBy?: string; // type, category, supplier, stockStatus

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}