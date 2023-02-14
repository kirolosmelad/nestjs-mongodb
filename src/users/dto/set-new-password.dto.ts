import { IsJWT, IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  @IsJWT()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;
}
