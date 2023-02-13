import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  code: string;

  @IsString()
  @MinLength(6)
  password: string;
}
