import { IsUUID, IsString, IsOptional, IsDateString, IsObject, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export interface VehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
  mileage?: number;
  color?: string;
}

export interface PartUsed {
  inventoryId: string;
  quantity: number;
  unitCost: number;
  notes?: string;
}

export class CreateServiceAppointmentDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  dealershipId: string;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsObject()
  vehicleInfo?: VehicleInfo;

  @IsString()
  serviceType: string;

  @IsOptional()
  @IsString()
  status?: string = 'scheduled';

  @IsDateString()
  scheduledStart: string;

  @IsDateString()
  scheduledEnd: string;

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