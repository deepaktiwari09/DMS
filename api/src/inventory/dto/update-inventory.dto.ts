import { IsString, IsOptional, IsNumber, Min, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  costPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  sellingPrice?: number;

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}