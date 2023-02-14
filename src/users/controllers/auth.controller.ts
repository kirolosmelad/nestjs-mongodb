import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  GetUser,
  JWTPayload,
  Public,
  SkipEmailVerification,
} from '@app/shared';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { GetForgetPasswordTokenDto } from '../dto/get-forget-password-token';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { SetNewPasswordDto } from '../dto/set-new-password.dto';
import { failureHTML, successHTML } from '../templates';

@SkipEmailVerification()
@Controller('users/auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  //#region Register
  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);

    // Delete Password
    data.user.password = undefined;
    // Remove Verification Code
    data.user.verificationCode = undefined;

    return {
      message: `Verification code is sent to ${data.user.email}`,
      ...data,
    };
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
    const data = await this.authService.resendVerificationCode(user.id);

    return {
      message: `Verification code has been re-sent to ${data.user.email}`,
      emailLink: data.emailLink,
    };
  }
  //#endregion

  //#region Login
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    // Delete Password
    data.user.password = undefined;

    return data;
  }
  //#endregion

  //#region Forget Password token
  @Public()
  @Post('/forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPasswordToken(
    @Body() getForgetPasswordTokenDto: GetForgetPasswordTokenDto,
  ) {
    const { emailLink } = await this.authService.getForgetPasswordToken(
      getForgetPasswordTokenDto,
    );

    return {
      message: `Reset password link has been sent to your email`,
      emailLink,
    };
  }
  //#endregion

  //#region Verify Set Password token
  @Public()
  @Get('/forget-password/verify/:token')
  async verifySetPasswordToken(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      await this.authService.verifySetPasswordToken(token);

      return res.send(successHTML);
    } catch (err) {
      return res.send(failureHTML);
    }
  }
  //#endregion

  //#region Set new Password
  @Public()
  @Post('/set-password')
  async setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    const data = await this.authService.setNewPassword(setNewPasswordDto);

    // remove password
    data.user.password = undefined;

    return data;
  }
  //#endregion
}
