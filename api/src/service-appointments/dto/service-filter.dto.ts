import { IsOptional, IsString, IsUUID, IsDateString, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statuses?: string[];

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsDateString()
  scheduledDateFrom?: string;

  @IsOptional()
  @IsDateString()
  scheduledDateTo?: string;

  @IsOptional()
  @IsDateString()
  createdDateFrom?: string;

  @IsOptional()
  @IsDateString()
  createdDateTo?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledStart';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  groupBy?: string;

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