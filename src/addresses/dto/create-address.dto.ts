import { Regex } from '@app/shared';
import {
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(3)
  label: string;

  @IsString()
  @MinLength(3)
  street: string;

  @IsString()
  @MinLength(3)
  city: string;

  @IsString()
  @MinLength(3)
  country: string;

  @IsNumberString()
  @Matches(Regex.zipCode, { message: 'Invalid zip code' })
  zipCode: string;

  @IsString()
  @IsOptional()
  @Matches(Regex.egyptianPhoneNumber, { message: 'Invalid Phone number' })
  phoneNumber: string;
}
