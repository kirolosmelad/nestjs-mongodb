import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import {
  GetUser,
  JWTPayload,
  Public,
  SkipEmailVerification,
} from '@app/shared';
import { LoginDto } from '../dto/login.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@SkipEmailVerification()
@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  //#region Register
  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);

    return {
      message: `Verification code is sent to ${data.user.email}`,
      ...data,
    };
  }
  //#endregion

  //#region Login
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  //#endregion

  //#region Verify Email
  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @GetUser() user: JWTPayload,
  ) {
    const loggedUser = await this.authService.verifyEmail(
      user.id,
      verifyEmailDto.code,
    );

    return {
      message: 'Your account is verified successfully 🚀',
      user: loggedUser,
    };
  }
  //#endregion

  //#region Re-send Verification Code
  @Get('/verification-code/resend')
  async resendVerificationCode(@GetUser() user: JWTPayload) {
    const { email } = await this.authService.resendVerificationCode(user.id);

    return {
      message: `Verification code is re-sent to ${email}`,
    };
  }
  //#endregion
}
