import { IsUUID, IsString, IsOptional } from 'class-validator';

export class TransferCustomerDto {
  @IsUUID()
  toDealershipId: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}