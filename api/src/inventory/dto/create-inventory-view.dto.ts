import { IsString, IsOptional, IsBoolean, IsObject, IsUUID } from 'class-validator';

export interface FilterConfig {
  search?: string;
  type?: string;
  category?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
  supplierName?: string;
  isActive?: boolean;
  dealershipId?: string;
}

export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

export interface GroupConfig {
  field: string;
  showCounts?: boolean;
  expandAll?: boolean;
}

export class CreateInventoryViewDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isShared?: boolean = false;

  @IsObject()
  filterConfig: FilterConfig;

  @IsObject()
  sortConfig: SortConfig;

  @IsOptional()
  @IsObject()
  groupConfig?: GroupConfig;
}