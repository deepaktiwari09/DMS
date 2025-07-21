import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { FilterConfig, SortConfig, GroupConfig } from './create-inventory-view.dto';

export class UpdateInventoryViewDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isShared?: boolean;

  @IsOptional()
  @IsObject()
  filterConfig?: FilterConfig;

  @IsOptional()
  @IsObject()
  sortConfig?: SortConfig;

  @IsOptional()
  @IsObject()
  groupConfig?: GroupConfig;
}