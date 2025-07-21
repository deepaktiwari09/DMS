import { IsOptional, IsDateString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsDateString()
  readAt?: string;
}