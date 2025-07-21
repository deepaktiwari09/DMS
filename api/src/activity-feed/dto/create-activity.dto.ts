import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateActivityDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  dealershipId?: string;

  @IsString()
  entityType: string; // customer, sale, service, inventory

  @IsUUID()
  entityId: string;

  @IsString()
  action: string; // created, updated, deleted, transferred

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}