import { IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerSearchDto {
  @IsOptional()
  @IsString()
  search?: string; // Search in firstName, lastName, email, phone

  @IsOptional()
  @IsUUID()
  primaryDealershipId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  preferredContactMethod?: 'email' | 'phone' | 'sms';

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // firstName, lastName, email, lifetimeValue, createdAt

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