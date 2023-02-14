import { Regex } from '@app/shared';
import {
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  label?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  street?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  country?: string;

  @IsOptional()
  @IsNumberString()
  @Matches(Regex.zipCode, { message: 'Invalid zip code' })
  zipCode?: string;

  @IsString()
  @IsOptional()
  @Matches(Regex.egyptianPhoneNumber, { message: 'Invalid Phone number' })
  phoneNumber?: string;
}
