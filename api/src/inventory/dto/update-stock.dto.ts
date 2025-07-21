import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockDto {
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  type: 'add' | 'subtract' | 'set'; // add to current, subtract from current, or set absolute value

  @IsOptional()
  @IsString()
  reason?: string; // Purchase, Sale, Adjustment, Transfer, etc.

  @IsOptional()
  @IsString()
  notes?: string;
}