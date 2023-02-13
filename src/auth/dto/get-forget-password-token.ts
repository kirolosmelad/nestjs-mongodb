import { IsEmail, IsString } from 'class-validator';

export class GetForgetPasswordTokenDto {
  @IsString()
  @IsEmail()
  email: string;
}
