import { IsUUID, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsString()
  type: string; // inventory_alert, sales_update, service_reminder

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}