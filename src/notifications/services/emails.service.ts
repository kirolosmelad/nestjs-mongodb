import { Inject, Injectable } from '@nestjs/common';
import { SendVerificationEmailDto } from '../dto/send-verification-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {
  getVerificationCodeEmailSubject,
  getVerificationCodeTemplate,
} from '../templates';
import { getTestEmailURL } from '../utils/get-test-email-url';

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
    const data = await this.mailerService.sendMail({
      from: this.configService.get<string>('MAILER_FROM'),
      to: sendVerificationEmailDto.email,
      subject: getVerificationCodeEmailSubject,
      html: getVerificationCodeTemplate(
        sendVerificationEmailDto.name,
        sendVerificationEmailDto.code,
      ),
    });

    return getTestEmailURL(data);
  }
  //#endregion
}
