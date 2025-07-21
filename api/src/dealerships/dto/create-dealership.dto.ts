import { IsString, IsOptional, IsBoolean, IsObject, MinLength } from 'class-validator';

export class CreateDealershipDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsObject()
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @IsOptional()
  @IsString()
  timezone?: string = 'UTC';

  @IsOptional()
  @IsObject()
  businessHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}