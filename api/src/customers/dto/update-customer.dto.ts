import { IsString, IsEmail, IsOptional, MinLength, IsUUID, IsObject } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  primaryDealershipId?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @IsOptional()
  @IsObject()
  preferences?: {
    preferredContactMethod?: 'email' | 'phone' | 'sms';
    marketingOptIn?: boolean;
    serviceReminders?: boolean;
    newsletter?: boolean;
    preferredLanguage?: string;
  };
}