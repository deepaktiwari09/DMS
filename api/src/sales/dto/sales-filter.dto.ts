import { IsOptional, IsString, IsUUID, IsNumber, Min, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SalesFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in customer name, notes

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsOptional()
  @IsUUID()
  salesPersonId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stages?: string[]; // Multiple stages filter

  @IsOptional()
  @IsString()
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAmount?: number;

  @IsOptional()
  @IsDateString()
  estimatedCloseDateFrom?: string;

  @IsOptional()
  @IsDateString()
  estimatedCloseDateTo?: string;

  @IsOptional()
  @IsDateString()
  createdDateFrom?: string;

  @IsOptional()
  @IsDateString()
  createdDateTo?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // createdAt, totalAmount, estimatedCloseDate, stage

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  groupBy?: string; // stage, salesPerson, priority, source

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