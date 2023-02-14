import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
