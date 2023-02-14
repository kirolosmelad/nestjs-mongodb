import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
