import { Inject, Injectable } from '@nestjs/common';
import { SendVerificationEmailDto } from '../dto/send-verification-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {
  getChangePasswordEmailSubject,
  getChangePasswordTemplate,
  getVerificationCodeEmailSubject,
  getVerificationCodeTemplate,
} from '../templates';
import { getTestEmailURL } from '../utils/get-test-email-url';
import { SendResetPasswordEmailDto } from '../dto/send-reset-password-email.dto';

@Injectable()
export class EmailsService {
  constructor(
    @Inject(MailerService) private mailerService: MailerService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  //#region Send Verification Code
  async sendVerificationCode(
    sendVerificationEmailDto: SendVerificationEmailDto,
  ): Promise<string> {
    const info = await this.mailerService.sendMail({
      from: this.configService.get<string>('MAILER_FROM'),
      to: sendVerificationEmailDto.email,
      subject: getVerificationCodeEmailSubject,
      html: getVerificationCodeTemplate(
        sendVerificationEmailDto.name,
        sendVerificationEmailDto.code,
      ),
    });

    return getTestEmailURL(info);
  }
  //#endregion

  //#region Send Reset passwod email
  async sendResetPasswordEmail(
    sendResetPasswordEmailDto: SendResetPasswordEmailDto,
  ): Promise<string> {
    const info = await this.mailerService.sendMail({
      from: this.configService.get<string>('MAILER_FROM'),
      to: sendResetPasswordEmailDto.email,
      subject: getChangePasswordEmailSubject,
      html: getChangePasswordTemplate(
        this.getResetPasswordLink(sendResetPasswordEmailDto.token),
      ),
    });

    return getTestEmailURL(info);
  }

  private getResetPasswordLink(token: string): string {
    return `${this.configService.get<string>(
      'FORGET_PASSWORD_BASE_URL',
    )}${token}`;
  }
  //#endregion
}
