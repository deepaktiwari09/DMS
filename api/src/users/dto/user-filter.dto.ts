import { IsOptional, IsString, IsBoolean, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserFilterDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in firstName, lastName, email

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // firstName, lastName, email, role, createdAt

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}