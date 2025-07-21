import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateSaleStageDto {
  @IsString()
  stage: string; // lead, qualified, proposal, negotiation, closed_won, closed_lost

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  estimatedCloseDate?: string;

  @IsOptional()
  @IsString()
  lostReason?: string; // Required when moving to closed_lost

  @IsOptional()
  @IsString()
  nextAction?: string; // Next steps or follow-up actions
}