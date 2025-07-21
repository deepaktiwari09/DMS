import { IsUUID, IsString, IsOptional, IsDateString, IsObject, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleInfo, PartUsed } from './create-service-appointment.dto';

export class UpdateServiceAppointmentDto {
  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsObject()
  vehicleInfo?: VehicleInfo;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  scheduledStart?: string;

  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @IsOptional()
  @IsDateString()
  actualStart?: string;

  @IsOptional()
  @IsDateString()
  actualEnd?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  laborHours?: number;

  @IsOptional()
  @IsObject()
  partsUsed?: PartUsed[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalCost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}